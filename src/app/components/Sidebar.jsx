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
import React, { useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@apollo/client/react";
import { GET_ADMIN_CATEGORY } from "../../../graphql/queries";
import { translateLauguage } from "../function/translate";
const drawerWidth = 240;

const staticMenu = [
  {
    label: "dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["Admin", "Manager", "Cashier", "StockKeeper", "Seller"],
  },
  // {
  //   label: "pos_system",
  //   icon: ShoppingCart,
  //   path: "/pos",
  //   roles: ["Admin", "Manager", "Cashier", "Seller"],
  // },
  {
    label: "categorys",
    icon: ChartNoAxesGantt,
    path: "/categorys",
    roles: ["Admin", "Manager", "StockKeeper", "Seller"],
  },
  // {
  //   label: "products",
  //   icon: Package,
  //   path: "/products",
  //   roles: [ "Manager", "StockKeeper", "Seller"],
  // },
  // {
  //   label: "stock_mg",
  //   icon: Warehouse,
  //   path: "/stock",
  //   roles: [ "Manager", "StockKeeper", "Seller"],
  // },
  // {
  //   label: "suppliers_po",
  //   icon: Truck,
  //   path: "/suppliers",
  //   roles: ["Manager", "StockKeeper", "Seller"],
  // },
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
    roles: ["Admin", "Manager", "Seller"],
  },
  //===============USER ROLE=====================
  {
    label: "home",
    icon: Warehouse,
    path: "/home",
    roles: ["Manager", "User"],
  },
];

const Sidebar = ({ open, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission } = useAuth();
  const drawerRef = useRef(null);

  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const { data, loading } = useQuery(GET_ADMIN_CATEGORY);

  const handleNavigation = (path) => {
    if (drawerRef.current) {
      sessionStorage.setItem(
        "sidebarScroll",
        drawerRef.current.scrollTop.toString()
      );
    }

    router.push(path);
    onClose && onClose();
  };

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebarScroll");
    if (savedScroll && drawerRef.current) {
      const scrollPosition = parseInt(savedScroll);
      drawerRef.current.scrollTop = scrollPosition;

      sessionStorage.removeItem("sidebarScroll");
    }
  }, [pathname]);

  const visibleMenuItems = staticMenu.filter((item) =>
    hasPermission(item.roles)
  );

  const DrawerContent = () => (
    <>
      <Toolbar />
      <Box
        ref={drawerRef}
        sx={{
          overflow: "auto",
          mt: 1,
          height: "calc(100vh - 64px)",
          overscrollBehavior: "contain",
        }}
      >
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
                      backgroundColor: "#000000ff",
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
            data?.getParentCategoryForAdmin.map((cat) => {
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
