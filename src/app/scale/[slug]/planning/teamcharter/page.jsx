"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";
import useAppStore from '@/store/appStore';
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import DisplayForm from "./displayForm";
import EditIcon from '@mui/icons-material/Edit';
import { useSession } from "next-auth/react";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next-nprogress-bar';


export default function Page() {
    const router = useRouter();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uiloading, seUiLoading] = useState(true);
    const { updateFormData } = useAppStore();
    const { teamcharterList, updateTeamcharterMaster } = useAppStore();
    const { updateIsTeamcharterDrawer } = useAppStore();
    const baseURL = '/api/';
    const { projectName, slug, key } = useSlug();
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;


    useEffect(() => {
        updateFormData(null);
        getData();
        updateIsTeamcharterDrawer(false);
        getiForm();
    }, []);

    useEffect(() => {
        setRows(teamcharterList);
    }, [teamcharterList]);

    useEffect(() => {
        seUiLoading(false);
    }, [uiloading]);

    const getiForm = async () => {
        let posturl = baseURL + "teamchartermaster";

        try {
            const response = await axios.get(posturl);
            updateTeamcharterMaster(response?.data[0]?.teamcharters);
            setLoading(false);
        } catch (error) {
            console.error("Error", error);
        }
    };

    const getData = async () => {
        let posturl = baseURL + `teamcharter?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res.data[0]);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const handleOpenForm = () => {
        updateIsTeamcharterDrawer(rows?._id);
    };


    return (
        <Layout>
            {!uiloading && (
                <>
                    <Breadcrumb page="Teamcharter" project={projectName} section="Planning" />
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
                        <div className="flex justify-end -mb-6">
                            <button
                                className="pulsebuttonblue px-3 py-1 mr-1"
                                onClick={() => handleOpenForm()}
                            >
                                <EditIcon className="w-5 h-5" />
                                <span>Update Team Charter</span>
                            </button>
                        </div>
                    </div>
                    <div>
                        {!loading ? (
                            <div>
                                {rows !== undefined && (
                                    <>
                                        <DisplayForm rows={rows} dateFormat={dateFormat} />
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="mt-10">
                                <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
}