import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { getClasses, getStudents } from '@services/dataService';
import { markAttendance, getAttendanceByClassAndDate } from '@services/attendanceService';
import { useAuth } from '@context/AuthContext';
import AlertDialog from '@components/common/AlertDialog';

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [classStudents, setClassStudents] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const allClasses = getClasses();
    const allStudents = getStudents();
    
    // Filter classes based on user role
    if (user?.role === 'teacher') {
      const teacherClasses = allClasses.filter(c => c.teacherId === user.id);
      setClasses(teacherClasses);
      // Auto-select teacher's class
      if (teacherClasses.length > 0) {
        setSelectedClass(teacherClasses[0].id);
      }
    } else {
      setClasses(allClasses);
    }
    
    setStudents(allStudents);
  }, [user]);

  useEffect(() => {
    if (selectedClass) {
      const classData = classes.find(c => c.id === selectedClass);
      if (classData && classData.students) {
        const studentsInClass = students.filter(s => classData.students.includes(s.id));
        setClassStudents(studentsInClass);
        
        // Load existing attendance
        const attendanceRecords = JSON.parse(localStorage.getItem('attendo_attendance') || '[]');
        const existingAttendance = attendanceRecords.find(r => r.classId === selectedClass && r.date === selectedDate);
        if (existingAttendance) {
          setAttendance(existingAttendance.attendance);
        } else {
          // Initialize with all present
          const initialAttendance = {};
          studentsInClass.forEach(student => {
            initialAttendance[student.id] = 'present';
          });
          setAttendance(initialAttendance);
        }
      }
    }
  }, [selectedClass, selectedDate, classes, students]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || !selectedDate) {
      return;
    }

    markAttendance(selectedClass, selectedDate, attendance);
    setAlertOpen(true);
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mark Attendance
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {user?.role !== 'teacher' && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Select Class"
              >
                {classes.map(classItem => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name} - {classItem.standard}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} md={user?.role === 'teacher' ? 12 : 6}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {selectedClass && classStudents.length > 0 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6">
                  Students ({classStudents.length})
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Mark All Present:</Typography>
                  <Switch
                    checked={Object.values(attendance).every(status => status === 'present')}
                    onChange={(e) => {
                      const newStatus = e.target.checked ? 'present' : 'absent';
                      const newAttendance = {};
                      classStudents.forEach(student => {
                        newAttendance[student.id] = newStatus;
                      });
                      setAttendance(newAttendance);
                    }}
                    color="success"
                  />
                </Box>
              </Box>
              <Button variant="contained" onClick={handleSaveAttendance}>
                Save Attendance
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Roll No.</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.firstName} {student.lastName}</TableCell>
                      <TableCell align="center">
                        {attendance[student.id] === 'present' ? (
                          <CheckCircle sx={{ color: '#4caf50' }} />
                        ) : (
                          <Cancel sx={{ color: '#f44336' }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={attendance[student.id] === 'present'}
                          onChange={() => toggleAttendance(student.id)}
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {selectedClass && classStudents.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No students assigned to this class.
            </Typography>
          </CardContent>
        </Card>
      )}
      
      <AlertDialog
        open={alertOpen}
        title="Success"
        message="Attendance saved successfully!"
        onClose={() => setAlertOpen(false)}
      />
    </Box>
  );
};

export default AttendancePage;