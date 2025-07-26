import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, TextField } from '@mui/material';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@context/AuthContext';
import AdminLayout from '@components/admin/AdminLayout';
import AttendancePage from '@pages/AttendancePage/AttendancePage';
import { getClasses, getStudents } from '@services/dataService';
import { getAttendanceRecords } from '@services/attendanceService';
import { colors } from '@theme/theme';

const TeacherPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [teacherClass, setTeacherClass] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    totalToday: 0,
    overallAttendanceRate: 0,
    todayPieData: []
  });

  useEffect(() => {
    const classes = getClasses();
    const assignedClass = classes.find(c => c.teacherId === user?.id);
    setTeacherClass(assignedClass);
    
    if (currentPage === 'dashboard' && assignedClass) {
      calculateStats(assignedClass);
    }
  }, [currentPage, user, selectedDate]);

  const calculateStats = (classData) => {
    const students = getStudents();
    const attendanceRecords = JSON.parse(localStorage.getItem('attendo_attendance') || '[]');
    const today = selectedDate;
    
    const classStudents = students.filter(s => classData.students?.includes(s.id));
    const totalStudents = classStudents.length;
    
    const todayRecord = attendanceRecords.find(r => r.classId === classData.id && r.date === today);
    let presentToday = 0;
    let totalToday = 0;
    
    if (todayRecord) {
      const attendance = Object.values(todayRecord.attendance);
      presentToday = attendance.filter(s => s === 'present').length;
      totalToday = attendance.length;
    }
    
    const classRecords = attendanceRecords.filter(r => r.classId === classData.id);
    let totalPresentAll = 0;
    let totalRecordsAll = 0;
    
    classRecords.forEach(record => {
      const attendance = Object.values(record.attendance);
      totalPresentAll += attendance.filter(s => s === 'present').length;
      totalRecordsAll += attendance.length;
    });
    
    const overallAttendanceRate = totalRecordsAll > 0 ? Math.round((totalPresentAll / totalRecordsAll) * 100) : 0;
    
    const todayPieData = [
      { name: 'Present', value: presentToday, color: colors.accent },
      { name: 'Absent', value: totalToday - presentToday, color: colors.highlight }
    ];
    
    setStats({
      totalStudents,
      presentToday,
      totalToday,
      overallAttendanceRate,
      todayPieData
    });
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'attendance':
        return <AttendancePage />;
      default:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              My Class Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Welcome, {user?.firstName} {user?.lastName}
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
            
            {teacherClass ? (
              <>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  {teacherClass.name} - {teacherClass.standard}
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12}>
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
                </Grid>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No class assigned to you. Please contact admin.
              </Typography>
            )}
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

export default TeacherPage;