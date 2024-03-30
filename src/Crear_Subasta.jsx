import React, { Component } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { fetchNFTs } from "./fetch-script";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";


class CrearSubasta extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      scrollPosition: 0,
    };
  }
  async componentWillMount() {
    await fetchNFTs("0x6186610db245471A8D9C674802a93dFe4c2eFeD2").then(
      (response) => this.setState({ data: response })
    );
  }
  render() {
    let data = [];
    data = this.state.data;
    console.log(data);
    return (
      
      <Box >
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="baseline"
          style={{ paddingLeft: 100, paddingTop:100 }}
        >
          {data.map((data, index) => {
            const { tokenId, name, description, image } = data;
            //console.log(data);
            return (
              <Grid item xs={4} sm={6} lg={4}>
                <Card sx={{ width: 300 }}>
                  <Box>
                    <CardMedia
                      sx={{ height: 140 }}
                      component="img"
                      image={image.originalUrl}
                      title={name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Id:{tokenId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {description}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }
}

export default CrearSubasta;
