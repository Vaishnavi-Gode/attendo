import { Card, CardContent } from '@mui/material';

const GlassCard = ({ children, sx = {}, ...props }) => (
  <Card sx={{
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '20px',
    ...sx
  }} {...props}>
    <CardContent sx={{ p: 3 }}>
      {children}
    </CardContent>
  </Card>
);

export default GlassCard;