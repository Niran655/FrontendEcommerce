// "use client";
// import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
// import {
//   AppBar,
//   Avatar,
//   Box,
//   Button,
//   Chip,
//   IconButton,
//   ListItemIcon,
//   ListItemText,
//   Menu,
//   MenuItem,
//   Toolbar,
//   Typography,
// } from "@mui/material";
// import {
//   Coffee,
//   LogOut,
//   Settings,
//   User,
//   Store,
//   ShoppingCart,
//   Bell,
// } from "lucide-react";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../context/AuthContext";
// import MenuIcon from "@mui/icons-material/Menu";
// import { Warehouse } from "lucide-react";
// const Header = ({ onSidebarToggle, onStoreOpen }) => {
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [openNotification, setOpenNotification] = useState(null);
//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleOpenNotification = (event) => {
//     setOpenNotification(event.currentTarget);
//   };
//   const handleCloseNotification = (event) => {
//     setOpenNotification(null);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     handleMenuClose();
//     router.push("/login");
//   };

//   const getRoleColor = (role) => {
//     const colors = {
//       Admin: "error",
//       Manager: "warning",
//       Cashier: "info",
//       StockKeeper: "success",
//     };
//     return colors[role] || "default";
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#1D293D", }}

//     >
//       <Toolbar>
//         {/* <Coffee size={28} style={{ marginRight: 12 }} /> */}
//         <IconButton
//           edge="start"
//           color="inherit"
//           aria-label="open sidebar"
//           onClick={onSidebarToggle}
//           sx={{ mr: 2, display: { xs: "block", md: "none" }}}
//         >
//           <MenuIcon />
//         </IconButton>

//         <Typography variant="h6" component="div" sx={{ flexGrow: 1, }}>
//            GLOBAL ECOMMERCE
//         </Typography>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <IconButton href="pos" color="white">
//             <ShoppingCart color="white" />
//           </IconButton>
//           <IconButton  onClick={handleOpenNotification}>
//             <Bell color="white"/>
//           </IconButton>
//           {/* <IconButton onClick={onStoreOpen}>
//             <Store color="white" />
//           </IconButton> */}
//           <IconButton href="/storeLogin">
//             <Warehouse color="white" />
//           </IconButton>
//           <Chip
//             label={user?.role}
//             color={getRoleColor(user?.role)}
//             variant="outlined"
//             size="small"
//             sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
//           />
//           <Button
//             onClick={handleMenuOpen}
//             sx={{ color: "white", textTransform: "none" }}
//             startIcon={
//               <Avatar sx={{ width: 32, height: 32 }}>{user?.name?.[0]}</Avatar>
//             }
//           >
//             {user?.name}
//           </Button>
//         </Box>
//         <Menu
//           anchorEl={openNotification}
//           open={Boolean(openNotification)}
//           onClose={handleCloseNotification}
//           onClick={handleCloseNotification}
//         >
//           <MenuItem onClick={handleMenuClose}>
//             <ListItemIcon>
//               <User size={18} />
//             </ListItemIcon>
//             <ListItemText primary="Profile" />
//           </MenuItem>
//         </Menu>

//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//           onClick={handleMenuClose}
//         >
//           <MenuItem onClick={handleMenuClose}>
//             <ListItemIcon>
//               <User size={18} />
//             </ListItemIcon>
//             <ListItemText primary="Profile" />
//           </MenuItem>
//           <MenuItem onClick={handleMenuClose}>
//             <ListItemIcon>
//               <Settings size={18} />
//             </ListItemIcon>
//             <ListItemText primary="Settings" />
//           </MenuItem>
//           <MenuItem onClick={handleLogout}>
//             <ListItemIcon>
//               <LogOut size={18} />
//             </ListItemIcon>
//             <ListItemText primary="Logout" />
//           </MenuItem>
//         </Menu>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;

