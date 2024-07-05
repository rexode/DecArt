import React, { Component } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { doc, setDoc, getFirestore } from "firebase/firestore";
import { withRouter } from "react-router-dom";
import app from "../Controller/LogIn-controller.js";
import { useNavigate } from "react-router-dom";

class Log_in extends Component {
  constructor(props) {
    super(props);
    this.handle.bind(this);
    this.state = {
      Login: 1,
      Email: "",
      Password: "",
      Username: "",
      ConfirmPassword: "",
      GoodSnackBar: 0,
      BadSnackBar: 0,
      GoodSnackBarMessage: "Success!",
      BadSnackBarMessage: "Error!",
      Wallet: "Cartera",
      IsWalletUnique: true
    };
  }
  handle(uid) {
    this.props.changeID(uid);
  }
  GoodSnackBarOpen() {
    this.setState({ GoodSnackBar: 1 });
  }
  BadSnackBarOpen() {
    this.setState({ BadSnackBar: 1 });
  }
  GoodSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ GoodSnackBar: 0 });
  };
  BadSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ BadSnackBar: 0 });
  };

  GoLogIn() {
    let email = this.state.Email;
    let password = this.state.Password;
    let auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.setState({ GoodSnackBarMessage: "Inicio de sesion correcto" });
        this.GoodSnackBarOpen();
        //console.log(userCredential.user);
        return user;
      })
      .then((user) => {
        console.log(this.props.changeID);
        this.handle(user.uid);
        console.log(user.uid);
        return user;
      })
      .then((user) =>
        this.props.navigate("/Subastas", { state: { id: user.uid } })
      )
      .catch((error) => {
        const errorCode = error.code;
        this.setState({ BadSnackBarMessage: "Credenciales incorrectas" });
        this.BadSnackBarOpen();
        const errorMessage = error.message;
      });
  }
  GoRegister() {
    console.log("aaa");
    let email = this.state.Email;
    let password = this.state.Password;
    let Username = this.state.Username;

    const db = getFirestore(app);
    let auth = getAuth(app);
    if (this.state.Password != this.state.ConfirmPassword) {
      this.setState({ BadSnackBarMessage: "Las contraseñas son diferentes" });
      this.BadSnackBarOpen();
    } else if (this.state.Wallet == "Cartera") {
      this.setState({ BadSnackBarMessage: "Verifica la Cartera" });
      this.BadSnackBarOpen();
    }
     else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          console.log(userCredential.user);
          const user = userCredential.user;
          this.setState({ GoodSnackBarMessage: "Registro correcto" });
          this.setState({ Login: 1 });
          this.GoodSnackBarOpen();
          return user;
        })
        .then((user) => {
          setDoc(doc(db, "Users", user.uid), {
            Type: "Client",
            Wallet: this.state.Wallet,
            Username: this.state.Username,
          });
          return user;
        })
        .then((user) => {
          console.log("uid " + user.uid);
          this.props.navigate("/", { state: { id: user.uid } });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          return errorMessage;
        });
    }
  }
  handleRegister() {
    this.setState({ Login: 0 });
  }
  handleLogin() {
    this.setState({ Login: 1 });
  }
  async signMessage() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .send("eth_requestAccounts", [])
      .then(() => provider.getSigner())
      .then((signer) =>
        signer
          .signMessage("Verifica tu cartera")
          .then((signature) =>
            ethers.utils.verifyMessage("Verifica tu cartera", signature)
          )
          .then((address) => {
            let auth = getAuth(app);
            const db = getFirestore(app);
            const q = query(collection(db, "Users"), where("Wallet", "==", address));
            const querySnapshot = getDocs(q)
            .then((addresses) => {
              
              if(addresses.empty)
              this.setState({ Wallet: address })
            
            else{
              this.setState({ BadSnackBarMessage: "Esta cartera esta conectada a otra cuenta" });
              this.BadSnackBarOpen(); 
              this.setState({IsWalletUnique:false})}});
              
            

          })
          
      );
    /*const signer = provider.getSigner();
    let signature = signer
      .signMessage("Hello World")
  .then((message) => console.log(message));}*/
  }
  render() {
    return (
      <Box >
        {this.state.Login ? (
          <Grid
            container
            alignItems="center"
            direction="column"
            spacing={5}
            style={{ paddingTop: 100 }}
          >
            <Grid item>
              <Typography variant="h5" color="primary">
                Inicio de sesion
              </Typography>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                <TextField
                  variant="outlined"
                  label="Email"
                  fullWidth
                  style={{ marginBottom: "2em" }}
                  onChange={(e) => {
                    this.setState({ Email: e.target.value });
                  }}
                />
                <TextField
                  variant="outlined"
                  label="Contraseña"
                  fullWidth
                  style={{ marginBottom: "2em" }}
                  type="password"
                  onChange={(e) => {
                    this.setState({ Password: e.target.value });
                  }}
                />
                <Grid container direction="row" justifyContent="space-evenly">
                  <Button
                    size="large"
                    color="primary"
                    onClick={() => this.handleRegister()}
                  >
                    Registrarse
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => this.GoLogIn()}
                  >
                    Inicio de sesion
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            alignItems="center"
            direction="column"
            spacing={5}
            style={{ paddingTop: 100 }}
          >
            <Grid item>
              <Typography variant="h5" color="primary">
                Registrarse
              </Typography>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                <TextField
                  variant="outlined"
                  label="Email"
                  fullWidth
                  style={{ marginBottom: "2em" }}
                  onChange={(e) => {
                    this.setState({ Email: e.target.value });
                  }}
                />
                <TextField
                  variant="outlined"
                  label="Usuario"
                  fullWidth
                  style={{ marginBottom: "2em" }}
                  onChange={(e) => {
                    this.setState({ Username: e.target.value });
                  }}
                />
                <Grid
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  alignItems="center"
                  style={{ marginBottom: "2em" }}
                >
                  <TextField
                    disabled
                    label={this.state.Wallet}
                    onChange={(e) => {
                      this.setState({ Email: e.target.value });
                    }}
                  />
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => this.signMessage()}
                  >
                    Firma con la Cartera
                  </Button>
                </Grid>
                <TextField
                  variant="outlined"
                  label="Contraseña"
                  fullWidth
                  style={{ marginBottom: "2em" }}
                  type="password"
                  onChange={(e) => {
                    this.setState({ Password: e.target.value });
                  }}
                />
                <TextField
                  variant="outlined"
                  label="Confirma Contraseña"
                  fullWidth
                  style={{ marginBottom: "2em" }}
                  type="password"
                  onChange={(e) => {
                    this.setState({ ConfirmPassword: e.target.value });
                  }}
                />
                <Grid container direction="row" justifyContent="space-evenly">
                  <Button
                    size="large"
                    color="primary"
                    onClick={() => this.handleLogin()}
                  >
                    Inicio de sesion
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => this.GoRegister()}
                  >
                    Registrarse
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Snackbar
          open={this.state.BadSnackBar}
          autoHideDuration={6000}
          onClose={this.BadSnackBarClose}
        >
          <Alert
            onClose={this.BadSnackBarClose}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {this.state.BadSnackBarMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.GoodSnackBar}
          autoHideDuration={6000}
          onClose={this.GoodSnackBarClose}
        >
          <Alert
            onClose={this.GoodSnackBarClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {this.state.GoodSnackBarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
}
export function AppWithRouter(props, changeID) {
  const navigate = useNavigate();
  console.log(props);
  return <Log_in navigate={navigate} changeID={props.changeID} />;
}
export default Log_in;
