import { ReactNode } from "react";
import create from "zustand";

type severityT = "success" | "warning" | "error";

type anchorOriginT = {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};

type buttonT = null | ReactNode;

interface openSnackbarProps {
  text: string;
  severity?: severityT;
  button?: buttonT;
  anchorOrigin?: anchorOriginT;
}

interface store {
  open: boolean;
  message: string;
  severity: severityT;
  button: buttonT;
  anchorOrigin: anchorOriginT;
  closeSnackbar: () => void;
  openSnackbar: (props: openSnackbarProps) => void;
}

export const useSnackbarStore = create<store>()((set) => ({
  open: false,
  message: "",
  severity: "success",
  button: null,
  anchorOrigin: { vertical: "top", horizontal: "right" },
  closeSnackbar() {
    set({ open: false });
  },
  openSnackbar({
    text: message = "",
    severity = "success",
    button = null,
    anchorOrigin = { vertical: "top", horizontal: "right" },
  }: openSnackbarProps) {
    set({
      open: true,
      message,
      severity,
      button,
      anchorOrigin,
    });
  },
}));
