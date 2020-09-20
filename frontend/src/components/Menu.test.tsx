import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { CreateOrder, Menu } from "../api.types";
import * as store from "../store";
import { MenuComponent } from "./Menu";

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

const TEST_ORDER: CreateOrder = {
  order: [],
  price: 0,
  isDeal: false,
};

let spyDispatch: jest.SpyInstance;

beforeEach(() => {
  jest.spyOn(store, "useAppState").mockReturnValue({ menu: TEST_MENU, order: TEST_ORDER } as any);
  spyDispatch = jest.fn();
  jest.spyOn(store, "useDispatch").mockReturnValue(spyDispatch as any);
});

test("check title exists", () => {
  const { getByText } = render(<MenuComponent />);
  const titleElement = getByText("Menu");
  expect(titleElement).toBeInTheDocument();
});

test("check menu list exists", () => {
  const { getByTestId } = render(<MenuComponent />);
  const listElement = getByTestId("menu-list");
  expect(listElement).toBeInTheDocument();
});

test("input dispatches correct action", () => {
  const { getByTestId } = render(<MenuComponent />);
  const inputElement = getByTestId("input-2");
  expect(inputElement).toBeInTheDocument();
  fireEvent.change(inputElement.firstElementChild as HTMLInputElement, {
    target: { value: "3" },
  });
  expect(spyDispatch).toHaveBeenCalledWith({
    type: "addOrderItem",
    payload: { menuId: 2, quantity: 3 },
  });
});

test("list is rendered properly", () => {
  const { getByTestId } = render(<MenuComponent />);
  const listElement = getByTestId("menu-list");
  expect(listElement).toBeInTheDocument();
  expect(listElement).toMatchInlineSnapshot(`
    <div
      class="MuiList-root MuiList-padding"
      data-testid="menu-list"
    >
      <li
        class="MuiListItem-root MuiListItem-gutters"
      >
        <div
          class="MuiListItemText-root"
        >
          <span
            class="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock"
          >
            MAIN
          </span>
        </div>
      </li>
      <div
        class="MuiList-root MuiList-dense"
      >
        <li
          class="MuiListItem-root makeStyles-nested-7 MuiListItem-dense MuiListItem-gutters"
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
            class="MuiInputBase-root MuiInput-root MuiInput-underline"
            data-testid="input-1"
          >
            <input
              class="MuiInputBase-input MuiInput-input"
              type="number"
              value="0"
            />
          </div>
        </li>
      </div>
      <li
        class="MuiListItem-root MuiListItem-gutters"
      >
        <div
          class="MuiListItemText-root"
        >
          <span
            class="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock"
          >
            DRINK
          </span>
        </div>
      </li>
      <div
        class="MuiList-root MuiList-dense"
      >
        <li
          class="MuiListItem-root makeStyles-nested-7 MuiListItem-dense MuiListItem-gutters"
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
            class="MuiInputBase-root MuiInput-root MuiInput-underline"
            data-testid="input-2"
          >
            <input
              class="MuiInputBase-input MuiInput-input"
              type="number"
              value="0"
            />
          </div>
        </li>
      </div>
      <li
        class="MuiListItem-root MuiListItem-gutters"
      >
        <div
          class="MuiListItemText-root"
        >
          <span
            class="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock"
          >
            DESSERT
          </span>
        </div>
      </li>
      <div
        class="MuiList-root MuiList-dense"
      >
        <li
          class="MuiListItem-root makeStyles-nested-7 MuiListItem-dense MuiListItem-gutters"
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
            class="MuiInputBase-root MuiInput-root MuiInput-underline"
            data-testid="input-3"
          >
            <input
              class="MuiInputBase-input MuiInput-input"
              type="number"
              value="0"
            />
          </div>
        </li>
      </div>
    </div>
  `);
});
