import React, { createContext, Reducer, useContext, useEffect, useReducer } from "react";
import { CreateOrder, Deal, Menu } from "./api.types";
import { updateOrder } from "./store.utils";

const ORDER_STORAGE = "adfoodio-order";
const PICKUP_STORAGE = "addfoodio-pickUpTime";

const INITIAL_ORDER = {
  order: [],
  price: 0,
  isDeal: false,
};

type State = { menu: Menu; deals: Deal[]; order: CreateOrder; pickUpTime?: Date };
type ActionType = "setMenuAndDeals" | "addOrderItem" | "setPickUpTime" | "newOrder";
type Action = { type: ActionType; payload?: any };
type Dispatch = (action: Action) => void;

const initialState: State = {
  menu: [],
  deals: [],
  order: localStorage.getItem(ORDER_STORAGE)
    ? JSON.parse(localStorage.getItem(ORDER_STORAGE)!)
    : INITIAL_ORDER,
  pickUpTime: localStorage.getItem(PICKUP_STORAGE) ? new Date(localStorage.getItem(PICKUP_STORAGE)!) : undefined,
};

const stateContext = createContext<State | undefined>(initialState);
const { Provider: StoreProvider } = stateContext;
const dispatchContext = createContext<Dispatch | undefined>(undefined);
const { Provider: DispatchProvider } = dispatchContext;

const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>((state, action) => {
    switch (action.type) {
      case "setMenuAndDeals":
        return { ...state, menu: action.payload.menu, deals: action.payload.deals };
      case "addOrderItem":
        const updatedOrder = {
          ...state.order,
          ...updateOrder(state.order.order, action.payload, state.menu, state.deals),
        };
        // Save order in local storage for session preservation
        localStorage.setItem(ORDER_STORAGE, JSON.stringify(updatedOrder));
        return { ...state, order: updatedOrder };
      case "setPickUpTime":
        localStorage.setItem(PICKUP_STORAGE, (action.payload as Date).toISOString());
        return { ...state, pickUpTime: action.payload };
      case "newOrder":
        localStorage.removeItem(ORDER_STORAGE);
        localStorage.removeItem(PICKUP_STORAGE);
        return { ...state, order: INITIAL_ORDER, pickUpTime: undefined };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }, initialState);

  useEffect(() => {
    const getMenu = fetch("http://api.adfoodio.site/menu").then((res) => res.json() as Promise<Menu>);
    const getDeals = fetch("http://api.adfoodio.site/deal").then((res) => res.json() as Promise<Deal[]>);
    Promise.all([getMenu, getDeals]).then(([menu, deals]) => {
      dispatch({
        type: "setMenuAndDeals",
        payload: { menu, deals },
      });
    });
  }, []);

  return (
    <StoreProvider value={state}>
      <DispatchProvider value={dispatch}>{children}</DispatchProvider>
    </StoreProvider>
  );
};

const useAppState = () => {
  const context = useContext(stateContext);
  if (context === undefined) {
    throw new Error("useState must be used within a StateProvider");
  }
  return context;
};

const useDispatch = () => {
  const context = useContext(dispatchContext);
  if (context === undefined) {
    throw new Error("useDispatch must be used within a StateProvider");
  }
  return context;
};

const useStore = () => [useAppState(), useDispatch()];

export { StateProvider, useAppState, useDispatch, useStore };
