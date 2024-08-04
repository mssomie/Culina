import React from 'react';
import { Card, CardContent, CardMedia, Typography, Divider, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove'; 
import CustomCard from './CustomCard';
import Image from 'next/image';

const ItemCard = ({ item, addItem, removeItem }) => {
  return (
    <CustomCard sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <CardMedia
        component="image"
        sx={{ width: 100, height: 100, objectFit: 'cove r' }}
        image={item.image || "bf.png"}
        alt={item.name}
      >
      </CardMedia>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" component="div">
          {item.name}
        </Typography>
        <Typography variant="body1">
          {item.category}
        </Typography>
        <Typography variant="body1" >
          Stock: {item.quantity}
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
    <Grid container spacing={1}>
      {items.map((item) => (
        <Grid item xs={12} sm={12} md={12} key={item.name}>
          <ItemCard item={item} addItem={addItem} removeItem={removeItem} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ItemList;
