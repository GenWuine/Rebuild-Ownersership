import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { nftContractAddress, nftContractAbi } from "../../config.js";
import { saveAs } from "file-saver";
import web3modal from "web3modal";
import { Navbar } from "@/components/navbar.jsx";
import { Sidebar } from "@/components/sidebar.jsx";
import { getTBAFromModelId, getPosterAdsByModelId } from "@/utils.js";
export default function Decrypt() {
    const [linkos, setLinkos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formInput, setFormInput] = useState({
        modelId: "",
    });

    // useEffect(() => {
    //     fetchPosterAdsData();
    // }, []);

    async function fetchPosterAdsData() {
        setLoading(true);
        const data = await getPosterAdsByModelId(formInput.modelId);
        setLinkos(data);
        console.log("linkos", linkos)
        setLoading(false);
    }

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
                    <div className="flex mt-4">
                        <div className="w-[12%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                            <p>ModelId</p>
                        </div>
                        <div className="relative w-full">
                            <input
                                type="search"
                                className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                placeholder="Enter your model's id"
                                required=""
                                value={formInput.modelId}
                                onChange={(e) => {
                                    setFormInput({
                                        ...formInput,
                                        modelId: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <button
                            className="flex ml-3 w-[14%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={fetchPosterAdsData}
                        >
                            Fetch
                        </button>
                    </div>
                    {linkos.map((item, i) => (
                        <LinkoCard
                            key={i}
                            token_address={item.token_address}
                            token_uri={item.token_uri}
                            // cid={item.cid}
                            // price={item.price}
                            // usdPrice={item.usdPrice}
                            // host={item.host}
                            // linkoId={item.linkoId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    function LinkoCard(prop) {
        return (
            <div className="mt-10 relative">
                <div className="flex gap-5 block w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <img src={prop.token_uri} width="100px"/>
                    {/* <p>Model Id: {prop.modelId}</p> */}
                    <div className="flex justify-between">
                        <div>
                            <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Asset Address: {prop.token_address}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        {/* <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                            Poster AdGen: {prop.imgAdGen}
                        </p> */}
                        <button
                            onClick={() => {
                                Download(prop);
                            }}
                            className="h-[50px] w-[140px] inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Download Model
                        </button>
                        
                    </div>
                </div>
            </div>
        );
    }

    // function LinkoCard(prop) {
    //     return (
    //         <div className="mt-10 relative">
    //             <div className="block w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    //                 <div className="flex justify-between">
    //                     <div>
    //                         <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    //                             CID: {prop.cid}
    //                         </p>
    //                     </div>
    //                 </div>

    //                 <div className="flex justify-between">
    //                     <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
    //                         price: {prop.price}FIL | USD Price : $
    //                         {prop.usdPrice}
    //                     </p>
    //                     <button
    //                         onClick={() => {
    //                             buyAccess(prop);
    //                         }}
    //                         className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //                     >
    //                         Buy
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }
}
