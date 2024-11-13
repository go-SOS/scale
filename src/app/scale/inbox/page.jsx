"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next-nprogress-bar';
import WorkItemTable from "./workitemTable";
import TodoTable from "./todoTable";
import RiskTable from "./riskTable";


export default function Page() {
    const router = useRouter();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nodata, setNodata] = useState(true);
    const baseURL = '/api/';

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let posturl = baseURL + `inbox`;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('Inbox ', res?.data);
                setRows(res?.data);
                if (
                    res?.data?.backlog?.length > 0 ||
                    res?.data?.todo?.length > 0 ||
                    res?.data?.risk?.length > 0 ||
                    res?.data?.issue?.length > 0 ||
                    res?.data?.assumption?.length > 0
                ) {
                    setNodata(false);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                if (err?.response?.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    return (
        <Layout>
            <div className="mb-10">
                <div style={{ minWidth: '100%', maxWidth: '100%' }} className="my-3 mb-6">
                    <div className="max-h-[50px] -mt-2">
                        <div className="flex">
                            <div className="mt-1 text-sm font-semibold cursor-pointer" onClick={() => {
                                router.push("/scale/inbox");
                            }}>
                                Inbox
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <div className="hover:bg-blue-100 hover:rounded-md max-w-[50px]">
                        <div
                            className="px-3 py-1 mr-1 text-blue-600 cursor-pointer"
                            onClick={() => {
                                router.back();
                            }}
                        >
                            <KeyboardBackspaceIcon className="w-5 h-5" />
                        </div>
                    </div>
                    {!loading ? (
                        <div>
                            {rows?.backlog?.length > 0 && (
                                <div className="mt-10">
                                    <div className="text-lg font-semibold mb-2 mt-5 ml-2">
                                        Assigned Work Items
                                    </div>
                                    <WorkItemTable data={rows?.backlog} />
                                </div>
                            )}
                            {rows?.todo?.length > 0 && (
                                <div className="mt-10">
                                    <div className="text-lg font-semibold mb-2 mt-5 ml-2">
                                        Assigned Project To-Do
                                    </div>
                                    <TodoTable data={rows?.todo} />
                                </div>
                            )}
                            {rows?.risk?.length > 0 && (
                                <div className="mt-10">
                                    <div className="text-lg font-semibold mb-2 mt-5 ml-2">
                                        Assigned Risk Log
                                    </div>
                                    <RiskTable data={rows?.risk} from="risk" />
                                </div>
                            )}
                            {rows?.issue?.length > 0 && (
                                <div className="mt-10">
                                    <div className="text-lg font-semibold mb-2 mt-5 ml-2">
                                        Assigned Issue Log
                                    </div>
                                    <RiskTable data={rows?.issue} from="issue" />
                                </div>
                            )}
                            {rows?.assumption?.length > 0 && (
                                <div className="mt-10">
                                    <div className="text-lg font-semibold mb-2 mt-5 ml-2">
                                        Assigned Assumption Log
                                    </div>
                                    <RiskTable data={rows?.assumption} from="assumption" />
                                </div>
                            )}
                            {nodata && (
                                <div className="mt-10">
                                    <div>
                                        <div className="border-2 border-dashed border-gray-500 p-4 min-w-[76vw] rounded-lg mt-16">
                                            <div className="flex justify-center p-4 min-h-[22vh]">
                                                <div className="text-md text-left mt-4 ml-10">
                                                    <h2 className="text-md font-semibold mb-1">Inbox Overview</h2>
                                                    <p className="text-gray-700">
                                                        Here you can find assigned work items, risks, to-dos, assumptions, and issues
                                                        <br />
                                                        for efficient project management.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
                            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}