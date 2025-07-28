import { Box } from '@mui/material';

const SimpleCard = ({ children, sx = {} }) => (
  <Box sx={{
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '20px',
    p: 3,
    ...sx
  }}>
    {children}
  </Box>
);

export default SimpleCard;