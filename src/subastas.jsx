import React, { Component } from "react";
import Box from "@mui/material/Box";
import { fetchMetadataSingleNft, fetchNFTs } from "./fetch-script";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";

class Subastas extends Component {
    constructor() {
      super();
      this.state = {
        Id: "s",
        scrollPosition: 0,
        response: [],
        data: [],
      };
    }
  
    async componentWillMount() {
      
    }
    render() {
      
      return (
        <Box
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            transform: "translate(-50%, -50%)",
          }}
          sx={{ lenght: "70%", width: "70%" }}
        >
          <Typography>Hola</Typography>
        </Box>
      );
    }
  }
  
  const withRouter = (WrappedComponent) => (props) => {
    const params = useParams();
  
    return <WrappedComponent {...props} params={params} />;
  };
  export default withRouter(Subastas);
  