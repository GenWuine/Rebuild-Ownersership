/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { fetchAllModels } from "@/utils";
import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";

const FetchModels = () => {
    const [data, setData] = useState<any>([]);
    const [sender, setSender] = useState<any>("");

    useEffect(() => {
        fetchAllModelsData();
    }, []);

    async function fetchAllModelsData() {
        const results = await fetchAllModels();
        setData(results);
        // console.log("length", results.length)
    }

    const createChatroom = async () => {
        window.location.href;
    };

    function LinkoCard({
        name,
        tba,
        image,
        prompt,
    }: {
        name: any;
        tba: any;
        image: any;
        prompt: any;
    }) {
        return (
            <div className="flex justify-center mt-10 w-[100%]">
                <div className="flex w-[70%] gap-5 p-6 cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <img src={image} width="300px" />
                    <div className="flex flex-col justify-between">
                        <div className="w-[80%]">
                            <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {name}
                            </p>
                            <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                Prompt: {prompt}
                            </p>
                        </div>
                        <button className=" text-center h-[50px] w-[140px] inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
                    {/* <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                    Model Gen Address: {modelGenAddress}
                </p> */}
                    <div className="mt-10">
                        <h1 className="font-bold text-3xl text-center">
                            Create Post
                        </h1>
                    </div>
                    {data.map((item: any, i: any) => (
                        <LinkoCard
                            key={i}
                            name={item.name}
                            tba={item.tba}
                            image={item.modelImg}
                            prompt={item.prompt}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FetchModels;
