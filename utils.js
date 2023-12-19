"use client";
import web3modal from "web3modal";
import { ethers } from "ethers";
import { registryAddress, registryAbi, modelGenAbi, UriABI } from "./config";
import axios from "axios";
import { Web3Storage } from "web3.storage";
import Moralis from "moralis";
import {
    DataverseConnector,
    SYSTEM_CALL,
    RESOURCE,
} from "@dataverse/dataverse-connector";

let allModels = [];

// fetchAllModels();

// Moralis.start({
//     apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImRjOWNmODBkLTQwMzctNGNiNS04ZjQ4LTRhYTdjNGE0YmZhZiIsIm9yZ0lkIjoiMjQ4MTk0IiwidXNlcklkIjoiMjUxMzY2IiwidHlwZUlkIjoiMWJjNTA3Y2MtYTMxZC00MTliLWI0OGEtZTVkOGUzYmMwODFiIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODQxODc2OTcsImV4cCI6NDgzOTk0NzY5N30.nh4cnHbpY8g9HhG-gZ3wNtsxaQAbLrv2QkMKUUz27rU",
// });

// --------- Contract Instance

export async function getRegistryContract(providerOrSigner) {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(
        registryAddress,
        registryAbi,
        provider
    );
    if (providerOrSigner == true) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            registryAddress,
            registryAbi,
            signer
        );
        return contract;
    }
    return contract;
}

// export async function getModelGenContract(providerOrSigner, address) {
//     const modal = new web3modal();
//     const connection = await modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const contract = new ethers.Contract(address, modelGenAbi, provider);
//     if (providerOrSigner == true) {
//         const signer = provider.getSigner();
//         const contract = new ethers.Contract(address, modelGenAbi, signer);
//         return contract;
//     }
//     return contract;
// }

// export async function getNftURIContract(_contractAddress) {
//     const modal = new web3modal();
//     const connection = await modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();
//     const nftContract = new ethers.Contract(_contractAddress, UriABI, signer);
//     return nftContract;
// }

export async function getUserAddress() {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    return accounts[0];
}

// export async function getModelGenAddress() {
//     const contract = await getRegistryContract();
//     const data = await contract.modelGen();
//     console.log("Fetched");
//     return data;
// }

// --------- APIs

export async function callCharacterGenAPI(_prompt) {
    const apiUrl = "https://modelgen.pythonanywhere.com/generate-model-img/";
    try {
        const payload = {
            description: _prompt,
        };

        console.log("payload", payload);

        const response = await axios.post(apiUrl, payload);
        console.log(response.data.s3_public_url);
        return response.data.s3_public_url;
    } catch (error) {
        console.error("Error fetching cat data:", error.message);
        return null;
    }
}

export async function callImageGenAPI(
    _prompt,
    _productImage,
    tba,
    _name
) {
    const _modelImage = await getModelImageFromTBA(tba);

    console.log("model image resolver", _modelImage);

    const apiUrl = "https://adgen.pythonanywhere.com/generate-ad-poster/";
    try {
        const payload = {
            name: _name,
            description: _prompt,
            url1: _modelImage,
            url2: _productImage,
        };

        console.log("payload", payload);

        const response = await axios.post(apiUrl, payload);
        console.log(response);
        return response.data.s3_public_url;
    } catch (error) {
        console.error("Error fetching cat data:", error.message);
        return null;
    }
}

export async function callVideoGenAPI(
    _productName,
    _prompt,
    tba,
    _gender
) {
    const _modelImage = await getModelImageFromTBA(tba);

    const apiUrl = "http://127.0.0.1:5000/generate-vid/";
    try {
        const payload = {
            product_name: _productName,
            product_description: _prompt,
            model_img: _modelImage,
            model_gender: _gender,
        };

        console.log("payload", payload);

        const response = await axios.post(apiUrl, payload);
        console.log(response);
        return response.data.result;
    } catch (error) {
        console.error("Error fetching: ", error.message);
        return null;
    }
}

export async function callFineTuneAPI(_generatedImage, _prompt) {
    const apiUrl = "http://127.0.0.1:5000/generate-imgtoimg/";
    try {
        const payload = {
            image_url: _generatedImage,
            user_prompt: _prompt,
        };

        console.log("payload", payload);

        const res1 = await axios.post(apiUrl, payload);
        console.log("res1", res1);
        return res1;
    } catch (error) {
        console.error("Error fetching cat data:", error.message);
        return null;
    }
}

// --------- IPFS

async function createModelURI(_name, _prompt, image) {
    // if (!_name || !_prompt || !image) return;
    console.log("img:", image);
    const data = JSON.stringify({ _name, _prompt, image });
    const files = [new File([data], "data.json")];
    const metaCID = await uploadToIPFS(files);
    const url = `https://ipfs.io/ipfs/${metaCID}/data.json`;
    console.log(url);
    return url;
}

async function createContentURI(_productImage, _prompt, image, tba) {
    // if (!_productImage || !_prompt || !image) return;
    const _modelId = await getModelIdByTBA(tba);
    const data = JSON.stringify({ _productImage, _prompt, image, _modelId });
    const files = [new File([data], "data.json")];
    const metaCID = await uploadToIPFS(files);
    const url = `https://ipfs.io/ipfs/${metaCID}/data.json`;
    console.log(url);
    return url;
}

