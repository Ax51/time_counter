import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useStore } from "../store";

export default function App() {
  const { open, message, severity, button, anchorOrigin } = useStore(
    (state) => state.snackbar.props,
  );
  const handleClose = useStore((state) => state.snackbar.closeSnackbar);

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
