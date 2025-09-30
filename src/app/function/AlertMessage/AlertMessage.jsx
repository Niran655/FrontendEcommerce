"use client";

import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAuth } from "@/app/context/AuthContext";
import "./alertmessage.scss"
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertMessage() {
  const { alertOpen, alertStatus, messageAlert, closeAlert, language } =
    useAuth();

  const handleCloseAlert = (_event, reason) => {
    if (reason === "clickaway") return;
    closeAlert();
  };

  return (
    <Snackbar
      open={alertOpen}
      autoHideDuration={3000}
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      {alertStatus && (
        <Alert
          severity={alertStatus}
          onClose={handleCloseAlert}
          className={`alert-message alert-${alertStatus}`}
        >
          {language === "en"
            ? messageAlert?.messageEn
            : messageAlert?.messageKh}
        </Alert>
      )}
    </Snackbar>
  );
}
