export type MenuItem = { id: number; name: string; price: number; type: string };
export type Menu = MenuItem[];

export type Condition = { type: string; quantity: number };
export type Deal = { id: number; name: string; price: number; conditions: Condition[] };

export type OrderItem = { menuId: number; quantity: number };
export type Order = { id: number; order: OrderItem[]; price: number; pickUpTime: Date };
export type CreateOrder = { order: OrderItem[]; price: number; isDeal: boolean; deal?: Deal };
