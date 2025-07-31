import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Chip, Box, Alert } from '@mui/material';
import { Send } from '@mui/icons-material';

const EmailReportDialog = ({ open, onClose, onSend }) => {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && email.includes('@') && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmailInput('');
      setError('');
    } else {
      setError('Please enter a valid email address');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleSend = async () => {
    if (emails.length === 0) {
      setError('Please add at least one email address');
      return;
    }
    
    setLoading(true);
    try {
      await onSend(emails);
      setEmails([]);
      setEmailInput('');
      onClose();
    } catch (err) {
      setError('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddEmail();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>📧 Send Attendance Report</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField
          fullWidth
          label="Email Address"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter email and press Enter"
          InputLabelProps={{ shrink: true }}
          sx={{ 
            mb: 2,
            mt: 2,
            '& .MuiInputBase-input::placeholder': {
              color: '#666',
              opacity: 1
            }
          }}
        />
        
        <Button onClick={handleAddEmail} variant="outlined" sx={{ mb: 2 }}>
          Add Email
        </Button>

        <Box sx={{ mb: 2 }}>
          {emails.map((email) => (
            <Chip
              key={email}
              label={email}
              onDelete={() => handleRemoveEmail(email)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          startIcon={<Send />}
          disabled={loading || emails.length === 0}
        >
          {loading ? 'Sending...' : 'Send Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailReportDialog;