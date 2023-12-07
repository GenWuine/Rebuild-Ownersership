import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { nftContractAddress, nftContractAbi } from "../../config.js";
import { saveAs } from "file-saver";
import web3modal from "web3modal";
import { Navbar } from "@/components/navbar.jsx";
import { Sidebar } from "@/components/sidebar.jsx";
import {
    fetchMyModels,
    getModelGenAddress,
    getModelImage,
    listForSale,
} from "@/utils.js";

export default function Models() {
    const [linkos, setLinkos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modelGenAddress, setModelGenAddress] = useState();
    const [formInput, setFormInput] = useState({
        price: "",
    });

    useEffect(() => {
        fetchAllModelsData();
        fetchModelGenAddressData();
    }, []);

    async function fetchAllModelsData() {
        setLoading(true);
        const data = await fetchMyModels();
        setLinkos(data);
        setLoading(false);
    }

    async function fetchModelGenAddressData() {
        setLoading(true);
        const data = await getModelGenAddress();
        setModelGenAddress(data);
        setLoading(false);
    }

    async function download(prop) {
        const data = await getModelImage(prop.modelId);
        console.log(data);
        saveAs(data, prop.modelId);
    }

    async function listForSaleCall(prop) {
        await listForSale(prop.modelId, formInput.price);
    }

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
                    <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                        Model Gen Address: {modelGenAddress}
                    </p>
                    {linkos.map((item, i) => (
                        <LinkoCard
                            key={i}
                            tba={item.tba}
                            imgAdGen={item.imgAdGen}
                            modelId={item.modelId}
                            modelImg={item.modelImg}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    function LinkoCard(prop) {
        return (
            <div className="mt-10 relative">
                <div className="flex gap-4 block w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <img src={prop.modelImg} width="100px" />
                    <div>
                        <p>Model Id: {prop.modelId}</p>
                        <div className="flex justify-between">
                            <div>
                                <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    TBA Address: {prop.tba}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                Poster AdGen: {prop.imgAdGen}
                            </p>
                            <button
                                onClick={() => {
                                    download(prop);
                                }}
                                className="ml-[3rem] inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Download Model
                            </button>
                        </div>
                        <div className="flex justify-between mt-3">
                            <div className="flex gap-3">
                                <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                    Price:{" "}
                                </p>
                                <input
                                    className="block px-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                    placeholder="1 Matic"
                                    value={formInput.price}
                                    onChange={(e) => {
                                        setFormInput({
                                            ...formInput,
                                            price: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    listForSaleCall(prop);
                                }}
                                className="ml-[3rem] inline-flex items-center px-7 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                List for Sale
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
