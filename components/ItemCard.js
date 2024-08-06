import React from 'react';
import { Card, CardContent, CardMedia, Typography, Divider, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove'; 
import CustomCard from './CustomCard';


const ItemCard = ({ item, addItem, removeItem }) => {
  return (
    <CustomCard sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <CardMedia
        component="image"
        sx={{ width: 80,
             height: 80, 
             objectFit: 'contain',
             borderRadius: '16px', // Adjust the border radius as needed (e.g., 1 for smaller radius, 2 for medium, etc.)
             p: 4, 
             marginLeft: '0.8rem'
             }}
        image={item.image || "bf.png"}
        alt={item.name}
      >
      </CardMedia>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="body1" component="div">
          {item.name}
        </Typography>
        <Typography variant="body1">
          {item.category}
        </Typography>
        <Typography variant="label" >
          Stock: <span style={{color: 'white'}}> {item.quantity}</span>
        </Typography>
        
      </CardContent>
      <Divider orientation="vertical" flexItem sx={{ height: 'auto', mx: 2 }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100px' }}>
        <IconButton aria-label="decrease" size="small" onClick={() => removeItem(item.name)}>
          <RemoveIcon />
        </IconButton>
        <IconButton aria-label="increase" size="small" onClick={() => addItem(item.name)}>
          <AddIcon />
        </IconButton>
      </CardContent>
    </CustomCard>
  );
};

const ItemList = ({ items, addItem, removeItem }) => {
  return (
    <Grid container spacing={0.5}>
      {items.map((item) => (
        <Grid item xs={12} sm={12} md={12} key={item.name} spacing = {1} gap={1}>
          <ItemCard item={item} addItem={addItem} removeItem={removeItem} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ItemList;