// --------- Dataverse

const dataverseConnector = new DataverseConnector();

export async function loginDataverse() {
    await dataverseConnector.connectWallet();
    const pkh = await dataverseConnector.runOS({
        method: SYSTEM_CALL.createCapability,
        params: {
            appId: "4e6d651a-77ea-441d-9198-a3edf968e9f4",
            resource: RESOURCE.CERAMIC,
        },
    });
    console.log("pkh:", pkh);
    return pkh;
}

export async function uploadToDataverse(inputText) {
    await loginDataverse()

    const encrypted = JSON.stringify({
        text: false,
        images: false,
        videos: false,
    });

    await dataverseConnector.connectWallet();
    const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.createIndexFile,
        params: {
            modelId:
                "kjzl6hvfrbw6c8eukmrwgbdmhdy2h7vw4l0ypd2yfkli7xfo1qt6ogp3srr376v",
            fileName: "test",
            fileContent: {
                modelVersion: "0",
                text: inputText,
                images: [],
                videos: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                encrypted,
            },
        },
    });

    console.log(res)
    console.log(res.fileContent.file.contentId)

    return res.fileContent.file.contentId;
}

export const loadWithDataverse = async (streamId) => {
    await loginDataverse()

    const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.loadFile,
        params: streamId,
    });

    return res.fileContent.content.text;
};

// --------- Contract Calls

export async function createCharacterCall(_uri, _characterName) {
    const contract = await getRegistryContract(true);
    const tx = await contract.createCharacter(_uri, _characterName);
    await tx.wait();
    console.log("Character created")
}

export async function createGenerationCall(_characterId, _streamId) {
    const contract = await getRegistryContract(true);
    const tx = await contract.createGeneration(_characterId, _streamId);
    await tx.wait();
    console.log("Character created")
}

export async function publishGenerationCall(_characterId, _generationId) {
    const contract = await getRegistryContract(true);
    const tx = await contract.publishPost(_characterId, _generationId);
    await tx.wait();
    console.log("Character created")
}

// export async function pushStreamIdCall(_streamId) {
//     const contract = await getRegistryContract(true);
//     const tx = await contract.pushStreamId(_streamId);
//     await tx.wait();
// }


// export async function createModelGenAccountCreation(_name, _prompt, image) {
//     const uri = await createModelURI(_name, _prompt, image);
//     const contract = await getRegistryContract(true);
//     const tx = await contract.createModel(uri);
//     await tx.wait();
//     await fetchAllModels();
//     console.log("Account Created successfully");
// }

// export async function createStaticContentGeneration(
//     _prompt,
//     _productImage,
//     image,
//     tba
// ) {
//     const _modelId = await getModelIdByTBA(tba);
//     const uri = await createContentURI(_productImage, _prompt, image, tba);
//     console.log(_modelId, uri);

//     const contract = await getRegistryContract(true);
//     // const tx = await contract.callImageAdGen(_modelId, uri);
//     const tx = await contract.callContentGen(_modelId, uri);
//     await tx.wait();
//     console.log("Content Created successfully");
// }

// export async function listForSale(modelId, _price) {
//     const nftContract = await getNftURIContract();
//     const approve = await nftContract.approve(registryAddress, modelId);
//     console.log("_price", _price);
//     const price = ethers.utils.parseEther(_price);
//     const contract = await getRegistryContract(true);
//     const tx = await contract.listModelForSale(modelId, price);
//     await approve.wait();
//     await tx.wait();
//     console.log("Listed successfully");
// }

// export async function buyModel(modelId, _price) {
//     const weiPrice = ethers.utils.parseUnits(_price.toString(), "ether");
//     const contract = await getRegistryContract(true);
//     const tx = await contract.buyModel(modelId, {
//         value: weiPrice,
//         gasLimit: 1000000,
//     });
//     await tx.wait();
//     console.log("Listed successfully");
// }

// --------- Contract Fetching

export async function fetchAllCharacters() {
    // if (allModels.length > 0) return allModels;

    const user = await getUserAddress()

    const contract = await getRegistryContract();

    const data = await contract.fetchAllCharacters(user);
    console.log("data", data)
    const items = await Promise.all(
        data.map(async (i) => {
            // const metadata = await axios.get(data.uri);
            // let price = ethers.utils.formatEther(i.price);
            let item = {
                characterId: i.characterId.toNumber(),
                characterName: i.characterName.toString(),
                uri: i.uri.toString(),
                isSale: i.isSale.toString(),
                _price: i._price.toNumber(),
                // name: metadata.data._name,
                // prompt: metadata.data._prompt,
                // modelImg: metadata.data.image,
                // price,
                // sale: i.sale,
                // metadata,
            };
            return item;
        })
    );

    // console.log("3");

    allModels = items;
    console.log("All Characters", items);
    return items;
}


// export async function getTokensURI(address, id) {
//     const contract = await getNftURIContract(address);
//     const uri = await contract.tokenURI(id);
//     // console.log("uri", uri)
//     return uri;
// }

