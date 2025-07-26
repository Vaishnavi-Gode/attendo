import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useAuth } from '@context/AuthContext';
import MainLayout from '@components/common/MainLayout';
import { classesService } from '@services/storageService';
import { colors } from '@theme';
import { STORAGE_KEYS, ATTENDANCE_STATUS } from '@constants';

const StudentDashboard = () => {
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
    const classes = classesService.getAll();
    const allAttendanceRecords = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
    
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
          if (status === ATTENDANCE_STATUS.PRESENT) {
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
    const today = new Date();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    
    // Don't allow navigation to future months
    if (nextYear > today.getFullYear() || (nextYear === today.getFullYear() && nextMonth > today.getMonth())) {
      return;
    }
    
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
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const isCurrentMonth = current.getMonth() === currentMonth;
      const attendanceStatus = isCurrentMonth ? attendanceRecords[dateStr] : null;
      
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
            
            if (day.attendanceStatus === ATTENDANCE_STATUS.PRESENT) {
              bgColor = colors.accent;
              textColor = 'white';
            } else if (day.attendanceStatus === ATTENDANCE_STATUS.ABSENT) {
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
        {/* Welcome Header */}
        <Box sx={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          p: 4,
          mb: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 1,
            background: 'linear-gradient(45deg, #1A1A1A, #00ACC1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome, {user?.firstName}!
          </Typography>
          {studentClass ? (
            <Typography variant="h6" color="text.secondary">
              {studentClass.name} - {studentClass.standard}
            </Typography>
          ) : (
            <Typography variant="h6" color="text.secondary">
              Not assigned to any class
            </Typography>
          )}
        </Box>
        
        {studentClass ? (
          <>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={3}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '20px'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Total Days
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.primary, fontWeight: 700 }}>
                      {stats.totalDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '20px'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Present
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.accent, fontWeight: 700 }}>
                      {stats.presentDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '20px'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Absent
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.highlight, fontWeight: 700 }}>
                      {stats.absentDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '20px'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Attendance Rate
                    </Typography>
                    <Typography variant="h3" sx={{ color: colors.accent, fontWeight: 700 }}>
                      {stats.attendanceRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card sx={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '20px'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Attendance Calendar
                </Typography>
                {renderCalendar()}
              </CardContent>
            </Card>
          </>
        ) : (
          <Box sx={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            p: 4,
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="text.secondary">
              Please contact the administrator to get assigned to a class.
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPageContent()}
    </MainLayout>
  );
};

export default StudentDashboard;