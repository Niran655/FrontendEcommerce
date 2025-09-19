"use client";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Coffee, LogOut, Settings, User, Store,ShoppingCart,Bell } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
const Header = ({ onSidebarToggle,onStoreOpen }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openNotification, setOpenNotification] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenNotification = (event) => {
    setOpenNotification(event.currentTarget);
  };
  const handleCloseNotification = (event) => {
    setOpenNotification(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push("/login");
  };

  const getRoleColor = (role) => {
    const colors = {
      Admin: "error",
      Manager: "warning",
      Cashier: "info",
      StockKeeper: "success",
    };
    return colors[role] || "default";
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {/* <Coffee size={28} style={{ marginRight: 12 }} /> */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open sidebar"
          onClick={onSidebarToggle}
          sx={{ mr: 2, display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Ecomerce
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton href="pos" color="white">
            <ShoppingCart color="white" />
          </IconButton>
          <IconButton color="white" onClick={handleOpenNotification}>
            <Bell  />
          </IconButton>
          <IconButton onClick={onStoreOpen}>
            <Store color="white" />
          </IconButton>
          <Chip
            label={user?.role}
            color={getRoleColor(user?.role)}
            variant="outlined"
            size="small"
            sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
          />
          <Button
            onClick={handleMenuOpen}
            sx={{ color: "white", textTransform: "none" }}
            startIcon={
              <Avatar sx={{ width: 32, height: 32 }}>{user?.name?.[0]}</Avatar>
            }
          >
            {user?.name}
          </Button>
        </Box>
        <Menu
          anchorEl={openNotification}
          open={Boolean(openNotification)}
          onClose={handleCloseNotification}
          onClick={handleCloseNotification}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <User size={18} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <User size={18} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Settings size={18} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
