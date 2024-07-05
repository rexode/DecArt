import React, { Component } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { fetchNFTs } from "./Controller/fetch-script";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Main from "./View/main";
import Log_in, { AppWithRouter } from "./View/Login_register";
import CrearSubasta from "./View/CrearSubasta";
import Subastas from "./View/subastas";
import InfoSubasta from "./View/InfoSubasta";

import Cuenta from "./View/account";
import SendArt from "./View/SendArt";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";

import app from "./Controller/LogIn-controller.js";
import ListarNftASubastar from "./View/ListaNNftaSubastar";
import VerifySubasta from "./View/VerifySubasta";
import ConfirmarSubasta from "./View/ConfirmarSubasta";
import GestionSubastas from "./View/GestionSubastas"
import GestionSubasta from "./View/GestionSubasta"
import PagarSubasta from "./View/PagarSubasta"


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Link } from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      UserUid: "LogIn",
      Username: "",
      Type: "Client",
    };
  }
  handleclick() {
    let useruid = this.state.UserUid;
    console.log("uid " + useruid);
    this.props.navigate("/ListaNFTs", { state: { id: useruid } });
  }
  changeID = async (useruid) => {
    console.log("User Uid: " + useruid);
    if (useruid != null) {
      this.setState({ UserUid: useruid });
      let auth = getAuth(app);
      const db = getFirestore(app);
      const docRef = doc(db, "Users", useruid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(
          "Document data:",
          docSnap.data().Username + " Type: " + docSnap.data().Type
        );
        this.setState({ Username: docSnap.data().Username });
        this.setState({ Type: docSnap.data().Type });
      } else console.log("no hay datos");
    } else console.log("Primera vez");
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        {/* This is the alias of BrowserRouter i.e. Router */}
        <Router>
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
                {this.state.Type == "Client" ? (
                  <Link
                    to={"/ListaNFTs"}
                    style={{ color: "#FFF", textDecoration: "none" }}
                  >
                    Mis Obras de arte
                  </Link>
                ) : (
                  <Link
                    to={"/VerificarSubasta"}
                    style={{ color: "#FFF", textDecoration: "none" }}
                  >
                    Verificar Subastas
                  </Link>
                )}
              </Button>
              <Button
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                //href="/Subastas"
              >
                {this.state.Type == "Client" ? (
                  <Link
                  to={"/Subastas"}
                  style={{ color: "#FFF", textDecoration: "none" }}
                >
                    Subastas
                  </Link>
                ) : (
                  <Link
                    to={"/GestionSubastas"}
                    style={{ color: "#FFF", textDecoration: "none" }}
                  >
                    Gestion de Subastas
                  </Link>
                )}
                
                  
                
              </Button>

              <Button
                color="inherit" //href="/LogIn"
              >
                {this.state.UserUid == "LogIn" ? (
                  <Link
                    to={"/LogIn"}
                    style={{ color: "#FFF", textDecoration: "none" }}
                  >
                    {this.state.UserUid}
                  </Link>
                ) : (
                  <Link
                    to={"/Cuenta"}
                    style={{ color: "#FFF", textDecoration: "none" }}
                  >
                    {this.state.Username}
                  </Link>
                )}
              </Button>
            </Toolbar>
          </AppBar>
          <Routes>
            {/* This route is for home component 
          with exact path "/", in component props 
          we passes the imported component*/}
            <Route
              exact
              path="/LogIn"
              element={<AppWithRouter changeID={this.changeID} />}
            />
            <Route
              exact
              path="/ListaNFTs"
              element={<ListarNftASubastar UserUid={this.state.UserUid} />}
            />
            <Route
              exact
              path="/GestionSubastas"
              element={<GestionSubastas UserUid={this.state.UserUid} />}
            />
            <Route
              exact
              path="/InfoSubasta/:Id"
              element={<InfoSubasta UserUid={this.state.UserUid} />}
            />
            <Route
              exact
              path="/GestionSubasta/:Id"
              element={<GestionSubasta UserUid={this.state.UserUid} />}
            />
            <Route
              exact
              path="/PagarSubasta/:Id"
              element={<PagarSubasta UserUid={this.state.UserUid} />}
            />


            <Route
              exact
              path="/CrearSubasta/:Id"
              element={<CrearSubasta UserUid={this.state.UserUid} />}
            />
            <Route exact path="/" element={<Subastas UserUid={this.state.UserUid}/>} />
            <Route
              exact
              path="/ConfirmarSubasta/:Id"
              element={<ConfirmarSubasta UserUid={this.state.UserUid} />}
            />
            <Route
              exact
              path="/VerificarSubasta"
              element={<VerifySubasta UserUid={this.state.UserUid} />}
            />

            <Route exact path="/Envio/:Id" element={<SendArt />} />
            <Route
              exact
              path="/Cuenta"
              element={<Cuenta UserUid={this.state.UserUid} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
