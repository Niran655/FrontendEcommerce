"use client";
import Box from "@mui/material/Box";
import { useState } from "react";
import Header from "@/app/components/Header";

export default function StorsLayout({ children }) {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>

      <Header/>
      <Box>{children}</Box>
    </Box>
  );
}
