import React, { useState } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { initializeDummyData, clearAllData } from '@services/dataService';
import { generateRandomData } from '@services/apiService';
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

  const handleGenerateRandomData = async () => {
    setLoading(true);
    try {
      const { teachers, students, classes, attendanceRecords } = await generateRandomData();
      
      localStorage.setItem('attendo_teachers', JSON.stringify(teachers));
      localStorage.setItem('attendo_students', JSON.stringify(students));
      localStorage.setItem('attendo_classes', JSON.stringify(classes));
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
                  onClick={handleGenerateRandomData}
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