import React from "react";
import {Snackbar, Alert } from "@mui/material";

const AlertComponent = (props) => {
  const { onClose, message, severity } = props;
  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
