import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { Condition, Deal } from "../api.types";
import { useAppState } from "../store";

function DealsDialog(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props;
  const { deals } = useAppState();

  const formatConditions = (conditions: Condition[]): string =>
    conditions.map((c) => `${c.quantity} ${c.quantity > 1 ? c.type + "s" : c.type}`).join(" + ");
  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100);
  const formatDealDescription = (deal: Deal): string =>
    `Get ${formatConditions(deal.conditions)} for ${formatPrice(deal.price)}`;

  return (
    <Dialog onClose={() => onClose()} aria-labelledby="deals-dialog" open={open}>
      <DialogTitle id="dialog-title">Deals!</DialogTitle>
      {deals && (
        <List component="div" disablePadding>
          {deals.map((deal) => (
            <ListItem key={deal.id}>
              <ListItemText primary={deal.name} secondary={formatDealDescription(deal)} />
            </ListItem>
          ))}
        </List>
      )}
    </Dialog>
  );
}

export function DealsComponent() {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        CHECK DEALS!
      </Button>
      <DealsDialog open={open} onClose={() => setOpen(false)} />
    </React.Fragment>
  );
}
