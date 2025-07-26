import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useAuth } from '@context/AuthContext';
import AdminLayout from '@components/admin/AdminLayout';
import { getClasses } from '@services/dataService';
import { getAttendanceRecords } from '@services/attendanceService';
import { colors } from '@theme/theme';

const StudentPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [studentClass, setStudentClass] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    if (currentPage === 'dashboard') {
      loadStudentData();
    }
  }, [currentPage, user]);

  const loadStudentData = () => {
    const classes = getClasses();
    const allAttendanceRecords = JSON.parse(localStorage.getItem('attendo_attendance') || '[]');
    
    // Find student's class
    const assignedClass = classes.find(c => c.students?.includes(user?.id));
    setStudentClass(assignedClass);
    
    if (assignedClass) {
      // Get attendance records for student's class
      const classRecords = allAttendanceRecords.filter(r => r.classId === assignedClass.id);
      
      // Extract student's attendance
      const studentAttendance = {};
      let presentDays = 0;
      let totalDays = 0;
      
      classRecords.forEach(record => {
        if (record.attendance[user?.id]) {
          const status = record.attendance[user.id];
          studentAttendance[record.date] = status;
          
          totalDays++;
          if (status === 'present') {
            presentDays++;
          }
        }
      });
      
      const absentDays = totalDays - presentDays;
      const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      
      setAttendanceRecords(studentAttendance);
      setStats({
        totalDays,
        presentDays,
        absentDays,
        attendanceRate
      });
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === currentMonth;
      const attendanceStatus = attendanceRecords[dateStr];
      
      days.push({
        date: new Date(current),
        dateStr,
        day: current.getDate(),
        isCurrentMonth,
        attendanceStatus
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ mx: 2, minWidth: 200, textAlign: 'center' }}>
            {monthNames[currentMonth]} {currentYear}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
        
        {/* Day headers */}
        <Grid container sx={{ mb: 1 }}>
          {dayNames.map(day => (
            <Grid item xs={12/7} key={day}>
              <Box sx={{ 
                textAlign: 'center', 
                py: 1, 
                fontWeight: 'bold',
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}>
                {day}
              </Box>
            </Grid>
          ))}
        </Grid>
        
        {/* Calendar days */}
        <Grid container>
          {days.map((day, index) => {
            let bgColor = 'transparent';
            let textColor = day.isCurrentMonth ? 'text.primary' : 'text.disabled';
            
            if (day.attendanceStatus === 'present') {
              bgColor = colors.accent;
              textColor = 'white';
            } else if (day.attendanceStatus === 'absent') {
              bgColor = colors.highlight;
              textColor = 'white';
            }
            
            return (
              <Grid item xs={12/7} key={index}>
                <Box sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: bgColor,
                  color: textColor,
                  borderRadius: 1,
                  m: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: day.attendanceStatus ? 'bold' : 'normal',
                  border: day.date.toDateString() === today.toDateString() ? `2px solid ${colors.primary}` : 'none'
                }}>
                  {day.day}
                </Box>
              </Grid>
            );
          })}
        </Grid>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: colors.accent, 
              borderRadius: 1 
            }} />
            <Typography variant="body2">Present</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: colors.highlight, 
              borderRadius: 1 
            }} />
            <Typography variant="body2">Absent</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              border: `2px solid ${colors.primary}`, 
              borderRadius: 1 
            }} />
            <Typography variant="body2">Today</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderPageContent = () => {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          My Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome, {user?.firstName} {user?.lastName}
        </Typography>
        
        {studentClass ? (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {studentClass.name} - {studentClass.standard}
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Total Days
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.primary }}>
                      {stats.totalDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Present
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.accent }}>
                      {stats.presentDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Absent
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.highlight }}>
                      {stats.absentDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Attendance Rate
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.accent }}>
                      {stats.attendanceRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance Calendar
                </Typography>
                {renderCalendar()}
              </CardContent>
            </Card>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            You are not assigned to any class. Please contact admin.
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPageContent()}
    </AdminLayout>
  );
};

export default StudentPage;