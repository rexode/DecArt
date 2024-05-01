import React, { Component } from "react";
import Box from "@mui/material/Box";
import { fetchMetadataSingleNft, fetchNFTs } from "./fetch-script";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc, updateDoc} from "firebase/firestore";
import app from "./Database.mjs";

class SendArt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: this.props.params.Id,
    };
    console.log(this.props.params.Id);
  }
  async UpdateStatus(){
    let auth = getAuth(app);
    const db = getFirestore(app);
    const Referencia = doc(db, "Obras", this.state.Id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(Referencia, {
      InSite: true
    });
    
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
        <Grid
          container
          alignItems="center"
          direction="column"
          justifyContent="space-evenly "
        >
          <Grid item>
            <Typography
              style={{ fontSize: 25, fontWeight: 200, color: "Black" }}
            >
              ¿Como enviar la obra a nuestros almacenes? 
            </Typography>
          </Grid>

          <Grid item sx={{ paddingTop: 3 }}>
            <Grid container direction="row" justifyContent="space-evenly ">
              <Grid item xs={6}>
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  rowSpacing={2}
                >
                  <Grid item>
                    <Typography
                      style={{ fontSize: 18, fontWeight: 130, color: "Black" }}
                    >
                      Recibiras un correo con los proximos pasos a realizar para la verificacion de la obra en nuestras instalaciones
                    </Typography>
                  </Grid>
                  <Grid item>
                        <Button variant="contained" onClick={() => this.UpdateStatus()}>Confirmar</Button>
                      </Grid>
                </Grid>
                
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();

  return <WrappedComponent {...props} params={params} />;
};
export default withRouter(SendArt);
