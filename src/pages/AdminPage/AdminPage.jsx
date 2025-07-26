import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, TextField } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@context/AuthContext';
import AdminLayout from '@components/admin/AdminLayout';
import { getClasses, getStudents } from '@services/dataService';
import { getAttendanceRecords } from '@services/attendanceService';
import { colors } from '@theme/theme';
import StudentsPage from '@pages/StudentsPage/StudentsPage';
import TeachersPage from '@pages/TeachersPage/TeachersPage';
import ClassesPage from '@pages/ClassesPage/ClassesPage';
import AttendancePage from '@pages/AttendancePage/AttendancePage';
import SettingsPage from '@pages/SettingsPage/SettingsPage';

const AdminPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    presentToday: 0,
    totalToday: 0,
    overallAttendanceRate: 0,
    todayPieData: [],
    classWiseToday: []
  });

  useEffect(() => {
    if (currentPage === 'dashboard') {
      calculateStats();
    }
  }, [currentPage, selectedDate]);

  const calculateStats = () => {
    const students = getStudents();
    const classes = getClasses();
    const attendanceRecords = JSON.parse(localStorage.getItem('attendo_attendance') || '[]');
    const today = selectedDate;
    
    // Basic counts
    const totalStudents = students.length;
    const totalClasses = classes.length;
    
    // Today's attendance
    const todayRecords = attendanceRecords.filter(r => r.date === today);
    let presentToday = 0;
    let totalToday = 0;
    const classStats = {};
    
    todayRecords.forEach(record => {
      const classData = classes.find(c => c.id === record.classId);
      if (classData) {
        const attendance = Object.values(record.attendance);
        const present = attendance.filter(s => s === 'present').length;
        const absent = attendance.filter(s => s === 'absent').length;
        
        presentToday += present;
        totalToday += present + absent;
        
        classStats[classData.name] = {
          name: classData.name,
          present,
          absent
        };
      }
    });
    
    // Overall attendance rate (all days, all classes)
    let totalPresentAll = 0;
    let totalRecordsAll = 0;
    
    attendanceRecords.forEach(record => {
      const attendance = Object.values(record.attendance);
      totalPresentAll += attendance.filter(s => s === 'present').length;
      totalRecordsAll += attendance.length;
    });
    
    const overallAttendanceRate = totalRecordsAll > 0 ? Math.round((totalPresentAll / totalRecordsAll) * 100) : 0;
    
    // Pie chart data
    const todayPieData = [
      { name: 'Present', value: presentToday, color: colors.accent },
      { name: 'Absent', value: totalToday - presentToday, color: colors.highlight }
    ];
    
    // Class wise data
    const classWiseToday = Object.values(classStats);
    
    setStats({
      totalStudents,
      totalClasses,
      presentToday,
      totalToday,
      overallAttendanceRate,
      todayPieData,
      classWiseToday
    });
  };



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
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Total Students
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.primary }}>
                      {stats.totalStudents}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Total Classes
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.primary }}>
                      {stats.totalClasses}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Present Today
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.accent }}>
                      {stats.presentToday}/{stats.totalToday}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Attendance Rate
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.accent }}>
                      {stats.overallAttendanceRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Today's Attendance
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.todayPieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {stats.todayPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Class-wise Attendance Today
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.classWiseToday}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="present" stackId="a" fill={colors.accent} name="Present" />
                        <Bar dataKey="absent" stackId="a" fill={colors.highlight} name="Absent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPageContent()}
    </AdminLayout>
  );
};

export default AdminPage;