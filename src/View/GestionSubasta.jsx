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
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import app, { getSubasta } from "../Controller/Database-controller.js";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ABI from "../Contracts/NFT.sol";
import Alert from "@mui/material/Alert";
import { promiseNFt } from "../Controller/contract-controller.js";
class GestionSubasta extends Component {
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
      await getSubasta(this.props.params.Id)
        .then((info) => {
          this.setState({ Info: info });
          return info;
        })
        .then((response) =>
          fetchMetadataSingleNft(response.Id).then((response) =>
            this.setState({ data: response })
          )
        );
    }
  }

  async FinalizarSubasta() {
    const ERC721ABI = [
      "function finalizarSubasta(uint256 _ID)public",
      "function admins(uint256) view returns(address)",
      "function nAdmins() view returns(uint)",
      "function ID() view returns(uint)",
    ];
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const db = getFirestore(app);
    const SubastasSmartContract = "0x21Cc86798C5b09c900c8Cd489f9FF1C0335Bd1C9";
    const Contract = new ethers.Contract(
      SubastasSmartContract,
      ERC721ABI,
      provider
    );

    let signer = await provider.getSigner();
    const daiWithSigner = Contract.connect(signer);

    await signer.getAddress().then((address) => {
      console.log(address);
      let wallet = false;
      Contract.nAdmins()
        .then((NAdmins) => {
          let Isadmin = false;

          console.log(NAdmins.toNumber() + 1);
          for (let i = 0; i < NAdmins.toNumber() + 1 && !Isadmin; i++) {
            console.log(111);
            Contract.admins(i).then((adminaddress) => {
              console.log(address + "  " + adminaddress);
              if (address == adminaddress) {
                Isadmin = true;
                let Ref = collection(
                  db,
                  "Subastas",
                  this.props.params.Id,
                  "Pujadores"
                );
                const docRef = doc(
                  db,
                  "Subastas",
                  this.props.params.Id,
                  "Pujadores",
                  (parseInt(this.state.Info.NumerodePujas, 10)).toString()
                );
                  daiWithSigner
                    .finalizarSubasta(this.props.params.Id)
                    .then((promise) =>
                      promise.wait().then(() => {
                        getDoc(docRef).then((data) => {
                          console.log(data);
                          updateDoc(doc(db, "Subastas", this.props.params.Id), {
                            Open: false,
                            WinnerWallet: data.data().Addr,
                            ToPay: true,
                          })
                            .then(() =>
                              updateDoc(doc(db, "Obras", this.state.Info.Id), {
                                InProgress: false,
                                ToPay: true,
                              })
                            )
                            .then(() => {
                              this.setState({
                                GoodSnackBarMessage: "Subasta Finalizada",
                              });
                              this.GoodSnackBarOpen();
                              wallet = true;
                            });
                        });
                      })
                    );
              }
            });
          }
        })
        .then(() => {
          if (!wallet) {
            this.setState({
              BadSnackBarMessage: "Debe de conectar la cartera correcta",
            });
            this.BadSnackBarOpen();
          }
        });
    });
  }

  async SiguientePujador() {
    const ERC721ABI = [
      "function NextPayer()public ",
      "function admins(uint256) view returns(address)",
      "function nAdmins() view returns(uint)",
      "function ID() view returns(uint)",
    ];
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const db = getFirestore(app);
    const SubastasSmartContract = "0x21Cc86798C5b09c900c8Cd489f9FF1C0335Bd1C9";
    const Contract = new ethers.Contract(
      SubastasSmartContract,
      ERC721ABI,
      provider
    );

    let signer = await provider.getSigner();
    const daiWithSigner = Contract.connect(signer);

    await signer.getAddress().then((address) => {
      console.log(address);
      let wallet = false;
      Contract.nAdmins()
        .then((NAdmins) => {
          let Isadmin = false;

          console.log(NAdmins.toNumber() + 1);
          for (let i = 0; i < NAdmins.toNumber() + 1 && !Isadmin; i++) {
            console.log(111);
            Contract.admins(i).then((adminaddress) => {
              console.log(address + "  " + adminaddress);
              if (address == adminaddress) {
                Isadmin = true;
                daiWithSigner.NextPayer().then((promise) =>
                  promise.wait().then(() => {
                    updateDoc(doc(db, "Subastas", this.props.params.Id), {
                      Id: this.props.params.Id,
                    })
                      .then(() =>
                        updateDoc(doc(db, "Obras", this.props.params.Id), {
                          InProgress: false,
                          ToPay: true,
                        })
                      )
                      .then(() => {
                        this.setState({
                          GoodSnackBarMessage: "Pujador Modificado",
                        });
                        this.GoodSnackBarOpen();
                        wallet = true;
                      });
                  })
                );
              }
            });
          }
        })
        .then(() => {
          if (!wallet) {
            this.setState({
              BadSnackBarMessage: "Debe de conectar la cartera correcta",
            });
            this.BadSnackBarOpen();
          }
        });
    });
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
                  style={{ fontSize: 35, fontWeight: 200 }}color="#482d0b"   sx={{textDecoration: 'underline'}} display="inline"
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
                    {info.Open ? (
                      <>
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
                              onClick={() => this.FinalizarSubasta()}
                            >
                              Finalizar Subasta
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <>
                        {" "}
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
                              onClick={() => this.SiguientePujador()}
                            >
                              Siguiente Pujador
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
export default withRouter(GestionSubasta);
