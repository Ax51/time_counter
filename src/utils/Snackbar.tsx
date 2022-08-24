import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useSnackbarStore } from "../store/snackbarStore";

export default function App() {
  const {
    open,
    message,
    severity,
    button,
    anchorOrigin,
    closeSnackbar: handleClose,
  } = useSnackbarStore((state) => state);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        sx={{ width: "100%", bgcolor: `${[severity]}.light` }}
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={severity}
        action={button}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
