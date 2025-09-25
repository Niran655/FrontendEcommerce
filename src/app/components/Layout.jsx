import { Box } from "@mui/material";
// layout.jsx
import React, { useState } from "react";

import StorePage from "../(page)/store/page";
import SellerSidebar from "./SellerSidebar";
import Sidebar from "./Sidebar";
import Header from "./Header";
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleOpenStore = () => {
    setStoreOpen(true);
  };

  const handleCloseStore = () => {
    setStoreOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Header onSidebarToggle={handleSidebarToggle} onStoreOpen={handleOpenStore} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />
      <SellerSidebar open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Your main content */}
      </Box>
      <StorePage open={storeOpen} onClose={handleCloseStore} />
    </Box>
  );
}