// async function fetch(user) {
//     const options = {
//         method: "GET",
//         url: `https://deep-index.moralis.io/api/v2/${user}/nft`,
//         params: { chain: "mumbai", format: "hex", normalizeMetadata: "false" },
//         headers: {
//             accept: "application/json",
//             "X-API-Key":
//                 "ECu9sgtiXTgwMKEoJCg0xkjXfwm2R3NhOAATMBiTNIQoIzd7cAmeBibctzQyLkvY",
//         },
//     };

//     const data = await axios.request(options);
//     const res = await data.data.result;
//     console.log("res", res);
//     return res;
// }



// export async function getModelImageFromTBA(tba) {
//     let result;
//     allModels.filter((e) => {
//         if (e.tba == tba) {
//             console.log("modelId inside using e.modelid", e.modelId);
//             result = e.modelImg;
//             console.log("result inside the if block", result);
//         }
//         console.log("modelId out of e block", result);
//     });
//     console.log("result outside e fn", result);
//     return result;
// }

// export async function getModelIdByTBA(tba) {
//     let result;
//     allModels.filter((e) => {
//         if (e.tba == tba) {
//             console.log("modelId inside using e.modelid", e.modelId);
//             result = e.modelId;
//             console.log("result inside the if block", result);
//         }
//         console.log("modelId out of e block", result);
//     });
//     console.log("result outside e fn", result);
//     return result;
// }

// export async function getContentByModelId(modelId) {
//     const address = await getTBAFromModelId(modelId);
//     const data = await fetch(address);
//     console.log(data);
//     return data;
// }

// export async function getContentByTBA(tba) {
//     const data = await fetch(tba);
//     console.log(data);
//     return data;
// }

// export async function getTBAFromModelId(modelId) {
//     const contract = await getRegistryContract();
//     const data = await contract.idToModelAcc(modelId);
//     console.log(data[0]);
//     return data[0];
// }

// export async function fetchAllModels() {
//     if (allModels.length > 0) return allModels;

//     const contract = await getRegistryContract();

//     const modelGenAddress = await getModelGenAddress();
//     const modelGenContract = await getModelGenContract(false, modelGenAddress);

//     const data = await contract.fetchAllModel();
//     // console.log("data", data)
//     const items = await Promise.all(
//         data.map(async (i) => {
//             const metadataUrl = await modelGenContract.tokenURI(
//                 i.modelId.toNumber()
//             );
//             const metadata = await axios.get(metadataUrl);
//             let price = ethers.utils.formatEther(i.price);
//             let item = {
//                 name: metadata.data._name,
//                 prompt: metadata.data._prompt,
//                 modelImg: metadata.data.image,
//                 tba: i.tba.toString(),
//                 imgAdGen: i.imgAdGen.toString(),
//                 modelId: i.modelId.toNumber(),
//                 creator: i.creator.toString(),
//                 owner: i.owner.toString(),
//                 price,
//                 sale: i.sale,
//                 // metadata,
//             };
//             return item;
//         })
//     );

//     console.log("3");

//     allModels = items;
//     console.log("All Models", items);
//     return items;
// }

// export async function fetchMarketplaceModels() {
//     if (allModels.length > 0) {
//         const filteredArray = allModels.filter(
//             (subarray) => subarray.sale == true
//         );
//         return filteredArray;
//     } else {
//         const data = await fetchAllModels();
//         const filteredArray = data.filter((subarray) => subarray.sale == true);
//         return filteredArray;
//     }
// }

// export async function fetchMyModels() {
//     const data = await fetchAllModels();
//     return data;

//     // const me = await getUserAddress();
//     // me.toString().toLowerCase();
//     // const data = await fetchAllModels();
//     // const filteredArray = data.filter((subarray) => {
//     //     subarray.owner.toLowerCase();
//     //     console.log("me", me);
//     //     console.log("val", subarray.owner)
//     //     subarray.owner === me;
//     // });

//     // return filteredArray

//     // if (allModels.length > 0) {
//     //     const filteredArray = allModels.filter((subarray) => {
//     //         subarray.owner.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
//     //         subarray.owner === me.toString();
//     //     });
//     //     return filteredArray;
//     // } else {
//     //     const data = await fetchAllModels();
//     //     const filteredArray = data.filter((subarray) => {
//     //         let val = subarray.owner
//     //         val.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
//     //         console.log("val", val)
//     //         val.toString() === me.toString();
//     //     });
//     //     return filteredArray;
//     // }
// }

// --------- IPFS Instance

function getAccessToken() {
    // return process.env.NEXT_PUBLIC_Web3StorageID
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMjkyQjQ5YzFjN2ExMzhERWQxQzQ3NGNlNmEyNmM1NURFNWQ0REQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzg2MDc1NDEsIm5hbWUiOiJNZXRhRmkifQ.cwyjEIx8vXtTnn8Y3vctroo_rooHV4ww_2xKY-MT0rs";
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
}

export const uploadToIPFS = async (files) => {
    const client = makeStorageClient();
    const cid = await client.put(files);
    return cid;
};

export async function getSigner() {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    return signer;
}
