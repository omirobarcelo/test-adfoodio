import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { CreateOrder, Menu } from "../api.types";
import * as store from "../store";
import { OrderComponent } from "./Order";

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

const PICK_UP_TIME = "2020-09-19T18:19:14.000Z";

let spyDispatch: jest.SpyInstance;

beforeAll(() => jest.spyOn(window, "fetch"));

beforeEach(() => {
  jest
    .spyOn(store, "useAppState")
    .mockReturnValue({ menu: TEST_MENU, order: TEST_ORDER_NO_DEAL } as any);
  spyDispatch = jest.fn();
  jest.spyOn(store, "useDispatch").mockReturnValue(spyDispatch as any);
});

test("check title exists", () => {
  const { getByText } = render(<OrderComponent />);
  const titleElement = getByText("Order");
  expect(titleElement).toBeInTheDocument();
});

test("deal does not show", () => {
  const { getByText, queryByText } = render(<OrderComponent />);
  const dealElement = queryByText("Test Deal");
  expect(dealElement).toBeNull();
  const priceElement = getByText("€60.00");
  expect(priceElement).toBeInTheDocument();
});

test("deal does show", () => {
  jest
    .spyOn(store, "useAppState")
    .mockReturnValue({ menu: TEST_MENU, order: TEST_ORDER_DEAL } as any);
  const { getByText } = render(<OrderComponent />);
  const dealElement = getByText("Test Deal");
  expect(dealElement).toBeInTheDocument();
  const priceElement = getByText("€25.00");
  expect(priceElement).toBeInTheDocument();
});

test("check Buy button exists", () => {
  const { getByText } = render(<OrderComponent />);
  const buttonElement = getByText("Buy");
  expect(buttonElement).toBeInTheDocument();
});

test("Buy button creates the order and dispatches the correct action", async () => {
  ((window.fetch as any) as jest.SpyInstance).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ pickUpTime: PICK_UP_TIME }),
  });
  const { getByText } = render(<OrderComponent />);
  const buttonElement = getByText("Buy");
  fireEvent.click(buttonElement);
  expect(window.fetch).toHaveBeenCalledWith(
    "http://api.adfoodio.site/order",
    expect.objectContaining({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: TEST_ORDER_NO_DEAL.order,
        price: TEST_ORDER_NO_DEAL.price,
      }),
    })
  );
  // Flush promises
  await new Promise((resolve) => setImmediate(resolve));
  expect(spyDispatch).toHaveBeenCalledWith({
    type: "setPickUpTime",
    payload: new Date(PICK_UP_TIME),
  });
});

test("order list is rendered properly", () => {
  const { getByTestId } = render(<OrderComponent />);
  const listElement = getByTestId("order-list");
  expect(listElement).toBeInTheDocument();
  expect(listElement).toMatchInlineSnapshot(`
    <div
      class="MuiList-root MuiList-dense"
      data-testid="order-list"
    >
      <li
        class="MuiListItem-root makeStyles-listItemContent-26 MuiListItem-dense MuiListItem-gutters"
      >
        <div
          class="MuiListItemText-root MuiListItemText-dense"
        >
          <span
            class="MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock"
          >
            Menu Item 1
          </span>
        </div>
        <div
          class="makeStyles-priceContent-27"
        >
          <div>
            x1
          </div>
          <div
            class="makeStyles-price-29"
          >
            €40.00
          </div>
        </div>
      </li>
      <li
        class="MuiListItem-root makeStyles-listItemContent-26 MuiListItem-dense MuiListItem-gutters"
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
          class="makeStyles-priceContent-27"
        >
          <div>
            x1
          </div>
          <div
            class="makeStyles-price-29"
          >
            €20.00
          </div>
        </div>
      </li>
    </div>
  `);
});
