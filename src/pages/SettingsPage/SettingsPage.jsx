import React, { useState } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { initializeDummyData, clearAllData } from '@services/dataService';
import ConfirmDialog from '@components/common/ConfirmDialog';
import AlertDialog from '@components/common/AlertDialog';

const SettingsPage = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInitializeData = () => {
    initializeDummyData();
    setAlertMessage('Dummy data initialized successfully!');
    setAlertOpen(true);
  };

  const handleClearData = () => {
    setConfirmOpen(true);
  };

  const confirmClearData = () => {
    clearAllData();
    setConfirmOpen(false);
    setAlertMessage('All data cleared successfully!');
    setAlertOpen(true);
  };

  const generateRandomData = async () => {
    setLoading(true);
    try {
      // Generate random names
      const namesResponse = await fetch('https://randomuser.me/api/?results=60&nat=us');
      const namesData = await namesResponse.json();
      const users = namesData.results;
      
      // Generate teachers (first 10 users)
      const teachers = users.slice(0, 10).map((user, index) => ({
        id: `t${index + 1}`,
        firstName: user.name.first,
        lastName: user.name.last,
        email: `${user.name.first.toLowerCase()}.${user.name.last.toLowerCase()}@school.com`,
        password: 'password',
        subject: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Art', 'Music'][index]
      }));
      
      // Generate students (next 50 users)
      const students = users.slice(10, 60).map((user, index) => ({
        id: `s${index + 1}`,
        firstName: user.name.first,
        lastName: user.name.last,
        email: `${user.name.first.toLowerCase()}.${user.name.last.toLowerCase()}@student.com`,
        password: 'password',
        rollNumber: `S${String(index + 1).padStart(3, '0')}`
      }));
      
      // Generate classes
      const classes = Array.from({ length: 10 }, (_, index) => {
        const standards = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
        const classNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        
        return {
          id: `c${index + 1}`,
          name: `Class ${classNames[index]}`,
          standard: `${standards[index]} Standard`,
          teacherId: teachers[index].id,
          students: students.slice(index * 5, (index + 1) * 5).map(s => s.id)
        };
      });
      
      // Save to localStorage
      localStorage.setItem('attendo_teachers', JSON.stringify(teachers));
      localStorage.setItem('attendo_students', JSON.stringify(students));
      localStorage.setItem('attendo_classes', JSON.stringify(classes));
      
      // Generate attendance for past 60 days
      const attendanceRecords = [];
      const today = new Date();
      
      for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() - dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        classes.forEach(classItem => {
          const attendance = {};
          classItem.students.forEach(studentId => {
            // 85% chance of being present
            attendance[studentId] = Math.random() > 0.15 ? 'present' : 'absent';
          });
          
          attendanceRecords.push({
            id: `${classItem.id}_${dateStr}`,
            classId: classItem.id,
            date: dateStr,
            attendance,
            markedAt: new Date().toISOString()
          });
        });
      }
      
      localStorage.setItem('attendo_attendance', JSON.stringify(attendanceRecords));
      
      setAlertMessage('Random data generated successfully! 10 teachers, 50 students, 10 classes with 60 days of attendance.');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage('Failed to generate random data. Please try again.');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Management
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Initialize the system with sample data or clear all existing data.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  onClick={handleInitializeData}
                >
                  Initialize Dummy Data
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={generateRandomData}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Random Data'}
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleClearData}
                >
                  Clear All Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <ConfirmDialog
        open={confirmOpen}
        title="Clear All Data"
        message="Are you sure you want to clear all data? This action cannot be undone."
        onConfirm={confirmClearData}
        onCancel={() => setConfirmOpen(false)}
      />
      
      <AlertDialog
        open={alertOpen}
        title="Success"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </Box>
  );
};

export default SettingsPage;