import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';

const CustomTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: "#0f171A",
  borderRadius: '16px',
  padding: '1px 1px',
  '& .MuiInputBase-input': {
    padding: '0.8rem 0.8rem', // Adjust padding to fit height
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#4c5e63',
      borderRadius: '16px',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#02E6A2',
      borderWidth: '1px',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#02E6A2',
      borderWidth: '1px',
    },
  },
}));

export default CustomTextField;
