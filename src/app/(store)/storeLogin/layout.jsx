"use client";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Switch from "@mui/material/Switch";
import Menu from "@mui/material/Menu";
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
