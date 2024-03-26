// alchemy-nft-api/fetch-script.js
import fetch from "node-fetch";

// Setup request options:
var requestOptions = {
  method: "GET",
  headers: { accept: "application/json" },
};

// Replace with your Alchemy API key:
const apiKey = "oaaWWgX72AK5rvY4KHWiq0KqlITn9Psh";
const baseURL = `https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForContract`;
// Replace with the wallet address you want to query:
const ownerAddr = "0x57F6c8aad191e2C2079d02E199f0e916BA3308C3";
const pageSize = 2;
const fetchURL = `${baseURL}?contractAddress=${ownerAddr}&withMetadata=true`;

let info = [];
fetch(fetchURL, requestOptions).then((response) =>
  response
    .json()
    .then((response) => (info = response.nfts))
    .then((responsed) => console.log(responsed)));
let arrayObj = [];
await console.log("pepep2" + info);

for (let i = 0; i < info.lenght; i++) {
  let object = new Object();
  object.tokenId = info[0].tokenId;
  object.tokenUri = info[0].tokenUri;
  object.Name = info[0].name;
  arrayObj.push(object);
  console.log("pepep2" + arrayObj);
}

async function carga(response) {
  let arrayObj = [];
  console.log("pepep3" + info);

  for (let i = 0; i < info.lenght; i++) {
    let object = new Object();
    object.tokenId = response[0].tokenId;
    object.tokenUri = response[0].tokenUri;
    object.Name = response[0].name;
    arrayObj.push(object);
    console.log("pepep2" + arrayObj);
  }
}
export async function fetchNFTs(wallet){
    let nfts= fetch(fetchURL, requestOptions).then((response) =>response.json().then((response)=> response.nfts))
    return nfts;
}
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
