import React, { Component } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { collection, query, where, getDocs } from "firebase/firestore";

import Typography from "@mui/material/Typography";
import {
  fetchNFTs,
  fetchMetadataSingleNft,
  fetchMetataNFTsToVerify,
} from "./fetch-script";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import app from "./Database.mjs";

class VerifySubasta extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      data: [],
      scrollPosition: 0,
      uid: this.props.UserUid,
      wallet: "",
      Metadata: [],
    };
    console.log("uid:" + this.state.uid);
  }
  async componentWillMount() {
    console.log(this.state.uid);
    if (this.state.uid != "LogIn") {
      await this.loadObras()
        .then((response) => this.loadMetadataObras(response))
        .then((response) => this.setState({ Metadata: response }));
    }
  }

  async loadMetadataObras(Data) {
    let auth = getAuth(app);
    const db = getFirestore(app);
    console.log(Data);
    let list = Data;
    for (let i = 0; i < Data.length; i++) {
      fetchMetadataSingleNft(list[i].id).then(
        (response) => (list[i] = { ...list[i], InSite: response })
      );
    }

    console.log(list);
    return list;
  }
  async loadObras() {
    let auth = getAuth(app);
    const db = getFirestore(app);
    let data = [];
    const q = query(collection(db, "Obras"), where("ToVerify", "==", true));
    const querySnapshot = getDocs(q)
      .then((response) => {
        console.log(response.docs);
        for (let i = 0; i < response.docs.length; i++) {
          data[i] = {
            ...data[i],
            id: response.docs[i].id,
            ToVerify: response.docs[i].data().ToVerify,
          };
        }
      })
      .then(() => this.setState({ data: data }));
    return data;
  }
  render() {
    let data = [];
    data = this.state.data;
    let uid = this.state.uid;
    console.log(data);
    return (
      <Box>
        {uid != "LogIn" ? (
          <></>
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

export default VerifySubasta;
