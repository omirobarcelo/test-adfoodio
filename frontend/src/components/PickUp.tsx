import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import React from "react";
import { useAppState } from "../store";

export function PickUpComponent() {
  const { pickUpTime } = useAppState();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    if (pickUpTime) {
      const diffMs = pickUpTime.getTime() - Date.now();
      if (diffMs > 0) {
        // If it is not yet pick up time, program notification
        setTimeout(() => setOpen(true), diffMs);
      } else {
        // Else, show immediately the notification
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  React.useEffect(handleOpen, [pickUpTime]);

  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert elevation={6} variant="filled" severity="success" onClose={handleClose}>
        Your order is ready for pick up!
      </Alert>
    </Snackbar>
  );
}
