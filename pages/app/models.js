import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { nftContractAddress, nftContractAbi } from "../../config.js";
import { saveAs } from "file-saver";
import web3modal from "web3modal";
import { Navbar } from "@/components/navbar.jsx";
import { Sidebar } from "@/components/sidebar.jsx";
export default function Decrypt() {
    const [fileURL, setFileURL] = useState(null);
    const [linkos, setLinkos] = useState([
        {
            modelName: "BlackBottle",
            prompt: "A cylindrical shaped bottle with black color",
        },
        { modelName: "CartoonBox", prompt: "a toybox full of cartoon toys" },
    ]);

    async function Download(_fileName, _fileUrl) {
        const name = _fileName;
        const fileUrl = _fileUrl;
        saveAs(fileUrl, name);
    }

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
                    {linkos.map((item, i) => (
                        <LinkoCard
                            key={i}
                            modelName={item.modelName}
                            prompt={item.prompt}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    function LinkoCard(prop) {
        return (
            <div className="mt-10 relative">
                <div className="block w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <div className="flex justify-between">
                        <div>
                            <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Model: {prop.modelName}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                            prompt: {prop.prompt}
                        </p>
                        <button
                            onClick={() => {
                                Download(prop);
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Download Model
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
