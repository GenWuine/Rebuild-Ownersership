import React, { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import LinkCard from "@/components/linkCard";
import { useState } from "react";

export default function Dashboard() {
    const [inputLink, setInputLink] = useState("");
    const [linkData, setLinkData] = useState([]);
    // const [location, setLocation] = useState();
    const [open, setOpen] = useState();

    useEffect(() => {
        getData();
    }, []);

    //  console.log(linkData)

    async function getData() {
        try {
            const { results } = await db
                .prepare(`SELECT * FROM ${tableName};`)
                .all();
            setLinkData(results);
        } catch (e) {
            console.log(e);
        }
    }

    console.log(open);

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
                    {/* <button>Manage</button>
                    <input type="file" onChange={uploadWithSpheron} />
                    <input
                        type="name"
                        onChange={(e) => setInputLink(e.target.value)}
                    /> */}
                    <h2 className="text-center text-4xl font-bold mt-4">
                        Your Linkos
                    </h2>

                    {linkData.map((item, index) => {
                        return (
                            <LinkCard
                                getData={getData}
                                onClick={() => setOpen(index)}
                                open={index === open}
                                redirectTo={item.link}
                                key={item.id}
                                id={item.id}
                                link={location?.origin + "/" + item.id}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
