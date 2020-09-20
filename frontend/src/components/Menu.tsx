import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { CreateOrder, Menu, MenuItem } from "../api.types";
import { useAppState, useDispatch } from "../store";
import { DealsComponent } from "./Deals";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
    newOrderBtn: {
      display: "block",
      marginTop: "1rem",
    },
  })
);

export function MenuComponent() {
  const classes = useStyles();
  const { menu, order } = useAppState();
  const dispatch = useDispatch();

  const nestMenu = (menu: Menu): { type: string; items: MenuItem[] }[] =>
    menu.reduce((acc, curr) => {
      const typeItems = acc.find((elem) => elem.type === curr.type);
      if (typeItems) {
        typeItems.items.push(curr);
      } else {
        acc.push({ type: curr.type, items: [curr] });
      }
      return acc;
    }, [] as { type: string; items: MenuItem[] }[]);

  const getOrderedQuantity = (id: number, order: CreateOrder): number => {
    const ordered = order.order.find((o) => o.menuId === id);
    return ordered ? ordered.quantity : 0;
  };

  return (
    <div>
      <Typography variant="h4" component="h1">
        Menu
      </Typography>

      {menu && (
        <List component="div" data-testid="menu-list">
          {nestMenu(menu).map((type) => (
            <React.Fragment key={type.type}>
              <ListItem>
                <ListItemText primary={type.type.toUpperCase()} />
              </ListItem>
              <List component="div" disablePadding dense={true}>
                {type.items.map((item) => (
                  <ListItem key={item.id} className={classes.nested}>
                    <ListItemText primary={item.name} />
                    <Input
                      value={getOrderedQuantity(item.id, order)}
                      type="number"
                      onChange={(evt) =>
                        dispatch({ type: "addOrderItem", payload: { menuId: item.id, quantity: +evt.target.value } })
                      }
                      data-testid={`input-${item.id}`}
                    />
                  </ListItem>
                ))}
              </List>
            </React.Fragment>
          ))}
        </List>
      )}
      <DealsComponent />
      <Button
        variant="contained"
        color="primary"
        className={classes.newOrderBtn}
        onClick={() => dispatch({ type: "newOrder" })}
      >
        New Order
      </Button>
    </div>
  );
}
