"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import useAppStore from "@/store/appStore";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import ProjectCard from './ProjectCard';
import axios from "axios";
import Skeleton from '@mui/material/Skeleton';
import useSlug from "@/app/scale/layout/hooks/useSlug";

export default function Page() {
    const baseURL = '/api/';
    const { updateIsProjectDrawer, currentProject } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [isInvited, setIsInvited] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { slug } = useSlug();

    const handleinvited = (newState) => {
        setIsInvited(newState);
    }

    useEffect(() => {
        if (isInvited) {
            setLoading(true);
            getData();
        }
    }, [isInvited]);

    useEffect(() => {
        // console.log('Session data ', session);
        if (!session?.data?.isOnboarded) {
            router.push('/onboard');
        } else {
            getData();
        }
    }, [session]);

    const getData = async () => {
        let posturl = baseURL + `member?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setMembers(res.data);
                setIsInvited(false);
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
            {!loading ? (
                <div>
                    {(currentProject && currentProject !== null && currentProject !== undefined) ? (
                        <div className="mt-16">
                            <ProjectCard
                                project={currentProject}
                                members={members}
                                handleinvited={handleinvited}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center mt-32 text-md">
                            <div className="text-center">
                                <h3 className="mt-3 gradientText">Welcome to Scale </h3>
                                <h3 className="">Let&apos;s get started.</h3>
                                <h3 className="mt-3">Create your first Project.</h3>
                                <button
                                    className="pulsebuttonblue mt-2 px-3 flex items-center justify-center mx-auto"
                                    onClick={() => updateIsProjectDrawer(true)}
                                >
                                    <AddIcon className="w-5 h-5 mr-2" />
                                    <span>Add New Project</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) :
                (
                    <div className="mt-10">
                        <div className="mt-4">
                            <Skeleton className="mt-10" variant="rounded" width="100%" height={180} />
                            <Skeleton className="mt-5" variant="rounded" width="100%" height={180} />
                            <Skeleton className="mt-5" variant="rounded" width="100%" height={180} />
                        </div>
                    </div>
                )}
        </Layout >
    );
}
