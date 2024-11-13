"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import GanttPage from "@/common/gantt/ganttPage";
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import useAppStore from '@/store/appStore';
import axios from "axios";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next-nprogress-bar';


export default function Page() {
    const router = useRouter();
    const { projectName, slug, key } = useSlug();
    const [loading, setLoading] = useState(true);
    const baseURL = '/api/';
    const { updateIsWorkitemDrawer, updateBacklogSteps } = useAppStore();

    useEffect(() => {
        getSteps();
    }, [])

    const getSteps = async () => {
        let posturl = baseURL + `steps?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                updateBacklogSteps(res.data);
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


    return (
        <Layout>
            {!loading && (
                <div>
                    <Breadcrumb page="Timeline" project={projectName} section="Planning" />
                    <div className="max-w-[80vw] mt-10">
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
                        <div className="flex justify-end">
                            <button
                                className="pulsebuttonblue px-3 py-1 mr-1"
                                onClick={() => updateIsWorkitemDrawer(true)}
                            >
                                <AddCircleOutlineIcon className="w-5 h-5" />
                                <span>Add Work Item</span>
                            </button>
                        </div>
                        <GanttPage from="Timeline" />
                    </div>
                </div>
            )}
        </Layout >
    );
}
