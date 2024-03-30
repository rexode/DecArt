import React, { Component } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { fetchNFTs } from "./fetch-script";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import CrearSubasta from './Crear_Subasta';
import Log_in from './Login_register';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";


class App extends Component {
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
    <>
      <Box >
        <AppBar position="static">
          <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              DECart
            </Typography>
            <Button
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            Crear Subasta
            </Button>
            <Button
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            Subastas
            </Button>
            
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>

        </Box>
            {/* This is the alias of BrowserRouter i.e. Router */}
            <Router>
                <Routes>
                    {/* This route is for home component 
          with exact path "/", in component props 
          we passes the imported component*/}
                    <Route
                        exact
                        path="/"
                        element={<CrearSubasta />}
                    />
                    <Route
                        exact
                        path="/LogIn"
                        element={<Log_in />}
                    />
 
                    
                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
            </Router>
        </>
      
      
    );
  }
}

export default App;
