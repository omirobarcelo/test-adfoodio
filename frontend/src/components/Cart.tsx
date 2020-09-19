import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link } from "react-router-dom";
import { Menu, MenuItem, OrderItem } from "../api.types";
import { useAppState } from "../store";

const defaultProps = {
  bgcolor: "background.paper",
  borderColor: "primary.main",
  m: 1,
  p: 1,
  border: 2,
  borderRadius: 8,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    priceContent: {
      display: "flex",
      width: "100%",
      marginLeft: "1rem",
    },
    totalPriceContent: {
      display: "flex",
      width: "100%",
      marginTop: "0.5rem",
    },
    price: {
      marginLeft: "auto",
    },
    buyBtn: {
      marginTop: "0.75rem",
      width: "100%",
    },
  })
);

export function CartComponent() {
  const classes = useStyles();
  const { menu, order } = useAppState();

  const compose = (menu: Menu, order: OrderItem[]): { menuItem: MenuItem; quantity: number }[] =>
    order.map((o) => ({ menuItem: menu.find((item) => item.id === o.menuId)!, quantity: o.quantity }));
  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100);

  return (
    <Box {...defaultProps}>
      {menu && menu.length !== 0 && order && (
        <List component="div" dense disablePadding data-testid="cart-list">
          {compose(menu, order.order).map((item) => (
            <ListItem key={item.menuItem.id} className={classes.listItemContent}>
              <ListItemText primary={item.menuItem.name} />
              <div className={classes.priceContent}>
                <div>{`x${item.quantity}`}</div>
                <div className={classes.price}>{formatPrice(item.quantity * item.menuItem.price)}</div>
              </div>
            </ListItem>
          ))}
        </List>
      )}
      <Divider variant="middle" />
      <div className={classes.totalPriceContent}>
        <div>Total price</div>
        <div className={classes.price}>{formatPrice(order.price)}</div>
      </div>
      {order.isDeal && (
        <Typography variant="h6" component="div" color="secondary" align="center">
          {order.deal?.name}
        </Typography>
      )}
      <Button variant="contained" color="primary" size="small" className={classes.buyBtn} component={Link} to="/order">
        Check Out
      </Button>
    </Box>
  );
}
