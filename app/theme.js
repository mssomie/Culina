// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#111E24', // Background color
    },
    primary: {
      main: '#02E6A2', // Main highlight color (buttons, etc.)
    },
    secondary: {
      main: '#D32A73', // Other highlighted important things
    },
    text: {
      primary: '#E4E8E9', // Text color
    },
    card: {
      main: '#1C2E37', // Color for cards on the background
    },
  },

  typography:{
    fontFamily: 'Signika, Arial, sans-serif',
    h1:{
        fontSize: '44px',
        // fontWeight: 700
    },
    h2:{
        fontSize: '36px',
        // fontWeight: 700
    },
    h3:{
        fontSize: '16px',
        // fontWeight: 700
    },
    body1:{
        fontSize: '16px',
        // fontWeight: 700
    },
  }
});

export default theme;
