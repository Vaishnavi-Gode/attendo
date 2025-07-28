import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Autocomplete, Button } from '@mui/material';
import { useAuth } from '@context/AuthContext';
import DashboardStats from '@components/common/DashboardStats';
import AttendanceCharts from '@components/common/AttendanceCharts';
import { useAttendanceStats } from '@hooks/useAttendanceStats';
import { classesService, studentsService, teachersService, attendanceService } from '@services/baseService';
import { ATTENDANCE_STATUS } from '@constants';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [teacherClass, setTeacherClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const stats = useAttendanceStats(selectedDate, user?.role, user?.id);

  useEffect(() => {
    if (teacherClass) {
      loadAttendanceData();
    }
  }, [teacherClass, selectedDate]);

  const loadAttendanceData = async () => {
    if (!teacherClass) return;
    
    const students = await studentsService.getAll();
    const teachers = await teachersService.getAll();
    const attendanceRecords = await attendanceService.getAll();
    
    const teacher = teachers.find(t => t.id === teacherClass.teacherId);
    const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'No Teacher';
    
    const data = [];
    
    teacherClass.students?.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (student) {
        let present = 0;
        let absent = 0;
        
        attendanceRecords.forEach(record => {
          if (record.classId === teacherClass.id && record.attendance[studentId]) {
            if (record.attendance[studentId] === ATTENDANCE_STATUS.PRESENT) present++;
            else if (record.attendance[studentId] === ATTENDANCE_STATUS.ABSENT) absent++;
          }
        });
        
        // Get today's attendance status
        const todayRecord = attendanceRecords.find(r => 
          r.classId === teacherClass.id && r.date === selectedDate
        );
        const todayStatus = todayRecord?.attendance[studentId] || 'not_marked';
        
        data.push({
          className: `${teacherClass.name} - ${teacherClass.standard}`,
          teacherName,
          studentName: `${student.firstName} ${student.lastName}`,
          present,
          absent,
          todayStatus
        });
      }
    });
    
    setAttendanceData(data);
  };

  const filteredAttendanceData = attendanceData.filter(row => {
    const matchesSearch = row.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'present' && row.todayStatus === ATTENDANCE_STATUS.PRESENT) ||
      (filterStatus === 'absent' && row.todayStatus === ATTENDANCE_STATUS.ABSENT);
    return matchesSearch && matchesFilter;
  });

  const loadTeacherClass = async () => {
    const classes = await classesService.getAll();
    const assignedClass = classes.find(c => c.teacherId === user?.id);
    setTeacherClass(assignedClass);
  };

  useEffect(() => {
    loadTeacherClass();
  }, [user]);

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
              {teacherClass ? (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  Managing {teacherClass.name} - {teacherClass.standard}
                </Typography>
              ) : (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  No class assigned. Please contact admin.
                </Typography>
              )}
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
            
            {teacherClass ? (
              <>
                <DashboardStats stats={stats} userRole={user?.role} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <AttendanceCharts stats={stats} userRole={user?.role} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      background: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: '20px',
                      p: 3,
                      height: 384
                    }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        My Class Attendance
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                        <Autocomplete
                        freeSolo
                        size="small"
                        options={[...new Set(attendanceData.map(row => row.studentName))]}
                        value={searchTerm}
                        onInputChange={(event, newValue) => setSearchTerm(newValue || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search by student name..."
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
                      <TableContainer sx={{ 
                        height: 300, 
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
                              <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 600 }}>Today</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 600 }}>Present</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 600 }}>Absent</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredAttendanceData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.studentName}</TableCell>
                                <TableCell align="center">
                                  <Box sx={{ 
                                    color: row.todayStatus === ATTENDANCE_STATUS.PRESENT ? '#00ACC1' : 
                                           row.todayStatus === ATTENDANCE_STATUS.ABSENT ? '#f44336' : '#666',
                                    fontWeight: 600
                                  }}>
                                    {row.todayStatus === ATTENDANCE_STATUS.PRESENT ? 'P' : 
                                     row.todayStatus === ATTENDANCE_STATUS.ABSENT ? 'A' : '-'}
                                  </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ color: '#00ACC1', fontWeight: 600 }}>{row.present}</TableCell>
                                <TableCell align="center" sx={{ color: '#f44336', fontWeight: 600 }}>{row.absent}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Grid>
                </Grid>
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
                  Please contact the administrator to get a class assigned.
                </Typography>
              </Box>
            )}
    </Box>
  );
};

export default TeacherDashboard;