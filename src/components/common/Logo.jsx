import { Box, Typography } from '@mui/material';

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
      <circle cx="12" cy="12" r="11" fill="#4dd0e1" stroke="white" strokeWidth="2"/>
      <circle cx="12" cy="6" r="3" fill="white"/>
      <path d="M12 10c-2 0-4 1-4 3v6h8v-6c0-2-2-3-4-3z" fill="white"/>
      <path d="M16 12l3-6 2 1-3 6z" fill="white"/>
    </svg>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
      Attendo
    </Typography>
  </Box>
);

export default Logo;