import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@mui/material/Alert';

// Alert Message Snackbar
export default function AlertMessage({ message, level }) {
    
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

  const [open, setOpen] = React.useState(true);
  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        variant="warning"
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={message}
      ><Alert severity={level}>{message}</Alert></Snackbar>
    </div>
  );
}