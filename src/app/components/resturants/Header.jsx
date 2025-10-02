"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Button,
  Badge,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  RadioGroup,
  Radio,
  CssBaseline,
  useMediaQuery,
  useTheme,
  ListItemButton,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LanguageIcon from "@mui/icons-material/Language";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "40ch",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

function Header({ onMenuToggle, isMobile }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleLanguageClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  return (
    <AppBar position="fixed" color="inherit" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Left: Logo and Menu Button (only show on mobile) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && (
            <IconButton 
              size="large" 
              edge="start" 
              color="inherit"
              onClick={onMenuToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            GO ECOMMERCE
          </Typography>
        </Box>
     
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{ minWidth: 300 }}
        >
          <Tab label="ដឹកជញ្ជូន" />
          <Tab label="ទៅយកផ្ទាល់" />
          <Tab label="ហាងទំនិញ" />
        </Tabs>

        {/* Right: Search + Language + Cart + Login */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="ស្វែងរកភោជនីយដ្ឋាន ឬម្ហូប..." />
          </Search>

          <IconButton color="inherit" onClick={handleLanguageClick}>
            <LanguageIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>English</MenuItem>
            <MenuItem onClick={handleClose}>ភាសាខ្មែរ</MenuItem>
          </Menu>

          <IconButton color="inherit">
            <Badge badgeContent={1} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <Button variant="contained" color="secondary">
            ចូលគណនី
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function Sidebar({ open, onClose, isMobile, sidebarOpen }) {
  const [deliveryTime, setDeliveryTime] = useState("25");

  // For mobile: temporary drawer that can be closed
  // For desktop: permanent drawer that's always visible
  const drawerVariant = isMobile ? "temporary" : "permanent";

  return (
    <Drawer
      variant={drawerVariant}
      anchor="left"
      open={isMobile ? open : true} // Always open on desktop
      onClose={onClose}
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          padding: 2,
          marginTop: isMobile ? '64px' : '64px', // Account for header height
          height: isMobile ? 'calc(100% - 64px)' : 'calc(100% - 64px)',
          ...(isMobile ? {} : { position: 'relative' }), // Permanent drawer positioning
        },
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          តម្រង
        </Typography>

        {/* Delivery Type */}
        <Typography variant="subtitle1">ប្រភេទបម្រើ</Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="ដឹកជញ្ជូន" />
          <FormControlLabel control={<Checkbox />} label="ទៅយកផ្ទាល់" />
          <FormControlLabel control={<Checkbox />} label="ជាម៉ាយ" />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        {/* Promotions */}
        <Typography variant="subtitle1">ការផ្តល់ជូន</Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="បញ្ចុះតម្លៃ" />
          <FormControlLabel control={<Checkbox />} label="ដឹកជញ្ជូនឥតគិតថ្លៃ" />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        {/* Delivery Time (Radio) */}
        <Typography variant="subtitle1">ពេលវេលាដឹកជញ្ជូន</Typography>
        <RadioGroup
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        >
          <FormControlLabel value="25" control={<Radio />} label="ក្រោម 25 នាទី" />
          <FormControlLabel value="45" control={<Radio />} label="ក្រោម 45 នាទី" />
          <FormControlLabel value="60" control={<Radio />} label="ក្រោម 60 នាទី" />
        </RadioGroup>

        <Divider sx={{ my: 2 }} />

        {/* Cuisine Search */}
        <TextField
          placeholder="ស្វែងរកប្រភេទម្ហូប"
          variant="outlined"
          size="small"
          fullWidth
        />
         <List>
          {["ខ្មែរ", "ចិន"].map((cuisine, index) => (
            <ListItemButton
              key={index}
              onClick={() => console.log(`Selected: ${cuisine}`)}
            >
              <ListItemText primary={cuisine} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md breakpoint and below is mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Calculate the main content width based on screen size and sidebar state
  const sidebarWidth = 260;
  const mainContentWidth = isMobile 
    ? `100%` 
    : `calc(100% - ${sidebarOpen ? sidebarWidth : 0}px)`;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header onMenuToggle={handleMenuToggle} isMobile={isMobile} />
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose} 
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
      />
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px', // Account for fixed header
          width: mainContentWidth,
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`, // Permanent sidebar offset on desktop
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Your main content goes here */}
        <Typography paragraph>
          Main content area
        </Typography>
      </Box>
    </Box>
  );
}