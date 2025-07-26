import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const PageHeader = ({ title, onAdd, addButtonText = 'Add' }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
    <Typography variant="h4">{title}</Typography>
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={onAdd}
      sx={{
        background: 'linear-gradient(135deg, #4dd0e1 0%, #00acc1 100%)',
        borderRadius: '12px',
        px: 3,
        py: 1.5,
        fontWeight: 600
      }}
    >
      {addButtonText}
    </Button>
  </Box>
);

export default PageHeader;