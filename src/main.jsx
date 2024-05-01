import React, { Component } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { fetchNFTs } from "./fetch-script";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ListarNftASubastar from "./ListaNNftaSubastar";
import Log_in, { AppWithRouter } from "./Login_register";
import CrearSubasta from "./CrearSubasta";
import { useParams, useLocation } from "react-router-dom";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      scrollPosition: 0,
      login: "LogIn",
    };
  }
  async componentWillMount() {}
  render() {
    let data = [];
    data = this.state.data;

    return (
      <>
        <Box></Box>
        <ListarNftASubastar/>
      </>
    );
  }
}
const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();
  let location = useLocation();
  return <WrappedComponent {...props} {...{ location, params }} />;
};
export default withRouter(Main);
