import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from "@mui/material";
import { School, Analytics, CalendarToday, People } from "@mui/icons-material";
import { colors } from "@theme";
import LoginModal from "@components/common/LoginModal";
import Logo from "@components/common/Logo";

const LandingPage = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  const features = [
    {
      icon: <People sx={{ fontSize: 40, color: colors.accent }} />,
      title: "Student Management",
      description: "Add, edit, and manage student records with ease",
    },
    {
      icon: <School sx={{ fontSize: 40, color: colors.accent }} />,
      title: "Class Management",
      description: "Create classes, assign teachers, and organize sections",
    },
    {
      icon: <CalendarToday sx={{ fontSize: 40, color: colors.accent }} />,
      title: "Attendance Tracking",
      description:
        "Mark attendance with calendar integration and multiple status options",
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: colors.accent }} />,
      title: "Analytics & Reports",
      description: "Visual charts and comprehensive reporting for insights",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.background} 0%, #e0f2f1 100%)`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #006064 0%, #00838f 100%)",
          color: "white",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Logo />
          </Box>
          <Button
            onClick={() => setLoginOpen(true)}
            sx={{
              ml: 2,
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              px: 3,
              py: 1,
              fontWeight: 500,
              "&:hover": {
                background: "rgba(255,255,255,0.25)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 2, md: 4 },
          pb: { xs: 8, md: 4 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 1.5,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.75rem" },
              background: "linear-gradient(45deg, #1A1A1A, #00ACC1)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              // gradient text or text masking
            }}
          >
            Modern Attendance Tracking
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ mb: 5, maxWidth: 600, mx: "auto" }}
          >
            Streamline your educational institution attendance management with
            our professional, user-friendly platform
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setLoginOpen(true)}
              sx={{
                px: 5,
                py: 1.8,
                background: "linear-gradient(135deg, #4dd0e1 0%, #00acc1 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: "1.1rem",
                borderRadius: "50px",
                border: "none",
                boxShadow: "0 8px 25px rgba(77,208,225,0.4)",
                position: "relative",
                overflow: "hidden",
                //  shimmer effect
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  transition: "left 0.6s ease",
                },
                // shimmer animation
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #00acc1 0%, #006064 100%)",
                  transform: "translateY(-3px) scale(1.05)",
                  boxShadow: "0 15px 35px rgba(77,208,225,0.6)",
                  "&::before": {
                    left: "100%",
                  },
                },
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: { xs: "120px", md: "140px" },
                  textAlign: "center",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "rgba(255,255,255,0.4)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    transition: "left 0.6s ease",
                  },
                  "&:hover": {
                    transform: {
                      xs: "translateY(-8px)",
                      md: "translateY(-12px) rotateY(5deg)",
                    },
                    boxShadow:
                      "0 25px 50px rgba(0,96,100,0.3), 0 0 0 1px rgba(77,208,225,0.5)",
                    "&::before": {
                      left: "100%",
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontSize: "1rem", mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.8rem", lineHeight: 1.3 }}
                  >
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
            background: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 8px 32px rgba(0,96,100,0.1)",
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
            sx={{
              px: 5,
              py: 1.5,
              background: "linear-gradient(135deg, #4dd0e1 0%, #00acc1 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: "50px",
              border: "none",
              boxShadow: "0 6px 20px rgba(77,208,225,0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #00acc1 0%, #006064 100%)",
                transform: "translateY(-2px) scale(1.03)",
                boxShadow: "0 12px 30px rgba(77,208,225,0.6)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Start Free Trial
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: "auto",
          py: 1.5,
          px: 2,
          background: "linear-gradient(135deg, #006064 0%, #00838f 100%)",
          color: "white",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          © 2025 Attendo. All rights reserved.
        </Typography>
      </Box>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </Box>
  );
};

export default LandingPage;
