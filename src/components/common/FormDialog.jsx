import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const FormDialog = ({ 
  open, 
  onClose, 
  title, 
  onSubmit, 
  submitText = 'Save',
  children 
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
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