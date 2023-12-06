"use client";
import web3modal from "web3modal";
import { ethers } from "ethers";
import { registryAddress, registryAbi, modelGenAbi } from "./config";
import axios from "axios";
import { Web3Storage } from "web3.storage";
import { init, fetchQuery } from "@airstack/node";
import Moralis from "moralis";

let allModels = [];

Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImRjOWNmODBkLTQwMzctNGNiNS04ZjQ4LTRhYTdjNGE0YmZhZiIsIm9yZ0lkIjoiMjQ4MTk0IiwidXNlcklkIjoiMjUxMzY2IiwidHlwZUlkIjoiMWJjNTA3Y2MtYTMxZC00MTliLWI0OGEtZTVkOGUzYmMwODFiIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODQxODc2OTcsImV4cCI6NDgzOTk0NzY5N30.nh4cnHbpY8g9HhG-gZ3wNtsxaQAbLrv2QkMKUUz27rU",
});

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

export async function getModelGenContract(providerOrSigner, address) {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(address, modelGenAbi, provider);
    if (providerOrSigner == true) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, modelGenAbi, signer);
        return contract;
    }
    return contract;
}

export async function getModelGenAddress() {
    const contract = await getRegistryContract();
    const data = await contract.modelGen();
    console.log("Fetched");
    return data;
}

export async function getModelImage(tokenId) {
    const modelGenAddress = await getModelGenAddress();
    const contract = await getModelGenContract(false, modelGenAddress);
    const data = await contract.tokenURI(tokenId);
    console.log("Fetched");
    return data;
}

export async function getPosterAdsByModelId(modelId) {
    const address = await getTBAFromModelId(modelId);
    const data = await fetch(address);
    console.log(data);
    return data
}

export async function getTBAFromModelId(modelId) {
    const contract = await getRegistryContract();
    const data = await contract.idToModelAcc(modelId);
    console.log(data[0]);
    return data[0];
}

async function fetch(user) {
    const options = {
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/${user}/nft`,
        params: { chain: "mumbai", format: "hex", normalizeMetadata: "false" },
        headers: {
            accept: "application/json",
            "X-API-Key":
                "ECu9sgtiXTgwMKEoJCg0xkjXfwm2R3NhOAATMBiTNIQoIzd7cAmeBibctzQyLkvY",
        },
    };

    const data = await axios.request(options)
    const res = await data.data.result
    console.log("res", res)
    return res
}

// export async function getPosterAds(modelId) {

//     init("YOUR_AIRSTACK_API_KEY");

//     const query = `YOUR_QUERY`; // Replace with GraphQL Query

//     const { data, error } = await fetchQuery(query);

//     console.log("data:", data);
//     console.log("error:", error);
// }

export async function createModelGen() {
    const contract = await getRegistryContract(true);
    const tx = await contract.createModel();
    await tx.wait();
    console.log("Created successfully");
}

export async function createPosterAd(modelId) {
    const contract = await getRegistryContract(true);
    const tx = await contract.callImageAdGen(modelId);
    await tx.wait();
    console.log("Created successfully");
}

export async function fetchAllModels() {
    const contract = await getRegistryContract();

    const data = await contract.fetchAllModel();
    // console.log("data", data)
    const items = await Promise.all(
        data.map(async (i) => {
            // const tokenUri = await contract.uri(i.ticketId.toString());
            // console.log(tokenUri);
            // const meta = await axios.get(tokenUri);
            const modelImg = await getModelImage(i.modelId.toNumber());
            let price = ethers.utils.formatEther(i.price);
            let item = {
                // name: meta.data.name,
                // venue: meta.data.venue,
                // date: meta.data.date,
                // description: meta.data.description,
                // cover: meta.data.cover,
                // NftURI: tokenUri,
                tba: i.tba.toString(),
                imgAdGen: i.imgAdGen.toString(),
                modelId: i.modelId.toNumber(),
                modelNFT: i.modelNFT.toString(),
                creator: i.creator.toString(),
                price,
                sale: i.sale,
                modelImg,
            };
            return item;
        })
    );
    allModels = items;
    console.log("All Models", items);
    return items;
}
