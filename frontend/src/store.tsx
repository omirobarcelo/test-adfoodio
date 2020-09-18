import React, { createContext, Reducer, useContext, useEffect, useReducer } from "react";
import { CreateOrder, Deal, Menu, MenuItem, OrderItem } from "./api.types";

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

const isItADeal = (order: { menuItem: MenuItem | undefined; quantity: number }[], deals: Deal[]) => {
  // Transform order to array of menu item type and quantity
  const orderByTypes = order
    .map((item) => ({ type: item.menuItem?.type, quantity: item.quantity }))
    .reduce((acc, curr) => {
      // Find if the type was already inserted
      const typeQuantity = acc.find((elem) => elem.type === curr.type);
      if (typeQuantity) {
        // If it was inserted, increase the quantity for the type
        typeQuantity.quantity += curr.quantity;
      } else {
        // Else, add the type
        acc.push(curr);
      }
      return acc;
    }, [] as { type: string | undefined; quantity: number }[]);
  // Find a deal that fulfills the conditions
  // We filter the conditions using orderByTypes, if the number of conditions remain the same, then it's a deal
  const deal = deals.find(
    (d) =>
      d.conditions.length === orderByTypes.length &&
      d.conditions.filter((c) => orderByTypes.some((o) => c.type === o.type && c.quantity === o.quantity)).length ===
        d.conditions.length
  );
  return { isDeal: !!deal, deal };
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
        let newOrder = [...state.order.order];
        // Increment the quantity if the item is already there, otherwise add it
        const itemIdx = newOrder.findIndex((item) => item.menuId === action.payload.menuId);
        if (itemIdx < 0) {
          newOrder = [...newOrder, action.payload as OrderItem];
        } else {
          newOrder = newOrder.map((item, idx) =>
            idx === itemIdx ? { ...item, quantity: item.quantity + action.payload.quantity } : item
          );
        }
        // Expand the order to include the full menu item
        const completeOrder = newOrder.map((item) => ({
          menuItem: state.menu.find((mItem) => mItem.id === item.menuId),
          quantity: item.quantity,
        }));
        // Check if it is a deal, and update the price accordingly
        const { isDeal, deal } = isItADeal(completeOrder, state.deals);
        const price = isDeal
          ? deal?.price!
          : completeOrder.reduce((acc, curr) => (acc += curr.menuItem?.price! * curr.quantity), 0);
        const updatedOrder = { ...state.order, order: newOrder, price, isDeal, deal };
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
