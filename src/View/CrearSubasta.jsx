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
import app from "../Controller/LogIn-controller.js";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ABI from "../Contracts/NFT.sol";
import Alert from "@mui/material/Alert";

class CrearSubasta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: "s",
      scrollPosition: 0,
      response: [],
      data: [],
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
      await fetchMetadataSingleNft(this.props.params.Id)
        .then((response) => this.getOnSiteSingleNft(response))
        .then((response) => this.setState({ data: response }));
    }
  }
  async getOnSiteSingleNft(Data) {
    console.log(Data);
    let auth = getAuth(app);
    const db = getFirestore(app);
    let info = Data;
    let docRef = doc(db, "Obras", this.props.params.Id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //console.log("Obra:" + Data[i].name + "-> " + docSnap.data().InSite);
      console.log(docSnap.data());
      info = {
        ...info,
        InSite: docSnap.data().InSite,
        InProgress: docSnap.data().InProgress,
      };
      console.log(info);
    } else console.log("no hay datos");

    console.log(info);
    return info;
  }

  async promiseNFt() {
    const ERC721ABI = [
      "function approve(address to, uint256 tokenId) public virtual",
    ];
    if (this.state.Puja != 0) {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const NFTSmartContract = "0x57F6c8aad191e2C2079d02E199f0e916BA3308C3";
      let signer = await provider.getSigner();
      let con = false;
      let signerAddr = await signer.getAddress().then((addr) =>
        getOwnerofNFT(this.props.params.Id).then((owner) => {
          console.log(addr + " " + owner);
          if (addr == owner) {
            const Contract = new ethers.Contract(
              NFTSmartContract,
              ERC721ABI,
              provider
            );
            const daiWithSigner = Contract.connect(signer);
            let promise = daiWithSigner
              .approve(
                "0x21Cc86798C5b09c900c8Cd489f9FF1C0335Bd1C9",
                this.props.params.Id
              )
              .then((promise) => promise.wait().then(() => this.setPuja()));
          } else {
            this.setState({
              BadSnackBarMessage: "Debe de conectar la cartera correcta",
            });
            this.BadSnackBarOpen();
          }
        })
      );
    } else {
      this.setState({ BadSnackBarMessage: "Escriba la Puja minima" });
      this.BadSnackBarOpen();
    }
  }
  async setPuja() {
    const db = getFirestore(app);
    if (this.state.Puja != 0) {
      await updateDoc(doc(db, "Obras", this.props.params.Id), {
        PujaMinima: this.state.Puja,
        ToVerify: true,
      });
      this.setState({ GoodSnackBarMessage: "Solicitud de subasta creada" });
      this.GoodSnackBarOpen();
    } else {
    }
  }
  render() {
    let data = [];
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
                  Informacion de la obra
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
                    </Grid>
                    {data.InSite ? (
                      <>
                        {data.InProgress ? (
                          <>
                            <Grid item sx={{ paddingTop: 3 }}>
                              <Grid container alignItems="center">
                                <Typography
                                  style={{
                                    fontSize: 20,
                                    fontWeight: 50,
                                    color: "Green",
                                  }}
                                >
                                  Subasta en Progreso
                                </Typography>
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
                                <Button variant="contained">
                                  Ir a la Pagina de la subasta
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ) : (
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
                                  Puja Inicial:
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
                                  Firmar Subasta
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Grid item sx={{ paddingTop: 3 }}></Grid>
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="flex-end"
                          sx={{ paddingTop: 5 }}
                        >
                          <Grid item>
                            <Button variant="contained">
                              <Link
                                to={`/Envio/${this.props.params.Id}`}
                                style={{
                                  color: "#FFF",
                                  textDecoration: "none",
                                }}
                              >
                                Enviar a almacen
                              </Link>
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    )}
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
export default withRouter(CrearSubasta);
