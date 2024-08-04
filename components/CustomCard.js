// components/CustomCard.js
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px', // Adjust the border radius as needed
  backgroundColor: theme.palette.card.main,
  color: '#E4E8E9',
  // Add any other styles you need
  boxShadow: theme.shadows[3], // Example of using theme shadows
}));

export default CustomCard;
