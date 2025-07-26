import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Autocomplete, Button } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@context/AuthContext';
import MainLayout from '@components/common/MainLayout';
import DashboardStats from '@components/common/DashboardStats';
import AttendanceCharts from '@components/common/AttendanceCharts';
import { useAttendanceStats } from '@hooks/useAttendanceStats';
import { studentsService, teachersService, classesService, attendanceService } from '@services/storageService';
import { colors } from '@theme';
import { STORAGE_KEYS } from '@constants';
import StudentsPage from '@pages/StudentsPage/StudentsPage';
import TeachersPage from '@pages/TeachersPage/TeachersPage';
import ClassesPage from '@pages/ClassesPage/ClassesPage';
import AttendancePage from '@pages/AttendancePage/AttendancePage';
import SettingsPage from '@pages/SettingsPage/SettingsPage';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const stats = useAttendanceStats(selectedDate, user?.role, user?.id);

  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate]);

  const loadAttendanceData = () => {
    const students = studentsService.getAll();
    const teachers = teachersService.getAll();
    const classes = classesService.getAll();
    const attendanceRecords = attendanceService.getAll();
    
    const data = [];
    
    classes.forEach(classItem => {
      const teacher = teachers.find(t => t.id === classItem.teacherId);
      const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'No Teacher';
      
      classItem.students?.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (student) {
          let present = 0;
          let absent = 0;
          
          attendanceRecords.forEach(record => {
            if (record.classId === classItem.id && record.attendance[studentId]) {
              if (record.attendance[studentId] === 'present') present++;
              else if (record.attendance[studentId] === 'absent') absent++;
            }
          });
          
          // Get today's attendance status
          const todayRecord = attendanceRecords.find(r => 
            r.classId === classItem.id && r.date === selectedDate
          );
          const todayStatus = todayRecord?.attendance[studentId] || 'not_marked';
          
          data.push({
            className: `${classItem.name} - ${classItem.standard}`,
            teacherName,
            studentName: `${student.firstName} ${student.lastName}`,
            present,
            absent,
            todayStatus
          });
        }
      });
    });
    
    setAttendanceData(data);
  };

  const getSearchOptions = () => {
    switch(searchColumn) {
      case 'class': return attendanceData.map(row => row.className);
      case 'teacher': return attendanceData.map(row => row.teacherName);
      case 'student': return attendanceData.map(row => row.studentName);
      default: return attendanceData.map(row => [row.className, row.teacherName, row.studentName]).flat();
    }
  };

  const filteredAttendanceData = attendanceData.filter(row => {
    const matchesSearch = !searchTerm || (() => {
      const term = searchTerm.toLowerCase();
      switch(searchColumn) {
        case 'class': return row.className.toLowerCase().includes(term);
        case 'teacher': return row.teacherName.toLowerCase().includes(term);
        case 'student': return row.studentName.toLowerCase().includes(term);
        default: return row.className.toLowerCase().includes(term) || 
                       row.teacherName.toLowerCase().includes(term) || 
                       row.studentName.toLowerCase().includes(term);
      }
    })();
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'present' && row.todayStatus === 'present') ||
      (filterStatus === 'absent' && row.todayStatus === 'absent');
    
    return matchesSearch && matchesFilter;
  });



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
                Welcome back, {user?.firstName}!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Here's your attendance overview for today
              </Typography>
              <TextField
                type="date"
                label="Select Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.8)'
                  }
                }}
              />
            </Box>
            
            <DashboardStats stats={stats} userRole={user?.role} />
            <AttendanceCharts stats={stats} userRole={user?.role} />
            
            {/* Attendance Table */}
            <Box sx={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '20px',
              p: 3,
              mt: 4
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Attendance Records
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Search Column"
                    value={searchColumn}
                    onChange={(e) => { setSearchColumn(e.target.value); setSearchTerm(''); }}
                    SelectProps={{ native: true }}
                  >
                    <option value="all">All Columns</option>
                    <option value="class">Class</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Autocomplete
                      freeSolo
                      options={[...new Set(getSearchOptions())]}
                      value={searchTerm}
                      onInputChange={(event, newValue) => setSearchTerm(newValue || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={`Search by ${searchColumn === 'all' ? 'any column' : searchColumn}...`}
                          fullWidth
                        />
                      )}
                      sx={{ flex: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant={filterStatus === 'all' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('all')}
                        size="small"
                      >
                        All
                      </Button>
                      <Button 
                        variant={filterStatus === 'present' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('present')}
                        size="small"
                        color="success"
                      >
                        Present
                      </Button>
                      <Button 
                        variant={filterStatus === 'absent' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('absent')}
                        size="small"
                        color="error"
                      >
                        Absent
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <TableContainer sx={{ 
                height: { xs: 300, md: 400 }, 
                borderRadius: '12px',
                '& .MuiTableHead-root': {
                  '& .MuiTableCell-root': {
                    background: 'rgba(0,96,100,0.8)',
                    fontWeight: 600,
                    borderBottom: '2px solid rgba(0,96,100,0.2)'
                  }
                },
                '& .MuiTableBody-root': {
                  '& .MuiTableRow-root': {
                    '&:nth-of-type(even)': {
                      background: 'rgba(255,255,255,0.3)'
                    },
                    '&:hover': {
                      background: 'rgba(0,172,193,0.1)'
                    }
                  }
                }
              }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Teacher</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Present</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Absent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAttendanceData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: 500 }}>{row.className}</TableCell>
                        <TableCell>{row.teacherName}</TableCell>
                        <TableCell>{row.studentName}</TableCell>
                        <TableCell align="center" sx={{ color: '#00ACC1', fontWeight: 600 }}>{row.present}</TableCell>
                        <TableCell align="center" sx={{ color: '#f44336', fontWeight: 600 }}>{row.absent}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
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