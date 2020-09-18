import React, { createContext, Reducer, useContext, useEffect, useReducer } from "react";
import { CreateOrder, Deal, Menu } from "./api.types";
import { updateOrder } from "./store.utils";

type State = { menu: Menu; deals: Deal[]; order: CreateOrder };
type ActionType = "setMenuAndDeals" | "addOrderItem";
type Action = { type: ActionType; payload?: any };
type Dispatch = (action: Action) => void;

const initialState: State = {
  menu: [],
  deals: [],
  order: localStorage.getItem("adfoodio-order")
    ? JSON.parse(localStorage.getItem("adfoodio-order")!)
    : {
        order: [],
        price: 0,
        isDeal: false,
      },
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
        localStorage.setItem("adfoodio-order", JSON.stringify(updatedOrder));
        return { ...state, order: updatedOrder };
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
