// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#ECEFF8', paper: '#fff' },
    text: { primary: '#333', secondary: '#666' },
    custom: {
      teamAvatar: '#18a0fb',
      lightWhite: '#eceff8',
      black80: 'rgba(0,0,0,0.8)',
      black30: 'rgba(0,0,0,0.3)',
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    body1: { fontSize: '0.8125rem' }, // ~13.33px
    body2: { fontSize: '0.6875rem' }, // ~10.67px
    caption: { fontSize: '0.5rem' }, // 8px
  },
  spacing: 8,
  shape: { borderRadius: 6 },
  components: {
    MuiCard: {
      styleOverrides: { root: { border: '1px solid rgba(0,0,0,0.1)' } },
    },
  },
});

export default theme;