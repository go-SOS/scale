"use client";
import { useEffect, useState } from "react";
import Layout from "@/app/scale/layout/layout";
import { useRouter } from 'next-nprogress-bar';
import axios from "axios";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import useAppStore from '@/store/appStore';
import FolderIcon from '@mui/icons-material/Folder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ProfileDrawer from "./components/profileDrawer";
import Breadcrumb from '@/app/scale/admin-settings/components/breadcrumb';
import CloseIcon from '@mui/icons-material/Close';


export default function ProfilePage() {
    const router = useRouter();
    const baseURL = '/api/';
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isProfileDrawer, updateIsProfileDrawer, rootuser, sessionData, updateIsTimeFormatMessage, isTimeFormatMessage } = useAppStore();

    useEffect(() => {
        if (isTimeFormatMessage) {
            setTimeout(() => {
                updateIsTimeFormatMessage(false);
            }, 16000);
        }
    }, [isTimeFormatMessage]);

    useEffect(() => {
        updateIsTimeFormatMessage(false);
        getUser();
    }, []);

    useEffect(() => {
        if (rootuser) {
            setUser(rootuser);
        }
    }, [rootuser]);

    const getUser = async () => {
        // console.log('session data ', sessionData.data);
        const id = sessionData.data._id;
        let posturl = baseURL + `users?id=${id}`;

        try {
            const response = await axios.get(posturl);
            setUser(response.data[0]);
            // console.log('Response', response.data[0]);
            setLoading(false);
        } catch (error) {
            console.error("Error", error);
        }
    };

    return (
        <Layout>
            <div>
                {isTimeFormatMessage && (
                    <div className="flex items-center justify-center">
                        <div className="px-4 fixed flex top-20 bg-green-200 shadow-md rounded-lg p-2">
                            <div className="flex">
                                <div className="mr-7">
                                    Your time format has been successfully updated. Please log out and log back in to apply the changes
                                </div>
                                <div className="absolute top-1 right-0 mt-1 mr-2 cursor-pointer" onClick={() => updateIsTimeFormatMessage(false)}>
                                    <CloseIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <Breadcrumb page="Profile" />
                {isProfileDrawer && (
                    <ProfileDrawer user={user} />
                )}
                {!loading ? (
                    <>
                        <div>
                            <div className="flex justify-between">
                                <div className="mt-5 mb-4 flex">
                                    <FolderIcon className="text-yellow-300 mr-2" />
                                    <h2 className="font-semibold text-lg">Profile Information</h2>
                                </div>
                                <div className="flex">
                                    <button
                                        className={`px-3 py-1 mr-1 max-h-8 min-w-[200px] mt-4 pulsebuttonblue`}
                                        onClick={() => updateIsProfileDrawer(true)}
                                    >
                                        <AddCircleOutlineIcon className="w-5 h-5" />
                                        <span>Edit Profile</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="bg-white rounded-md min-h-3 mb-4 shadow-md p-2">
                                    <div className="p-2">
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Organization</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.organization || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Name</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.fullName || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Role</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.role || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Email</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.email || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Phone</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.phone || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Role</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.userRole || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Domain Expertise</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.domainExpertise || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Company Size</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.companySize || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Date Format</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.dateFormat || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="flex">
                                                    <p className="text-right min-w-[200px] text-[16px]">Time Zone</p>
                                                    <p className="ml-14 scaleformlabel">{`${user?.timeZone || 'N/A'}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Stack spacing={1} className="mt-10">
                        <Skeleton variant="rounded" width="100%" height={60} />
                        <Skeleton variant="rounded" width="100%" height={30} />
                        <Skeleton variant="rounded" width="100%" height={30} />
                        <Skeleton variant="rounded" width="100%" height={30} />
                        <Skeleton variant="rounded" width="100%" height={30} />
                        <Skeleton variant="rounded" width="100%" height={30} />
                    </Stack>
                )}
            </div>
        </Layout>
    );
}
