import React, { Component } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Typography from "@mui/material/Typography";

class Log_in extends Component{


render(){

    return(
    <Card sx={{ textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    padding: '30px'
}}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Log-In
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>

    )
}

}
export default Log_in;