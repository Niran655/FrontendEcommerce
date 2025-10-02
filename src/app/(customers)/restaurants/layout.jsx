"use client";
import { Box, Toolbar } from "@mui/material";
import React, { useState } from "react";
import Sidebar from "../../components/resturants/Sidebar";
import Header from "../../components/Header";
import "../../globals.css";
// import StorePage from "../../(store)/";
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

    const [storeOpen, setStoreOpen] = useState(false);
  
    const handleOpenStore = () => {
      setStoreOpen(true);
    };
  
    const handleCloseStore = () => {
      setStoreOpen(false);
    };
  

  return (
    <Box sx={{ display: "flex" }}>
      <Header onSidebarToggle={handleSidebarToggle}  onStoreOpen={handleOpenStore} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle}   />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "100vh",
          ml: { md: "240px" },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
