import React, { Component } from "react";
import Box from "@mui/material/Box";
import {
  fetchMetadataSingleNft,
  fetchNFTs,
  getOwnerofNFT,
} from "./fetch-script";
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
import { doc, setDoc, getFirestore, getDoc ,updateDoc} from "firebase/firestore";
import app from "./Database.mjs";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ABI from "./Contracts/NFT.sol";
import Alert from "@mui/material/Alert";

class ConfirmarSubasta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: "s",
      scrollPosition: 0,
      response: [],
      data: [],
      uid: this.props.UserUid,
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
        .then((response) => this.getPujaSingleNft(response))
        .then((response) => this.setState({ data: response }))
        .then(() => getOwnerofNFT(this.props.params.Id))
        .then((owner) => this.setState({ OwnerOfNft: owner }));
    }
  }
  async getPujaSingleNft(Data) {
    console.log(Data);
    const db = getFirestore(app);
    let info = Data;
    let docRef = doc(db, "Obras", this.props.params.Id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //console.log("Obra:" + Data[i].name + "-> " + docSnap.data().InSite);
      console.log(docSnap.data());
      info = { ...info, PujaMinima: docSnap.data().PujaMinima };
    } else console.log("no hay datos");

    console.log(info);
    return info;
  }

  async CrearSubasta() {
    const ERC721ABI = [
      "function crearSubasta(uint256 _objeto,uint256 _precioBase, address _NFTowner)public returns(uint256)",
      "function admins(uint256) view returns(address)",
      "function nAdmins() view returns(uint)",
    ];
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let Wallet= false;
    await provider.send("eth_requestAccounts", []);
    const db = getFirestore(app);
    const SubastasSmartContract = "0x7C5EDb64c8613D0778F6166Edfe8099Bf16D0182";
    const Contract = new ethers.Contract(
      SubastasSmartContract,
      ERC721ABI,
      provider
    );

    let signer = await provider.getSigner();
    const daiWithSigner = Contract.connect(signer);

    await signer.getAddress().then((address) => {
      console.log(address);
      Contract.nAdmins().then((NAdmins) => {
        let Isadmin = false;
        for (let i = 0; i < NAdmins + 1 && !Isadmin; i++) {
          Contract.admins(i).then((adminaddress) => {
            console.log(
              ethers.utils.parseUnits(this.state.data.PujaMinima, "ether")
            );
            if (address == adminaddress){
              Wallet=true;
              daiWithSigner
                .crearSubasta(
                  this.props.params.Id,
                  ethers.utils.parseUnits(this.state.data.PujaMinima, "ether"),
                  this.state.OwnerOfNft
                )
                .then((promise) =>
                  promise.wait().then(() => {
                    updateDoc(doc(db, "Obras", this.props.params.Id), {
                      InProgress: true,
                      ToVerify:false,
                    });
                    this.setState({
                      GoodSnackBarMessage: "Subasta creada",
                    });
                    this.GoodSnackBarOpen();
                  })
                );}
          });
        }
        return Wallet;
      });
    });
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
                  style={{ fontSize: 35, fontWeight: 200, color: "Black" }}
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
                        <TextField disabled label={data.PujaMinima}></TextField>
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
                          onClick={() => this.CrearSubasta().then((Wallet)=>{if(!Wallet){this.setState({BadSnackBarMessage :"Debe de conectar la cartera correcta"})
        this.BadSnackBarOpen();}})}
                        >
                          Crear Subasta
                        </Button>
                      </Grid>
                    </Grid>
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
export default withRouter(ConfirmarSubasta);
