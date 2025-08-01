import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const CardsPage = () => {
  const cards = [1, 2, 3];  // Sample data for cards

  return (
    <Grid container spacing={2}>
      {cards.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card>
            <CardContent>
              <Typography variant="h5">Card {item}</Typography>
              <Typography variant="body2">
                This is some content for card {item}.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardsPage;
