"use client";
import { usePathname, useRouter, useParams } from "next/navigation";
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
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
  PackageSearch,
  ChartNoAxesGantt,
} from "lucide-react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORY_FOR_SHOP } from "../../../graphql/queries";
import { translateLauguage } from "../function/translate";
const drawerWidth = 240;

// Base static menu
const staticMenu = [
  {
    label: "dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["Admin", "Manager", "Cashier", "StockKeeper", "Seller"],
  },
  {
    label: "pos_system",
    icon: ShoppingCart,
    path: "/pos",
    roles: ["Admin", "Manager", "Cashier", "Seller"],
  },
  {
    label: "categorys",
    icon: ChartNoAxesGantt,
    path: "/categorys",
    roles: ["Admin", "Manager", "StockKeeper", "Seller"],
  },
  {
    label: "products",
    icon: Package,
    path: "/products",
    roles: ["Admin", "Manager", "StockKeeper", "Seller"],
  },
  {
    label: "stock_mg",
    icon: Warehouse,
    path: "/stock",
    roles: ["Admin", "Manager", "StockKeeper", "Seller"],
  },
  {
    label: "suppliers_po",
    icon: Truck,
    path: "/suppliers",
    roles: ["Admin", "Manager", "StockKeeper", "Seller"],
  },
  {
    label: "reports",
    icon: BarChart3,
    path: "/reports",
    roles: ["Admin", "Manager", "Seller"],
  },
  {
    label: "user_management",
    icon: Users,
    path: "/users",
    roles: ["Admin", "Manager", "Seller"],
  },
  {
    label: "settings",
    icon: Settings,
    path: "/settings",
    roles: ["Admin", "Manager"],
  },
  //===============USER ROLE=====================
  {
    label: "home",
    icon: Warehouse,
    path: "/home",
    roles: ["Manager", "User",],
  },
];


const SellerSidebar = ({ open, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const { id: storeId } = useParams();
  const { hasPermission } = useAuth();
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const { data, loading } = useQuery(GET_CATEGORY_FOR_SHOP, {
    variables: {
      shopId: id,
    },
  });

  const handleNavigation = (path) => {
    router.push(path);
    onClose && onClose();
  };

  const visibleMenuItems = staticMenu
    .filter((item) => hasPermission(item.roles))
    .map((item) => ({
      ...item,
      path: `/stores/${storeId}${item.path}`,
    }));

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
                      backgroundColor: "#1D293D",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "#1E2939",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive ? "inherit" : "action.active" }}
                  >
                    <IconComponent size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.label)}
                    primaryTypographyProps={{
                      variant: "body2",
                    }}
                  />
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
            data?.getCategoriesForShop.map((cat) => {
              const categoryPath = `/stores/${storeId}/product/category/${cat.id}`;
              const isActive = pathname === categoryPath;
              return (
                <ListItem key={cat.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(categoryPath)}
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
                    <ListItemText
                      primary={cat.name}
                      primaryTypographyProps={{
                        variant: "body2",
                      }}
                    />
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

export default SellerSidebar;
