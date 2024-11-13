"use client";
import { useEffect, useState } from "react";
import Layout from "@/app/scale/layout/layout";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DragAndDrop from "./dragDrop/dragAndDrop";
import { useRouter } from 'next-nprogress-bar';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import Skeleton from '@mui/material/Skeleton';
import useAppStore from '@/store/appStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatusCard from "./statusCard";
import TinyBarChart from "./tinyBarChart";


export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [reminders, setReminders] = useState([]);
    const baseURL = '/api/';
    const { updateIsDashboardDrawer, dashboardState, updateBacklogList, updateIntialBacklogList, updateBacklogMaster } = useAppStore();
    const [disabled, setDisabled] = useState(false);
    const { projectName, slug } = useSlug();
    const [backlogs, setBacklogs] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getBacklog = async () => {
        let posturl = baseURL + `backlog?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setBacklogs(res?.data);
                updateBacklogList(res?.data);
                updateIntialBacklogList(res?.data);
                getReminderData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getData = async () => {
        let posturl = baseURL + "dashboard?slug=" + slug;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('Dashboard data ', res?.data);
                setRows(res?.data);
                updateBacklogMaster(res?.data?.backlogMaster[0]?.backlogs);
                getBacklog();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const updateDashboardWidget = async () => {
        setDisabled(true);
        const endpoint = baseURL + `dashboard?slug=${slug}`;
        let method;
        let data = {};

        Object.assign(data, { _id: rows?.dashboardData[0]?._id });
        Object.assign(data, { projectName: projectName });
        Object.assign(data, { dashboardState: dashboardState });
        method = "put";
        const { data: responseData } = await axios[method](endpoint, data);
        setDisabled(false);
        const successMessage = 'Dashboard updated successfully!';
        toast.success(successMessage, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'success',
            progress: undefined,
            theme: "light",
            style: {
                width: '380px',
            },
        });
    };

    const getReminderData = async () => {
        let posturl = baseURL + `notification?slug=${slug}`;

        await axios
            .get(posturl)
            .then((res) => {
                // console.log('Reminders ', res?.data);
                setReminders(res?.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Layout>
            {!loading ? (
                <div>
                    <div className="flex justify-between mx-6">
                        <div className="min-w-[1vw]"></div>
                        <div className="mr-2 text-[17px] text-semibold">
                            You can drag and drop the widgets and save as a new dashboard
                        </div>
                        <div className="flex">
                            {/* <button
                                className="pulsebuttonwhite mr-2 px-2"
                                onClick={() => updateIsDashboardDrawer(true)}
                            >
                                Customize
                                <SettingsIcon color="action" />
                            </button> */}
                            <div>
                                {disabled ? (
                                    <div
                                        className="pulsebuttonblue px-3 py-2 mr-1"
                                        style={{ opacity: 0.5, pointerEvents: 'none' }}
                                    >
                                        <span>Save</span>
                                        <span className="mb-1 -mr-4">
                                            <svg ariaHidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                            </svg>
                                        </span>

                                    </div>
                                ) :
                                    (
                                        <button
                                            className="pulsebuttonblue min-w-[140px]"
                                            onClick={updateDashboardWidget}
                                        >
                                            Save
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <StatusCard statusResult={rows?.statusResult[0]} />
                        <div className="mt-4 flex">
                            <div className="min-w-[30vw] shadow-md">
                                <ChartView rows={backlogs} from="backlog" />
                            </div>
                            <div className="min-w-[27vw] ml-4 shadow-md">
                                <TinyBarChart reminders={reminders} />
                            </div>
                            <div>
                                <div className="ml-4 min-w-[18.6vw]">
                                    <Card
                                        className="gradient cursor-pointer"
                                        sx={{ height: 127 }}
                                        onClick={() => {
                                            router.push("/scale/" + slug + "/planning/backlog");
                                        }}
                                    >
                                        <div className="iconstyle text-teal-400">
                                            <WebStoriesIcon sx={{ fontSize: 40 }} />
                                        </div>
                                        <CardContent>
                                            <div className="flex pl-1">
                                                <p className="text-2xl font-semibold mr-4 text-teal-400">
                                                    {rows?.noOfBacklog}
                                                </p>
                                                <p className="text-teal-400 font-semibold text-xl mt-1">
                                                    Work Items
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="ml-4 min-w-[18.6vw] mt-6">
                                    <Card
                                        className="gradient cursor-pointer"
                                        sx={{ height: 127 }}
                                        onClick={() => {
                                            router.push("/scale/" + slug + "/team/member");
                                        }}
                                    >
                                        <div className="iconstyle text-purple-600">
                                            <GroupsIcon sx={{ fontSize: 40 }} />
                                        </div>
                                        <CardContent>
                                            <div className="flex pl-1">
                                                <p className="text-2xl font-semibold mr-4 text-purple-600">
                                                    {rows?.noOfMember}
                                                </p>
                                                <p className="text-purple-600 font-semibold text-xl mt-1">
                                                    Team
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="ml-4 min-w-[18.6vw] mt-6">
                                    <Card
                                        className="gradient cursor-pointer"
                                        sx={{ height: 127 }}
                                        onClick={() => {
                                            router.push("/scale/" + slug + "/planning/sprints");
                                        }}
                                    >
                                        <div className="iconstyle text-indigo-400">
                                            <GroupsIcon sx={{ fontSize: 40 }} />
                                        </div>
                                        <CardContent>
                                            <div className="flex pl-1">
                                                <p className="text-2xl font-semibold mr-4 text-indigo-400">
                                                    {rows?.noOfStakeholder}
                                                </p>
                                                <p className="text-indigo-400 font-semibold text-xl mt-1">
                                                    Stakeholder
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        <Box height={20} />
                        <div>
                            <DragAndDrop
                                recentBacklogs={rows?.recentBacklogs}
                                recentRisks={rows?.recentRisks}
                                recentAssumptions={rows?.recentAssumptions}
                                recentIssues={rows?.recentIssues}
                                recentDependencies={rows?.recentDependencies}
                                backlogMaster={rows?.backlogMaster[0]?.backlogs}
                                riskMaster={rows?.riskMaster[0]?.risks}
                                assumptionMaster={rows?.assumptionMaster[0]?.assumptions}
                                issueMaster={rows?.issueMaster[0]?.issues}
                                dependencyMaster={rows?.dependencyMaster[0]?.dependencies}
                                dashboardStateProp={rows?.dashboardData[0]?.dashboardState}
                            />
                        </div>
                    </Box>
                </div>
            ) : (
                <div className="mt-10">
                    <div className="flex justify-center">
                        <Skeleton className="mt-1 mr-2" variant="rounded" width={300} height={150} />
                        <Skeleton className="mt-1 mr-2" variant="rounded" width={300} height={150} />
                        <Skeleton className="mt-1 mr-2" variant="rounded" width={300} height={150} />
                        <Skeleton className="mt-1 mr-2" variant="rounded" width={300} height={150} />
                    </div>
                    <div className="mt-4">
                        <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                        <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                        <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                        <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                        <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                        <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                    </div>
                </div>
            )}
        </Layout>
    );
}