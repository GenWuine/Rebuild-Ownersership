import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { nftContractAddress, nftContractAbi } from "../../config.js";
import { saveAs } from "file-saver";
import web3modal from "web3modal";
import { Navbar } from "@/components/navbar.jsx";
import { Sidebar } from "@/components/sidebar.jsx";
import { fetchAllModels, getModelGenAddress, getModelImage } from "@/utils.js";

export default function Models() {
    const [linkos, setLinkos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modelGenAddress, setModelGenAddress] = useState();
    // const [linkos, setLinkos] = useState([
    //     {
    //         modelName: "BlackBottle",
    //         prompt: "A cylindrical shaped bottle with black color",
    //     },
    //     { modelName: "CartoonBox", prompt: "a toybox full of cartoon toys" },
    // ]);

    useEffect(() => {
        fetchAllModelsData();
        fetchModelGenAddressData();
    }, []);

    async function fetchAllModelsData() {
        setLoading(true);
        const data = await fetchAllModels();
        setLinkos(data);
        setLoading(false);
    }

    async function fetchModelGenAddressData() {
        setLoading(true);
        const data = await getModelGenAddress();
        setModelGenAddress(data);
        setLoading(false);
    }

    async function Download(_fileName, _fileUrl) {
        const name = _fileName;
        const fileUrl = _fileUrl;
    }

    async function Download(prop) {
        const data = await getModelImage(prop.modelId);
        console.log(data);
        saveAs(data, prop.modelId);
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
                                    Download(prop);
                                }}
                                className="ml-[3rem] inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Download Model
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
