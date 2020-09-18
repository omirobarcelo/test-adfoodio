import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { CreateOrder, Menu } from "../api.types";
import * as store from "../store";
import { CartComponent } from "./Cart";

const TEST_MENU: Menu = [
  {
    id: 1,
    name: "Menu Item 1",
    price: 4000,
    type: "main",
  },
  {
    id: 2,
    name: "Menu Item 2",
    price: 2000,
    type: "drink",
  },
  {
    id: 3,
    name: "Menu Item 3",
    price: 1000,
    type: "dessert",
  },
];

const TEST_ORDER_NO_DEAL: CreateOrder = {
  order: [
    {
      menuId: 1,
      quantity: 1,
    },
    {
      menuId: 2,
      quantity: 1,
    },
  ],
  price: 6000,
  isDeal: false,
};

const TEST_ORDER_DEAL: CreateOrder = {
  order: [
    {
      menuId: 2,
      quantity: 1,
    },
    {
      menuId: 3,
      quantity: 1,
    },
  ],
  price: 2500,
  isDeal: true,
  deal: {
    id: 1,
    name: "Test Deal",
    price: 2500,
    conditions: [],
  },
};

test("deal does not show", () => {
  jest
    .spyOn(store, "useAppState")
    .mockReturnValue({ menu: TEST_MENU, order: TEST_ORDER_NO_DEAL } as any);
  const { getByText, queryByText } = render(
    <MemoryRouter>
      <CartComponent />
    </MemoryRouter>
  );
  const dealElement = queryByText("Test Deal");
  expect(dealElement).toBeNull();
  const priceElement = getByText("€60.00");
  expect(priceElement).toBeInTheDocument();
});

test("deal does show", () => {
  jest
    .spyOn(store, "useAppState")
    .mockReturnValue({ menu: TEST_MENU, order: TEST_ORDER_DEAL } as any);
  const { getByText } = render(
    <MemoryRouter>
      <CartComponent />
    </MemoryRouter>
  );
  const dealElement = getByText("Test Deal");
  expect(dealElement).toBeInTheDocument();
  const priceElement = getByText("€25.00");
  expect(priceElement).toBeInTheDocument();
});

test("cart list is rendered properly", () => {
  jest
    .spyOn(store, "useAppState")
    .mockReturnValue({ menu: TEST_MENU, order: TEST_ORDER_DEAL } as any);
  const { getByTestId } = render(
    <MemoryRouter>
      <CartComponent />
    </MemoryRouter>
  );
  const listElement = getByTestId("cart-list");
  expect(listElement).toBeInTheDocument();
  expect(listElement).toMatchInlineSnapshot(`
    <div
      class="MuiList-root MuiList-dense"
      data-testid="cart-list"
    >
      <li
        class="MuiListItem-root makeStyles-listItemContent-13 MuiListItem-dense MuiListItem-gutters"
      >
        <div
          class="MuiListItemText-root MuiListItemText-dense"
        >
          <span
            class="MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock"
          >
            Menu Item 2
          </span>
        </div>
        <div
          class="makeStyles-priceContent-14"
        >
          <div>
            x1
          </div>
          <div
            class="makeStyles-price-16"
          >
            €20.00
          </div>
        </div>
      </li>
      <li
        class="MuiListItem-root makeStyles-listItemContent-13 MuiListItem-dense MuiListItem-gutters"
      >
        <div
          class="MuiListItemText-root MuiListItemText-dense"
        >
          <span
            class="MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock"
          >
            Menu Item 3
          </span>
        </div>
        <div
          class="makeStyles-priceContent-14"
        >
          <div>
            x1
          </div>
          <div
            class="makeStyles-price-16"
          >
            €10.00
          </div>
        </div>
      </li>
    </div>
  `);
});
