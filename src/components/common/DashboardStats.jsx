import React from 'react';
import { Grid } from '@mui/material';
import { colors } from '@theme';
import StatsCard from './StatsCard';

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
          <StatsCard
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;