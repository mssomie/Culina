// theme.js
import { createTheme } from '@mui/material/styles';
import { Signika, Rubik } from "next/font/google";

const signika = Signika({ subsets: ["latin"] });
const rubik = Rubik({subsets: ["latin"]});


const theme = createTheme({
fontClassName: signika.className,

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
    fontFamily: signika.style.fontFamily,
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
    label:{
        fontSize: '16px',
        fontWeight: 300,
        color: '#4c5e63',
    },
    button: {
        fontFamily: signika.style.fontFamily,
        fontSize: '14px', // Set font size for buttons
        textTransform: 'none', // Prevent text transformation (i.e., no forced capitalization)
      },
  },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // Apply global text styles to all TextField components
          '& input': {
            fontFamily: signika.style.fontFamily,
            fontSize: '14px',
          },
        },
      },
    },
    MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: signika.style.fontFamily,
            fontSize: '14px',
            textTransform: 'none', // Prevent text transformation
            borderRadius: '16px',
          },
        },
      },
    MuiInputAdornment: {
        styleOverrides: {
          root: {
            fontFamily: signika.style.fontFamily,
            fontSize: '14px', 
          },
        },
    },
  },
});


export default theme;
