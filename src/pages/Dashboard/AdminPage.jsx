import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, TextField } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@context/AuthContext';
import MainLayout from '@components/common/MainLayout';
import DashboardStats from '@components/common/DashboardStats';
import AttendanceCharts from '@components/common/AttendanceCharts';
import { useAttendanceStats } from '@hooks/useAttendanceStats';
import { getClasses, getStudents } from '@services/dataService';
import { getAttendanceRecords } from '@services/attendanceService';
import { colors } from '@theme/theme';
import StudentsPage from '@pages/StudentsPage/StudentsPage';
import TeachersPage from '@pages/TeachersPage/TeachersPage';
import ClassesPage from '@pages/ClassesPage/ClassesPage';
import AttendancePage from '@pages/AttendancePage/AttendancePage';
import SettingsPage from '@pages/SettingsPage/SettingsPage';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const stats = useAttendanceStats(selectedDate, user?.role, user?.id);



  const renderPageContent = () => {
    switch (currentPage) {
      case 'students':
        return <StudentsPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'classes':
        return <ClassesPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Welcome back, {user?.firstName} {user?.lastName}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                type="date"
                label="Select Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            
            <DashboardStats stats={stats} userRole={user?.role} />
            <AttendanceCharts stats={stats} userRole={user?.role} />
          </Box>
        );
    }
  };

  return (
    <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPageContent()}
    </MainLayout>
  );
};

export default AdminDashboard;