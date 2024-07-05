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




async function promiseNFt() {
    const ERC721ABI = ["function apostar(uint256 valor, uint256 _ID)public"];
    const db = getFirestore(app);
    const docRef = doc(db, "Users", this.state.uid);

    if (this.state.Puja >= this.state.Info.PujaActual) {
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
                .then((promise) => promise.wait().then(() => this.setPuja()));
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
  async function setPuja() {
    const db = getFirestore(app);
    if (this.state.Puja != 0) {
      await updateDoc(doc(db, "Subastas", this.props.params.Id), {
        PujaActual: this.state.Puja,
      });
      this.setState({ GoodSnackBarMessage: "Puja realizada" });
      this.GoodSnackBarOpen();
    } else {
    }
  }

  export{promiseNFt,setPuja}