"use client";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MenuIcon from "@mui/icons-material/Menu";
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
  Stack,
} from "@mui/material";
import {
  LogOut,
  Settings,
  User,
  Store,
  ShoppingCart,
  Bell,
  Warehouse,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import "../../../style/Header.css"
// ---- flag images ----
import CambodiaFlag from "../../../public/image/cambodiaflag.png";
import EnglishFlag from "../../../public/image/englishflag.png";

import { translateLauguage } from "../function/translate";
import Image from "next/image";

const Header = ({ onSidebarToggle, onStoreOpen }) => {
  const { user, logout, changeLanguage, language } = useAuth();
  const router = useRouter();
  const { t } = translateLauguage(language);

  // ===== User & Notification Menus =====
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNotification, setOpenNotification] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenNotification = (event) =>
    setOpenNotification(event.currentTarget);
  const handleCloseNotification = () => setOpenNotification(null);

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

  // ===== Language Switcher =====
  const languages = [
    { code: "en", name: "English", flag: EnglishFlag },
    { code: "kh", name: "ភាសាខ្មែរ", flag: CambodiaFlag },

  ];

  const currentLang = languages.find((lang) => lang.code === language) || languages[0];
  const [selectedFlag, setSelectedFlag] = useState(currentLang.flag);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLang.name);
  const [anchorLang, setAnchorLang] = useState(null);
  const [openLangMenu, setOpenLangMenu] = useState(false);

  const handleLangClick = (event) => {
    setAnchorLang(event.currentTarget);
    setOpenLangMenu(!openLangMenu);
  };
  const handleLangClose = () => {
    setAnchorLang(null);
    setOpenLangMenu(false);
  };
  const handleFlagChange = (flag, languageCode, languageName) => {
    setSelectedFlag(flag);
    setSelectedLanguage(languageName);
    changeLanguage(languageCode);
    handleLangClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#1D293D",
      }}
    >
      <Toolbar>
        {/* Sidebar toggle */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open sidebar"
          onClick={onSidebarToggle}
          sx={{ mr: 2, display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
     
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GLOBAL ECOMMERCE 
        </Typography>



        {/* Right Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton href="pos" color="white">
            <ShoppingCart className="glass-background" size={33} color="white" />
          </IconButton>

          <IconButton onClick={handleOpenNotification}>
            <Bell className="glass-background" size={33} color="white" />
          </IconButton>

          <IconButton  href="/storeLogin">
            <Warehouse className="glass-background" size={33} color="white" />
          </IconButton>

          {/* Language Switcher */}
          <Button
            onClick={handleLangClick}
            className="glass-background"
            sx={{ color: "white", textTransform: "none", px: 1 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Image src={selectedFlag} alt="flag" width={29} />
              <Typography variant="body2" color="white" >{selectedLanguage}</Typography>
            </Stack>
          </Button>

          <Menu
            anchorEl={anchorLang}
            open={openLangMenu}
            onClose={handleLangClose}
            PaperProps={{
              elevation: 2,
              sx: {
                mt: 1.5,
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {languages.map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => handleFlagChange(lang.flag, lang.code, lang.name)}
                selected={lang.code === language}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* <Avatar src={lang.flag} sx={{ width: 24, height: 24 }} /> */}
                  <Image src={lang.flag} alt={lang.flag}  width={24}/>
                  <Typography variant="body2">{lang.name}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Menu>

          {/* Role Chip */}
          <Chip
            label={user?.role}
            color={getRoleColor(user?.role)}
            variant="outlined"
            size="small"
            sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
          />

          {/* User Menu */}
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

        {/* Notification Menu */}
        <Menu
          anchorEl={openNotification}
          open={Boolean(openNotification)}
          onClose={handleCloseNotification}
          onClick={handleCloseNotification}
        >
          <MenuItem>
            <ListItemIcon>
              <User size={18} />
            </ListItemIcon>
            <ListItemText primary="No new notifications" />
          </MenuItem>
        </Menu>

        {/* User Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          <MenuItem>
            <ListItemIcon>
              <User size={18} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          <MenuItem>
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