import React, { Component } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { fetchNFTs } from "./fetch-script";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Main from "./main";
import Log_in, { AppWithRouter } from "./Login_register";
import CrearSubasta from "./CrearSubasta";
import Subastas from "./subastas";
import Cuenta from "./account";
import SendArt from "./SendArt";

import { useNavigate } from "react-router-dom";

import app from "./Database.mjs";
import ListarNftASubastar from "./ListaNNftaSubastar";
import VerifySubasta from "./VerifySubasta";

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
        console.log("Document data:", docSnap.data().Username);
        this.setState({ Username: docSnap.data().Username });
        this.setState({ Type: docSnap.data().Username });
      } else console.log("no hay datos");
    } else console.log("Primera vez");
  };

  render() {
    return (
      <>
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
                    Mi Obras de arte
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
                <Link
                  to={"/Subastas"}
                  style={{ color: "#FFF", textDecoration: "none" }}
                >
                  Subastas
                </Link>
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
              path="/"
              element={<AppWithRouter changeID={this.changeID} />}
            />
            <Route
              exact
              path="/ListaNFTs"
              element={<ListarNftASubastar UserUid={this.state.UserUid} />}
            />
            <Route
              exact
              path="/CrearSubasta/:Id"
              element={<CrearSubasta UserUid={this.state.UserUid} />}
            />
            <Route exact path="/Subastas" element={<Subastas />} />
            <Route exact path="/VerificarSubasta" element={<VerifySubasta UserUid={this.state.UserUid}/>} />

            <Route exact path="/Envio/:Id" element={<SendArt />} />
            <Route
              exact
              path="/Cuenta"
              element={<Cuenta UserUid={this.state.UserUid} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
