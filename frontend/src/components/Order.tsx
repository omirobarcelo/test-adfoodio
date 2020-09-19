import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Menu, MenuItem, OrderItem } from "../api.types";
import { useAppState, useDispatch } from "../store";

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
    buyBtnContainer: {
      marginTop: "0.75rem",
      display: "flex",
      flexDirection: "row-reverse",
    },
  })
);

export function OrderComponent() {
  const classes = useStyles();
  const { menu, order, pickUpTime } = useAppState();
  const dispatch = useDispatch();

  const compose = (menu: Menu, order: OrderItem[]): { menuItem: MenuItem; quantity: number }[] =>
    order.map((o) => ({ menuItem: menu.find((item) => item.id === o.menuId)!, quantity: o.quantity }));
  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100);

  const handleClick = () => {
    fetch("http://api.adfoodio.site/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order: order.order, price: order.price }),
    })
      .then((res) => res.json() as Promise<{ pickUpTime: string }>)
      .then(({ pickUpTime }) => dispatch({ type: "setPickUpTime", payload: new Date(pickUpTime) }));
  };

  const formatPickUpMsg = (pickUpTime: Date) => {
    const diffMs = pickUpTime.getTime() - Date.now();
    return diffMs > 0 ? `Your order will be ready in ${Math.floor(diffMs / 1000)} seconds.` : `Your order is ready!`;
  };

  return (
    <React.Fragment>
      <Typography variant="h4" component="h1">
        Order
      </Typography>

      {menu && menu.length !== 0 && order && (
        <List component="div" dense disablePadding data-testid="order-list">
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
      <Typography variant="h6" component="div" className={classes.totalPriceContent}>
        <div>Total price</div>
        <div className={classes.price}>{formatPrice(order.price)}</div>
      </Typography>
      {order.isDeal && (
        <Typography variant="h6" component="div" color="secondary" align="center">
          {order.deal?.name}
        </Typography>
      )}
      <div className={classes.buyBtnContainer}>
        <Button variant="contained" color="primary" size="large" onClick={handleClick}>
          Buy
        </Button>
      </div>
      {pickUpTime && (
        <Typography variant="body1" component="div">
          {formatPickUpMsg(pickUpTime)}
        </Typography>
      )}
    </React.Fragment>
  );
}
