"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import { Card, CardContent } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next-nprogress-bar';
import useAppStore from "@/store/appStore";
import { useSession } from "next-auth/react";
import Breadcrumb from '@/app/scale/admin-settings/components/breadcrumb';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import GroupsIcon from '@mui/icons-material/Groups';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import ImportCSVDrawer from '@/common/import/importCSVDrawer';


export default function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { updateCsvImportFormOpen, updateImportFrom } = useAppStore();
    const { data: session } = useSession();
    const [localSessiondata, setLocalSessiondata] = useState("");

    useEffect(() => {
        setLocalSessiondata(session);
        setLoading(false);
    }, [session])

    return (
        <Layout>
            {!loading && (
                <>
                    <ImportCSVDrawer />
                    <Breadcrumb page="Import" />
                    {localSessiondata?.data?.role === "Administrator" && (
                        <div className="mt-16">
                            <Card style={{ minWidth: '100%', maxWidth: '100%', minHeight: '130px' }} className="mt-3">
                                <CardContent>
                                    <div>
                                        Import
                                        <Divider className="mt-2" />
                                    </div>
                                    <div className="flex">
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Work Items');
                                                        updateCsvImportFormOpen(true);
                                                    }}
                                                >
                                                    <WebStoriesIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Work Items
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="flex">
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Teams');
                                                        updateCsvImportFormOpen(true);;
                                                    }}
                                                >
                                                    <GroupsIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Teams
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Stakeholder');
                                                        updateCsvImportFormOpen(true);
                                                    }}
                                                >
                                                    <DataThresholdingIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Stakeholder
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Timesheet');
                                                        updateCsvImportFormOpen(true);
                                                    }}
                                                >
                                                    <PunchClockIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Timesheet
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Holiday');
                                                        updateCsvImportFormOpen(true);
                                                    }}
                                                >
                                                    <BeachAccessIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Holiday
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="flex">
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Risks');
                                                        updateCsvImportFormOpen(true);
                                                    }}
                                                >
                                                    <DriveFileRenameOutlineIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Risks
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Assumptions');
                                                        updateCsvImportFormOpen(true);
                                                    }}
                                                >
                                                    <DriveFileRenameOutlineIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Assumptions
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Issues');
                                                        updateCsvImportFormOpen(true);
                                                    }}
                                                >
                                                    <DriveFileRenameOutlineIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Issues
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="min-w-[250px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[240px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        updateImportFrom('Dependency');
                                                        updateCsvImportFormOpen(true);
                                                    }}
                                                >
                                                    <DriveFileRenameOutlineIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Dependency
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </>
            )}
        </Layout>
    );
}
