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
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import app from "./Database.mjs";

class Cuenta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: "s",
      UserUid: this.props.UserUid,
      Wallet: "",
      Username: "",
    };
  }

  async componentWillMount() {
    await this.loadUserdata()
  }

  async loadUserdata(){
    if (this.props.UserUid != "LogIn") {
      let auth = getAuth(app);
      const db = getFirestore(app);
      const docRef = doc(db, "Users", this.props.UserUid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().Wallet);
        this.setState({ wallet: docSnap.data().Wallet });
        this.setState({ Username: docSnap.data().Username });
      } else console.log("no hay datos");
    } else console.log("Primera vez");
  }
  render() {
    let Username ="";
    let UserUid="";
    let Wallet="";
    Wallet= this.state.wallet;
    UserUid= this.state.UserUid;
    Username = this.state.Username;
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
              style={{ fontSize: 35, fontWeight: 200, color: "Black" }}
            >
              Informacion de la cuenta
            </Typography>
          </Grid>

          <Grid item sx={{ paddingTop: 3 }}>
            <Grid container direction="row" justifyContent="space-evenly ">
              

              <Grid item xs={12}>
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  rowSpacing={2}
                >
                  <Grid item>
                    <Typography
                      style={{ fontSize: 20, fontWeight: 130, color: "Black" }}
                    >
                      Name: {Username}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ paddingTop: 3 }}>
                    <Typography
                      style={{ fontSize: 15, fontWeight: 100, color: "Black" }}
                    >
                      Id: {UserUid}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      style={{ fontSize: 20, fontWeight: 130, color: "Black" }}
                    >
                      Wallet: {Wallet}
                    </Typography>
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
export default withRouter(Cuenta);
