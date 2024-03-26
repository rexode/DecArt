import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { fetchNFTs } from "./fetch-script";

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      scrollPosition: 0,
    };
  }
  async componentWillMount() {
    await fetchNFTs("0x8B66676696E61EE8748e30AA5a07D18BaD0810D8").then(
      (response) => this.setState({ data: response })
    );
  }
  render() {
    let data = [];
    data = this.state.data;
    console.log(data);
    return (
      <Box style={{ padding: 100 }}>
        <Grid
          container
          spacing={3}
          style={{ flexWrap: "nowrap" }}
          direction="row"
          justifyContent="center"
          alignItems="baseline"
          columns={2}
        >
          {data.map((data, index) => {
            const { tokenId, name, description, image } = data;
            //console.log(data);
            return (
              <Grid item xs={6} sm={4}>
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
                        {tokenId}
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

export default App;
