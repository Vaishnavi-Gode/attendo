import React, { useState } from 'react';
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
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  School,
  EventNote,
  Logout
} from '@mui/icons-material';
import { useAuth } from '@context/AuthContext';

const MainLayout = ({ children, currentPage, onPageChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();

  const allMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: 'dashboard', roles: ['admin', 'teacher', 'student'] },
    { text: 'Students', icon: <People />, path: 'students', roles: ['admin'] },
    { text: 'Teachers', icon: <People />, path: 'teachers', roles: ['admin'] },
    { text: 'Classes', icon: <School />, path: 'classes', roles: ['admin'] },
    { text: 'Attendance', icon: <EventNote />, path: 'attendance', roles: ['admin', 'teacher'] },
    { text: 'Settings', icon: <Dashboard />, path: 'settings', roles: ['admin'] }
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    if (onPageChange) {
      onPageChange(path);
    }
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ 
        zIndex: 1201,
        background: 'linear-gradient(135deg, #006064 0%, #00838f 100%)'
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
              <circle cx="16" cy="16" r="14" fill="#4dd0e1" stroke="white" strokeWidth="2"/>
              <path d="M12 16l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="8" r="2" fill="white" opacity="0.8"/>
              <circle cx="24" cy="8" r="1.5" fill="white" opacity="0.6"/>
              <circle cx="8" cy="24" r="1" fill="white" opacity="0.4"/>
            </svg>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              Attendo
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0 }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
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
          '& .MuiDrawer-paper': {
            width: 240,
            mt: 8
          }
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => handleMenuClick(item.path)}
              selected={currentPage === item.path}
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
          background: 'linear-gradient(135deg, #ECEFF1 0%, #e0f2f1 100%)',
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;