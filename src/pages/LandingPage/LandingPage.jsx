import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  School, 
  Analytics, 
  CalendarToday, 
  People
} from '@mui/icons-material';
import { colors } from '@theme/theme';
import LoginModal from '@components/common/LoginModal';

const LandingPage = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  const features = [
    {
      icon: <People sx={{ fontSize: 40, color: colors.accent }} />,
      title: 'Student Management',
      description: 'Add, edit, and manage student records with ease'
    },
    {
      icon: <School sx={{ fontSize: 40, color: colors.accent }} />,
      title: 'Class Management',
      description: 'Create classes, assign teachers, and organize sections'
    },
    {
      icon: <CalendarToday sx={{ fontSize: 40, color: colors.accent }} />,
      title: 'Attendance Tracking',
      description: 'Mark attendance with calendar integration and multiple status options'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: colors.accent }} />,
      title: 'Analytics & Reports',
      description: 'Visual charts and comprehensive reporting for insights'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Attendo
          </Typography>
          {/* <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton> */}
          <Button 
            color="inherit" 
            onClick={() => setLoginOpen(true)}
            sx={{ ml: 2 }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 3,
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Modern Attendance Tracking
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Streamline your educational institution attendance management with our professional, user-friendly platform
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => setLoginOpen(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px rgba(0,172,193,0.15)`
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box 
          textAlign="center" 
          sx={{ 
            py: 6,
            px: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${colors.accent}15, ${colors.primary}10)`,
            border: `1px solid ${colors.secondary}40`
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Join thousands of educational institutions already using Attendo
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => setLoginOpen(true)}
            sx={{ px: 6, py: 1.5 }}
          >
            Start Free Trial
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          px: 2, 
          backgroundColor: colors.primary,
          color: colors.text,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2">
          © 2025 Attendo. All rights reserved.
        </Typography>
      </Box>
      
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
      />
    </Box>
  );
};

export default LandingPage;