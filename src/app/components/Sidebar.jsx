"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
} from "@mui/material";
import {
  BarChart3,
  Laptop,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
  PackageSearch,
  Smartphone,
  ChartNoAxesGantt,
  ChartBarStacked,
} from "lucide-react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORYS } from "../../../graphql/queries";

const drawerWidth = 240;

const staticMenu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["Admin", "Manager", "Cashier", "StockKeeper","Seller"],
  },
  {
    label: "POS System",
    icon: ShoppingCart,
    path: "/pos",
    roles: ["Admin", "Manager", "Cashier","Seller"],
  },
  {
    label: "Categorys",
    icon: ChartNoAxesGantt,
    path: "/categorys",
    roles: ["Admin", "Manager", "StockKeeper","Seller"],
  },
  {
    label: "Products",
    icon: Package,
    path: "/products",
    roles: ["Admin", "Manager", "StockKeeper","Seller"],
  },
  {
    label: "Stock Mg",
    icon: Warehouse,
    path: "/stock",
    roles: ["Admin", "Manager", "StockKeeper","Seller"],
  },
  {
    label: "Suppliers & PO",
    icon: Truck,
    path: "/suppliers",
    roles: ["Admin", "Manager", "StockKeeper","Seller"],
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
    roles: ["Admin", "Manager","Seller"],
  },
  {
    label: "User Management",
    icon: Users,
    path: "/users",
    roles: ["Admin", "Manager","Seller"],
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
    roles: ["Admin", "Manager","Seller"],
  },
  //===============USER ROLE=====================
  {
    label: "Home",
    icon: Warehouse,
    path: "/home",
    roles: ["Manager", "User"],
  },
];

const Sidebar = ({ open, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  // Get categories dynamically
  const { data, loading } = useQuery(GET_CATEGORYS);

  const handleNavigation = (path) => {
    router.push(path);
    onClose && onClose();
  };

  // Filter static menus by role
  const visibleMenuItems = staticMenu.filter((item) =>
    hasPermission(item.roles)
  );

  const DrawerContent = () => (
    <>
      <Toolbar />
      <Box sx={{ overflow: "auto", mt: 1 }}>
        <List>
          {visibleMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path;

            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive ? "inherit" : "action.active" }}
                  >
                    <IconComponent size={20} />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Divider for categories */}
        <Divider sx={{ my: 1 }} />
        <Typography alignItems={"center"} variant="body1" sx={{ px: 2, mt: 1 }}>
          Categories
        </Typography>

        <List>
          {loading ? (
            <Typography variant="body2" sx={{ px: 2 }}>
              Loading...
            </Typography>
          ) : (
            data?.categorys.map((cat) => {
              const isActive = pathname === `/product/category/${cat.name}`;
              return (
                <ListItem key={cat.id} disablePadding>
                  <ListItemButton
                    onClick={() =>
                      handleNavigation(`/product/category/${cat.name}`)
                    }
                    selected={isActive}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 1,
                      "&.Mui-selected": {
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                        "&:hover": {
                          backgroundColor: "primary.main",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: isActive ? "inherit" : "action.active" }}
                    >
                      <PackageSearch size={20} />
                    </ListItemIcon>
                    <ListItemText primary={cat.name} />
                  </ListItemButton>
                </ListItem>
              );
            })
          )}
        </List>
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <DrawerContent />
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        <DrawerContent />
      </Drawer>
    </>
  );
};

export default Sidebar;
  