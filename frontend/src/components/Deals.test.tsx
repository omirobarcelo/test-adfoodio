import React from "react";
import { render } from "@testing-library/react";
import { DealsComponent } from "./Deals";
import * as store from "../store";
import { Deal } from "../api.types";

const TEST_DEALS: Deal[] = [
  {
    id: 1,
    name: "Test Deal",
    price: 4000,
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

test("check deals button exists", () => {
  const { getByText } = render(<DealsComponent />);
  const buttonElement = getByText("CHECK DEALS!") as HTMLButtonElement;
  expect(buttonElement).toBeInTheDocument();
});

test("button opens the dialog", () => {
  const { getByText, getByRole } = render(<DealsComponent />);
  const buttonElement = getByText("CHECK DEALS!") as HTMLButtonElement;
  buttonElement.click();
  const dialogElement = getByRole("dialog");
  expect(dialogElement).toBeInTheDocument();
});

test("dialog is rendered properly", () => {
  jest
    .spyOn(store, "useAppState")
    .mockReturnValue({ deals: TEST_DEALS } as any);
  const { getByText, getByRole } = render(<DealsComponent />);
  const buttonElement = getByText("CHECK DEALS!") as HTMLButtonElement;
  buttonElement.click();
  const dialogElement = getByRole("dialog");
  expect(dialogElement).toMatchInlineSnapshot(`
    <div
      aria-labelledby="deals-dialog"
      class="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded"
      role="dialog"
    >
      <div
        class="MuiDialogTitle-root"
        id="dialog-title"
      >
        <h2
          class="MuiTypography-root MuiTypography-h6"
        >
          Deals!
        </h2>
      </div>
      <div
        class="MuiList-root"
      >
        <li
          class="MuiListItem-root MuiListItem-gutters"
        >
          <div
            class="MuiListItemText-root MuiListItemText-multiline"
          >
            <span
              class="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock"
            >
              Test Deal
            </span>
            <p
              class="MuiTypography-root MuiListItemText-secondary MuiTypography-body2 MuiTypography-colorTextSecondary MuiTypography-displayBlock"
            >
              Get 2 mains + 1 drink for €40.00
            </p>
          </div>
        </li>
      </div>
    </div>
  `);
});
