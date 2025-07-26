import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { colors } from '@theme/theme';

const DashboardStats = ({ stats, userRole }) => {
  const getStatsConfig = () => {
    if (userRole === 'teacher') {
      return [
        { label: 'Total Students', value: stats.totalStudents, color: colors.primary },
        { label: 'Present Today', value: `${stats.presentToday}/${stats.totalToday}`, color: colors.accent },
        { label: 'Attendance Rate', value: `${stats.overallAttendanceRate}%`, color: colors.accent }
      ];
    }
    
    return [
      { label: 'Total Students', value: stats.totalStudents, color: colors.primary },
      { label: 'Total Classes', value: stats.totalClasses, color: colors.primary },
      { label: 'Present Today', value: `${stats.presentToday}/${stats.totalToday}`, color: colors.accent },
      { label: 'Attendance Rate', value: `${stats.overallAttendanceRate}%`, color: colors.accent }
    ];
  };

  const statsConfig = getStatsConfig();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsConfig.map((stat, index) => (
        <Grid item xs={12} sm={6} md={12 / statsConfig.length} key={index}>
          <Card sx={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: `linear-gradient(180deg, ${stat.color}40, ${stat.color}20)`,
              borderRadius: '20px 0 0 20px'
            },
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 30px ${stat.color}20`
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                {stat.label}
              </Typography>
              <Typography variant="h3" sx={{ 
                color: stat.color, 
                fontWeight: 700,
                mb: 0.5
              }}>
                {stat.value}
              </Typography>
              <Box sx={{
                width: '40px',
                height: '3px',
                background: `linear-gradient(90deg, ${stat.color}60, ${stat.color}20)`,
                borderRadius: '2px',
                mx: 'auto'
              }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;