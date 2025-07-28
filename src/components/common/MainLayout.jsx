import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  School,
  EventNote,
  Settings,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "@context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    const baseRoute = `/${user?.role === 'admin' ? 'admin' : user?.role}`;
    
    if (user?.role === 'admin') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: baseRoute },
        { text: 'Students', icon: <People />, path: `${baseRoute}/students` },
        { text: 'Teachers', icon: <People />, path: `${baseRoute}/teachers` },
        { text: 'Classes', icon: <School />, path: `${baseRoute}/classes` },
        { text: 'Attendance', icon: <EventNote />, path: `${baseRoute}/attendance` },
        { text: 'Settings', icon: <Settings />, path: `${baseRoute}/settings` },
      ];
    } else if (user?.role === 'teacher') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: baseRoute },
        { text: 'Attendance', icon: <EventNote />, path: `${baseRoute}/attendance` },
      ];
    } else {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: baseRoute },
      ];
    }
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background: "linear-gradient(135deg, #006064 0%, #00838f 100%)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box 
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => {
              const baseRoute = user?.role === 'admin' ? '/admin' : `/${user?.role}`;
              navigate(baseRoute);
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "10px" }}
            >
              <circle
                cx="12"
                cy="12"
                r="11"
                fill="#4dd0e1"
                stroke="white"
                strokeWidth="2"
              />
              <circle cx="12" cy="6" r="3" fill="white" />
              <path d="M12 10c-2 0-4 1-4 3v6h8v-6c0-2-2-3-4-3z" fill="white" />
              <path d="M16 12l3-6 2 1-3 6z" fill="white" />
            </svg>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Attendo
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0 }}
          >
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {user?.firstName?.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            mt: 8,
          },
        }}
      >
        <List>
          {getMenuItems().map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleMenuClick(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          background: "linear-gradient(135deg, #ECEFF1 0%, #e0f2f1 100%)",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
