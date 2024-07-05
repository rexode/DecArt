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
import { getSubastasUsers } from "../Controller/Database-controller";

class Subastas extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      data: [],
      scrollPosition: 0,
      wallet: "",
      Subastas: [],
      SubastasPagar: [],
    };
  }
  async componentWillMount() {
    if (this.props.UserUid != undefined && this.props.UserUid != "LogIn") {
      console.log(this.props.UserUid);
      await this.loadWallet(this.props.UserUid).then((wallet) =>
        getSubastasUsers(wallet)
          .then((response) => {
            console.log(response);
            loadMetadataObras(response).then((response) => {
              console.log(response);
              this.setState({ wallet: wallet, Subastas: response });
            });
          })
          
      );
    } else {
      console.log("Else");
      await getSubastasUsers("a")
        .then((response) => loadMetadataObras(response))
        .then((response) => this.setState({ Subastas: response }));
    }
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
    let Subastasabiertas = [];
    let SubastasCerradas = [];

    data = this.state.Subastas;
    for(let i=0; i<data.length;i++){
      console.log(data[i]);
      if(data[i].Open==true){
        Subastasabiertas.push(data[i]);
      } else if (this.props.UserUid != undefined && this.props.UserUid != "LogIn" && data[i].WinnerWallet==this.state.wallet && data[i].ToPay==true){
        SubastasCerradas.push(data[i]);
        console.log(SubastasCerradas);
      }
    }
    
    console.log(data);
    return (
      <Box>
        <>
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
            style={{ paddingLeft: 100, paddingTop: 40 }}
          >
            
            
            
            {Subastasabiertas.map((data, index) => {
              const { PujaActual, Started, id, SubastaId } = data;
              const { name, description, image } = data.Metadata;

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
                      to={`/InfoSubasta/${SubastaId}`}
                      style={{ textDecoration: "none" }}className='about-link-text'
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
            })}</Grid>
          </Grid>
          <Grid
          container
          alignItems="center"
          direction="column"
          justifyContent="space-evenly "style={{ paddingLeft: 100, paddingTop: 20 }}
        >{SubastasCerradas.length>0 ? (<Typography     color="#482d0b"  sx={{textDecoration: 'underline'}} display="inline"        style={{ fontSize: 35, fontWeight: 200 }}
          >Subastas ganadas </Typography>):(<></>)}
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="baseline"
            style={{ paddingLeft: 100, paddingTop: 40 }}
          >
            
            
            {SubastasCerradas.map((data, index) => {
              const { PujaActual, Started, id, SubastaId } = data;
              const { name, description, image } = data.Metadata;

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
                      to={`/PagarSubasta/${SubastaId}`}
                      style={{ textDecoration: "none" }}className='about-link-text'
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
            </Grid>
          </Grid>
        </>
      </Box>
    );
  }
}

export default Subastas;
