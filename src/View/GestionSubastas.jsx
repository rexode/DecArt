import React, { Component } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import {
  doc,
  setDoc,
  where,
  getFirestore,
  query,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import app from "../Controller/LogIn-controller.js";
import { loadMetadataObras } from "../Controller/fetch-script";
import { getSubastasGestion } from "../Controller/Database-controller";

class GestionSubastas extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      data: [],
      scrollPosition: 0,
      wallet: "",
      uid: this.props.UserUid,
      Subastas: [],
    };
  }
  async componentWillMount() {
    if (this.state.uid != "LogIn") {
    await getSubastasGestion()
      .then((response) => loadMetadataObras(response))
      .then((response) => this.setState({ Subastas: response }));}  
  }

  render() {
    let data = [];
    data = this.state.Subastas;
    console.log(data);
    let uid = this.state.uid;

    return (
      <Box>
        <>
        {uid != "LogIn" ? (
          <Grid
          container
          alignItems="center"
          direction="column"
          justifyContent="space-evenly "style={{ paddingLeft: 100, paddingTop: 20 }}
        ><Typography       color="#482d0b"   sx={{textDecoration: 'underline'}} display="inline"     style={{ fontSize: 35, fontWeight: 200 }}
        >Subastas Abiertas </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="baseline"
            style={{ paddingLeft: 100, paddingTop: 20 }}
          >
            {data.map((data, index) => {
              const { PujaActual, Started, id, SubastaId,Open } = data;
              const { name, description, image } = data.Metadata;

              console.log(data);
              return (
                <Grid item xs={4} sm={6} lg={4}>
                  <Card
                    sx={{
                      width: 300,
                      borderRadius: "16px",
                    }}
                  >
                    <Box
                      as={Link}
                      to={`/GestionSubasta/${SubastaId}`}
                      style={{ textDecoration: "none" }} className='about-link-text'
                    >
                      <CardMedia
                        sx={{ height: 140 }}
                        component="img"
                        image={image}
                        title={name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Id:{id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {description}
                        </Typography>
                        {Open ? (<><Chip
                              label="Subasta en progreso"
                              color="success"
                              sx={{ marginTop: 2, marginLeft: 2 }}
                            /></>):(<><Chip
                              label="Subasta Finalizada"
                              color="warning"
                              sx={{ marginTop: 2 }}
                            /></>)}
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid></Grid>
          ) : (
            <>
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
                      Inicia sesion para acceder a esta pestaña
                    </Typography>
                  </Grid>

                  <Grid item sx={{ paddingTop: 3 }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-evenly "
                    >
                      <Grid item xs={12}>
                        <Grid
                          container
                          direction="column"
                          justifyContent="space-between"
                          rowSpacing={2}
                        >
                          <Grid item>
                            <Button variant="contained">
                              <Link
                                to={"/LogIn"}
                                style={{
                                  color: "#FFF",
                                  textDecoration: "none",
                                }}
                              >
                                Log-In
                              </Link>
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </>
      </Box>
    );
  }
}

export default GestionSubastas;
