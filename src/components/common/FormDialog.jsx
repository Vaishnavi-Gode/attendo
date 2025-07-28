import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';

const FormDialog = ({ 
  open, 
  onClose, 
  title, 
  onSubmit, 
  submitText = 'Save',
  children,
  error 
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {children}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onSubmit} variant="contained">
        {submitText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default FormDialog;