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
} from "../Controller/fetch-script";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import app from "../Controller/LogIn-controller.js";

class VerifySubasta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      scrollPosition: 0,
      uid: this.props.UserUid,
      wallet: "",
      Metadata: [],
      Type: "Client",
    };
    console.log("uid:" + this.state.uid);
  }
  async componentWillMount() {
    if (this.state.uid != "LogIn") {
      await this.GetUserType().then((Type) => {
        if (Type)
          this.loadObras()
            .then((response) => this.loadMetadataObras(response))
            .then((response) => this.setState({ Metadata: response }));
      });
    }
  }

  async loadMetadataObras(Data) {
    console.log(Data);
    let list = Data;
    for (let i = 0; i < Data.length; i++) {
      await fetchMetadataSingleNft(list[i].id).then(
        (response) => (list[i] = { ...list[i], Metadata: response })
      );
    }

    console.log(list);
    return list;
  }
  async loadObras() {
    const db = getFirestore(app);
    let data = [];
    const q = query(collection(db, "Obras"), where("ToVerify", "==", true));
    const querySnapshot = await getDocs(q)
      .then((response) => {
        console.log(response.docs);
        for (let i = 0; i < response.docs.length; i++) {
          data.push({
            id: response.docs[i].id,
            ToVerify: response.docs[i].data().ToVerify,
          });
        }
      })
      .then(() => this.setState({ data: data }));
    return data;
  }
  async GetUserType() {
    if (this.state.uid != "LogIn") {
      const db = getFirestore(app);
      const docRef = doc(db, "Users", this.state.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().Type == "Admin") {
        this.setState({ Type: docSnap.data().Type });
        return true;
      } else return false;
    } else console.log("Primera vez");
  }
  render() {
    let data = [];
    data = this.state.Metadata;
    let uid = this.state.uid;
    let Type = this.state.Type;
    console.log(data[0]);
    return (
      <Box>
        {uid != "LogIn" || Type == "Admin" ? (
          <>
          <Grid
          container
          alignItems="center"
          direction="column"
          justifyContent="space-evenly "style={{ paddingLeft: 100, paddingTop: 20 }}
        ><Typography       color="#482d0b"   sx={{textDecoration: 'underline'}} display="inline"     style={{ fontSize: 35, fontWeight: 200 }}
        >Subastas a Verificar </Typography>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="baseline"
              style={{ paddingLeft: 100, paddingTop: 100 }}
            >
              {data.map((data, index) => {
                const { id } = data;
                const { name, tokenId, description, image } = data.Metadata;
                //console.log(data);
                return (
                  <Grid item xs={4} sm={6} lg={4}>
                    <Card sx={{ width: 300 }} style={{ borderRadius: "16px" }}>
                      <Box
                        as={Link}
                        to={`/ConfirmarSubasta/${id}`}
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
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid></Grid>
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

export default VerifySubasta;
