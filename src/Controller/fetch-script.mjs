// alchemy-nft-api/fetch-script.js
import fetch from "node-fetch";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import app from "./LogIn-controller.js";
// Setup request options:
var requestOptions = {
  method: "GET",
  headers: { accept: "application/json" },
};
//Contrato Subastas:0x21Cc86798C5b09c900c8Cd489f9FF1C0335Bd1C9
// Replace with your Alchemy API key:
const apiKey = "oaaWWgX72AK5rvY4KHWiq0KqlITn9Psh";
const baseURL = `https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForContract`;
// Replace with the wallet address you want to query:
const ownerAddr = "0x57F6c8aad191e2C2079d02E199f0e916BA3308C3";
const pageSize = 2;
const fetchURL = `${baseURL}?contractAddress=${ownerAddr}&withMetadata=true`;

async function fetchNFTs(wallet) {
  const NftsUrl = `https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${wallet}&contractAddresses[]=0x57F6c8aad191e2C2079d02E199f0e916BA3308C3&withMetadata=true&pageSize=100`;

  let nfts = fetch(NftsUrl, requestOptions).then((response) =>
    response.json().then((response) => response.ownedNfts)
  );
  return nfts;
}
async function getOwnerofNFT(id) {
  const ownerOfNft = `https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getOwnersForNFT?contractAddress=0x57F6c8aad191e2C2079d02E199f0e916BA3308C3&tokenId=${id}`;

  let OwnerMetadata = fetch(ownerOfNft, requestOptions)
    .then((response) => response.json())
    .then((response) => response.owners[0]);
  console.log(OwnerMetadata);
  return OwnerMetadata;
}
async function fetchMetadataSingleNft(id) {
  const MetadataNft = `https://eth-sepolia.g.alchemy.com/nft/v2/${apiKey}/getNFTMetadata?contractAddress=0x57F6c8aad191e2C2079d02E199f0e916BA3308C3&tokenId=${id}&refreshCache=false`;
  console.log("ID" + id);
  let nftMetadata = fetch(MetadataNft, requestOptions).then((response) =>
    response.json().then((response) => response.metadata)
  );
  console.log(nftMetadata);
  return nftMetadata;
}
async function fetchMetataNFTsToVerify(data) {
  let Metadata = [];
  let Oldata = data;
  console.log(Oldata[1]);
  for (let i = 0; i < data.length; i++) {
    console.log(1111);
    const MetadataNft = `https://eth-sepolia.g.alchemy.com/nft/v2/${apiKey}/getNFTMetadata?contractAddress=0x57F6c8aad191e2C2079d02E199f0e916BA3308C3&tokenId=${data[i].id}&refreshCache=false`;
    let nftMetadata = fetch(MetadataNft, requestOptions).then((response) =>
      response.json().then((response) => {
        Metadata[i] = { ...data[i], Metadata: response.metadata };
      })
    );
  }
  console.log(Metadata);
  return Metadata;
}
async function loadMetadataObras(Data) {
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
export {
  loadMetadataObras,
  fetchMetataNFTsToVerify,
  fetchMetadataSingleNft,
  getOwnerofNFT,
  fetchNFTs,
};
// Make the request and print the formatted response:

/*fetch(fetchURL, requestOptions)
  .then((response) => response.json())
  .then(
    (
      result //console.log(result);
    ) =>
      result.nfts.forEach((element) => {
        let object = new Object();
        object.tokenId = element.tokenId;
        object.tokenUri = element.tokenUri;
        object.Name = element.name;
        arrayObj.push(object);
        console.log(arrayObj);
      })
  )
  .catch((error) => console.log("error", error));*/
