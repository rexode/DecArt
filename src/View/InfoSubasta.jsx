import React, { Component } from "react";
import Box from "@mui/material/Box";
import {
  fetchMetadataSingleNft,
  fetchNFTs,
  getOwnerofNFT,
} from "../Controller/fetch-script";
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
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import app,{getSubasta} from "../Controller/Database-controller.js";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ABI from "../Contracts/NFT.sol";
import Alert from "@mui/material/Alert";
import {promiseNFt} from "../Controller/contract-controller.js";
class InfoSubasta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: "s",
      scrollPosition: 0,
      response: [],
      data: [],
      Info: [],
      uid: this.props.UserUid,
      Puja: 0,
      GoodSnackBar: 0,
      BadSnackBar: 0,
      GoodSnackBarMessage: "Success!",
      BadSnackBarMessage: "Error!",
    };
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
  async componentWillMount() {
    if (this.state.uid != "LogIn") {
      await getSubasta(this.props.params.Id).then((info)=>{this.setState({ Info: info }); return info}).then((response) =>
        fetchMetadataSingleNft(response.Id).then((response) =>
          this.setState({ data: response })
        )
      );
    }
  }
  

  async promiseNFt() {
    const ERC721ABI = ["function apostar(uint256 valor, uint256 _ID)public"];
    const db = getFirestore(app);
    const docRef = doc(db, "Users", this.state.uid);

    if (this.state.Puja > this.state.Info.PujaActual) {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const NFTSmartContract = "0x21Cc86798C5b09c900c8Cd489f9FF1C0335Bd1C9";
      let signer = await provider.getSigner();
      let signerAddr = await signer
        .getAddress()
        .then((addr) => {
          getDoc(docRef).then((docSnap) => {
            console.log(addr + " " + docSnap.data().Wallet);
            if (docSnap.exists() && addr == docSnap.data().Wallet) {
              const Contract = new ethers.Contract(
                NFTSmartContract,
                ERC721ABI,
                provider
              );
              const daiWithSigner = Contract.connect(signer);

              let promise = daiWithSigner
                .apostar(
                  ethers.utils.parseUnits(this.state.Puja, "ether").toString(),
                  this.props.params.Id
                )
                .then((promise) => promise.wait().then(() => this.setPuja(addr)));
            } else {
              this.setState({
                BadSnackBarMessage: "Debe de conectar la cartera correcta",
              });
              this.BadSnackBarOpen();
            }
          });
        })
        .catch((error) => console.log(error.message));
    } else {
      this.setState({
        BadSnackBarMessage: "La puja debse ser mayor a la actual",
      });
      this.BadSnackBarOpen();
    }
  }
  async setPuja(addr) {
    const db = getFirestore(app);
    console.log(this.state.Info);
    let Ref= doc(db, "Subastas", this.props.params.Id, "Pujadores", (parseInt(this.state.Info.NumerodePujas, 10 ) + 1).toString());
    if (this.state.Puja != 0) {
      await updateDoc(doc(db, "Subastas", this.props.params.Id), {
        PujaActual: this.state.Puja,
        NumerodePujas: parseInt(this.state.Info.NumerodePujas, 10 ) + 1
        
      }).then(()=>setDoc(Ref ,{
        PujaActual: this.state.Puja,
        Addr: addr,
      }) );
      this.setState({ GoodSnackBarMessage: "Puja realizada" });
      this.GoodSnackBarOpen();
    } else {
    }
  }
  render() {
    let data = [];
    let info = this.state.Info;
    console.log(info);
    data = this.state.data;
    let uid = this.state.uid;
    return (
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
          {uid != "LogIn" ? (
            <Grid
              container
              alignItems="center"
              direction="column"
              justifyContent="space-evenly "
            >
              <Grid item>
                <Typography
                  style={{ fontSize: 35, fontWeight: 200 }}color="#482d0b"  sx={{textDecoration: 'underline'}} display="inline"
                >
                  Informacion de la Subasta
                </Typography>
              </Grid>

              <Grid item sx={{ paddingTop: 3 }}>
                <Grid container direction="row" justifyContent="space-evenly ">
                  <Grid item>
                    <Box>
                      <img src={data.image} />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Grid
                      container
                      direction="column"
                      justifyContent="space-between"
                      rowSpacing={2}
                    >
                      <Grid item>
                        <Typography
                          style={{
                            fontSize: 20,
                            fontWeight: 130,
                            color: "Black",
                          }}
                        >
                          Nombre: {data.name}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ paddingTop: 3 }}>
                        <Typography
                          style={{
                            fontSize: 15,
                            fontWeight: 100,
                            color: "Black",
                          }}
                        >
                          Descripcion: {data.description}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ paddingTop: 3 }}>
                        <Typography
                          style={{
                            fontSize: 20,
                            fontWeight: 150,
                            color: "Black",
                          }}
                        >
                          Puja Actual: {info.PujaActual}
                        </Typography>
                      </Grid>
                    </Grid>
                    <>
                      <>
                        <Grid item sx={{ paddingTop: 3 }}>
                          <Grid container alignItems="center">
                            <Typography
                              style={{
                                fontSize: 20,
                                fontWeight: 50,
                                color: "Black",
                              }}
                            >
                              Puja en ETH:
                            </Typography>
                            <TextField
                              onChange={(e) => {
                                this.setState({ Puja: e.target.value });
                              }}
                            ></TextField>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="flex-end"
                          sx={{ paddingTop: 5 }}
                        >
                          <Grid item>
                            <Button
                              variant="contained"
                              onClick={() => this.promiseNFt()}
                            >
                              Realizar Puja
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    </>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
        </Box>
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
      </>
    );
  }
}

const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();

  return <WrappedComponent {...props} params={params} />;
};
export default withRouter(InfoSubasta);
