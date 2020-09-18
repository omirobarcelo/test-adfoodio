import { CreateOrder, Deal, Menu, MenuItem, OrderItem } from "./api.types";

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

export const updateOrder = (order: OrderItem[], newItem: OrderItem, menu: Menu, deals: Deal[]): CreateOrder => {
  let newOrder = [...order];
  // Increment the quantity if the item is already there, otherwise add it
  const itemIdx = newOrder.findIndex((item) => item.menuId === newItem.menuId);
  if (itemIdx < 0) {
    newOrder = [...newOrder, newItem as OrderItem];
  } else {
    newOrder = newOrder.map((item, idx) =>
      idx === itemIdx ? { ...item, quantity: item.quantity + newItem.quantity } : item
    );
  }
  // Expand the order to include the full menu item
  const completeOrder = newOrder.map((item) => ({
    menuItem: menu.find((mItem) => mItem.id === item.menuId),
    quantity: item.quantity,
  }));
  // Check if it is a deal, and update the price accordingly
  const { isDeal, deal } = isItADeal(completeOrder, deals);
  const price = isDeal
    ? deal?.price!
    : completeOrder.reduce((acc, curr) => (acc += curr.menuItem?.price! * curr.quantity), 0);
  return { order: newOrder, price, isDeal, deal };
};
