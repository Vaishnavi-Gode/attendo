import { Card, CardContent, Typography, Box } from '@mui/material';

const StatsCard = ({ label, value, color, icon }) => (
  <Card sx={{
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      background: `linear-gradient(180deg, ${color}40, ${color}20)`,
      borderRadius: '20px 0 0 20px'
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 30px ${color}20`
    }
  }}>
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      {icon && (
        <Box sx={{ mb: 1, color }}>
          {icon}
        </Box>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="h3" sx={{ 
        color, 
        fontWeight: 700,
        mb: 0.5
      }}>
        {value}
      </Typography>
      <Box sx={{
        width: '40px',
        height: '3px',
        background: `linear-gradient(90deg, ${color}60, ${color}20)`,
        borderRadius: '2px',
        mx: 'auto'
      }} />
    </CardContent>
  </Card>
);

export default StatsCard;