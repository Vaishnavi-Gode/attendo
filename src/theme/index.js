import { createTheme } from '@mui/material/styles';

// Custom color palette
const colors = {
  primary: '#1A1A1A',      // Soft Black
  secondary: '#B0BEC5',    // Cloud Gray
  background: '#ECEFF1',   // Light Gray
  accent: '#00ACC1',       // Aqua Blue
  highlight: '#EF5350',    // Signal Red
  text: '#F5F5F5',         // Light Grayish White
};

const baseThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: colors.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          backgroundColor: colors.accent,
          color: colors.text,
          '&:hover': {
            backgroundColor: '#0097A7',
            boxShadow: '0 6px 16px rgba(0,172,193,0.3)',
          },
        },
        outlined: {
          borderColor: colors.secondary,
          color: colors.primary,
          '&:hover': {
            borderColor: colors.accent,
            backgroundColor: 'rgba(0,172,193,0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(26,26,26,0.08)',
          border: `1px solid ${colors.secondary}40`,
          backgroundColor: colors.text,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colors.text,
            '& fieldset': {
              borderColor: colors.secondary,
            },
            '&:hover fieldset': {
              borderColor: colors.accent,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.accent,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          backgroundColor: colors.accent,
          color: colors.text,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary,
          boxShadow: '0 2px 8px rgba(26,26,26,0.15)',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
      light: colors.secondary,
      dark: '#0D0D0D',
      contrastText: colors.text,
    },
    secondary: {
      main: colors.secondary,
      light: '#CFD8DC',
      dark: '#90A4AE',
      contrastText: colors.primary,
    },
    background: {
      default: colors.background,
      paper: colors.text,
    },
    text: {
      primary: colors.primary,
      secondary: colors.secondary,
    },
    error: {
      main: colors.highlight,
      light: '#FFCDD2',
      dark: '#C62828',
    },
    info: {
      main: colors.accent,
      light: '#B2EBF2',
      dark: '#00838F',
    },
    success: {
      main: '#4CAF50',
      light: '#C8E6C9',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFE0B2',
      dark: '#F57C00',
    },
  },
});

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: colors.text,
      light: colors.background,
      dark: colors.primary,
      contrastText: colors.primary,
    },
    secondary: {
      main: colors.secondary,
      light: '#CFD8DC',
      dark: '#607D8B',
      contrastText: colors.text,
    },
    background: {
      default: colors.primary,
      paper: '#2A2A2A',
    },
    text: {
      primary: colors.text,
      secondary: colors.secondary,
    },
    error: {
      main: colors.highlight,
      light: '#FFCDD2',
      dark: '#C62828',
    },
    info: {
      main: colors.accent,
      light: '#B2EBF2',
      dark: '#00838F',
    },
    success: {
      main: '#4CAF50',
      light: '#C8E6C9',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFE0B2',
      dark: '#F57C00',
    },
  },
});

export { colors };
export default lightTheme;