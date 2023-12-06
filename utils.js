"use client";
import web3modal from "web3modal";
import { ethers } from "ethers";
import {
    registryAddress,
    registryAbi,
} from "./config";
import axios from "axios";
import { Web3Storage } from "web3.storage";

let allModels = [];

export async function getRegistryContract(providerOrSigner) {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(registryAddress, registryAbi, provider);
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

export async function createModel() {
    const contract = await getRegistryContract(true);
    const id = await contract.createModel();
    const contractAddress = await contract.contracts(id);
    return contractAddress;
}

export async function fetchAllModels() {
    const contract = await getRegistryContract(true);

    const data = await contract.fetchAllEvents();
    // console.log("data", data)
    const items = await Promise.all(
        data.map(async (i) => {
            // const tokenUri = await contract.uri(i.ticketId.toString());
            // console.log(tokenUri);
            // const meta = await axios.get(tokenUri);
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
            };
            return item;
        })
    );
    allModels = items;
    console.log("All Models", items);
    return items;
}