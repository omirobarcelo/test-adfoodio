import { DealEntity } from "./entity/deal.entity";
import { MenuEntity } from "./entity/menu.entity";
import { OrderEntity } from "./entity/order.entity";

export const MENU_DATA: MenuEntity[] = [
  {
    id: 1,
    name: "main1",
    price: 200,
    type: "main",
  },
  {
    id: 2,
    name: "main2",
    price: 200,
    type: "main",
  },
  {
    id: 3,
    name: "drink1",
    price: 200,
    type: "drink",
  },
  {
    id: 4,
    name: "dessert1",
    price: 200,
    type: "dessert",
  },
];

export const DEAL_DATA: DealEntity[] = [
  {
    id: 1,
    name: "deal1",
    price: 200,
    conditions: [
      {
        type: "main",
        quantity: 2,
      },
      {
        type: "drink",
        quantity: 1,
      },
    ],
  },
];

export const SENT_ORDER = {
  order: [
    {
      menuId: 1,
      quantity: 2,
    },
    {
      menuId: 5,
      quantity: 2,
    },
    {
      menuId: 11,
      quantity: 1,
    },
  ],
  price: 4000,
};

export const CREATED_ORDER = {
  ...SENT_ORDER,
  waitTime: 6,
};

export const ORDER_DATA: OrderEntity = {
  id: 1,
  order: [
    {
      menuId: 1,
      quantity: 2,
    },
    {
      menuId: 5,
      quantity: 2,
    },
    {
      menuId: 11,
      quantity: 1,
    },
  ],
  price: 4000,
  waitTime: 6,
};
