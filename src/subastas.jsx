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
import { fetchNFTs } from "./fetch-script";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import app from "./Database.mjs";

class ListarNftASubastar extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      data: [],
      scrollPosition: 0,
      uid: this.props.UserUid,
      wallet: "",
    };
    console.log("uid:" + this.state.uid);
  }
  async componentWillMount() {
    console.log(this.state.uid);
    if (this.state.uid != "LogIn") {
      await this.loadWallet(this.state.uid).then((wallet) =>
        fetchNFTs(wallet)
          .then((response) => {
            this.setState({ data: response });
            return response;
          })
          .then((response) => this.getOnSite(response))
          .then((list) => this.setState({ data: list }))
      );
    }
  }
  async getOnSite(Data) {
    let auth = getAuth(app);
    const db = getFirestore(app);
    let list = Data;
    for (let i = 0; i < Data.length; i++) {
      let docRef = doc(db, "Obras", Data[i].tokenId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        //console.log("Obra:" + Data[i].name + "-> " + docSnap.data().InSite);

        list[i] = {
          ...list[i],
          InSite: docSnap.data().InSite,
          InProgress: docSnap.data().InProgress,
        };
      } else console.log("no hay datos");
    }
    console.log(list);
    return list;
  }

  async loadWallet(props) {
    console.log("props: " + props);
    if (props.uid != "LogIn") {
      let auth = getAuth(app);
      const db = getFirestore(app);
      const docRef = doc(db, "Users", props);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().Wallet);
        this.setState({ wallet: docSnap.data().Wallet });
        return docSnap.data().Wallet;
      } else console.log("no hay datos");
    } else console.log("Primera vez");
  }
  render() {
    let data = [];
    data = this.state.data;
    let uid = this.state.uid;
    console.log(data);
    return (
      <Box>
        {uid != "LogIn" ? (
          <>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="baseline"
              style={{ paddingLeft: 100, paddingTop: 100 }}
            >
              {data.map((data, index) => {
                const {
                  tokenId,
                  name,
                  description,
                  image,
                  InSite,
                  InProgress,
                } = data;
                //console.log(data);
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
                        to={`/CrearSubasta/${tokenId}`}
                        style={{ textDecoration: "none" }}
                      >
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
                          {InSite ? (
                            <Chip
                              label="En almacen"
                              color="success"
                              sx={{ marginTop: 2 }}
                            />
                          ) : (
                            <Chip
                              label="Fuera del Almacen"
                              color="warning"
                              sx={{ marginTop: 2 }}
                            />
                          )}
                          {InProgress ? (
                            <Chip
                              label="Subasta en progreso"
                              color="success"
                              sx={{ marginTop: 2, marginLeft: 2 }}
                            />
                          ) : (
                            <></>
                          )}
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
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
                              style={{ color: "#FFF", textDecoration: "none" }}
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
      </Box>
    );
  }
}

export default ListarNftASubastar;
