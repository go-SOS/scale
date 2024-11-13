"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import { Card, CardContent } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next-nprogress-bar';
import MailDrawer from "@/components/emailsetting/mailDrawer";
import useAppStore from "@/store/appStore";
import BugReportIcon from '@mui/icons-material/BugReport';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useSession } from "next-auth/react";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HttpsIcon from '@mui/icons-material/Https';
import PasswordDrawer from "./profile/components/passwordDrawer";
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChecklistIcon from '@mui/icons-material/Checklist';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ConfirmBox from "./components/confirmBox";
import MapIcon from '@mui/icons-material/Map';


export default function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { userRole, updateIsPasswordDrawer, projectList } = useAppStore();
    const { data: session } = useSession();
    const [localSessiondata, setLocalSessiondata] = useState("");
    const [confirmPopup, setConfirmPopup] = useState(false);

    const showConfirmPopup = (newData) => {
        setConfirmPopup(newData);
    }

    useEffect(() => {
        setLocalSessiondata(session);
        setLoading(false);
    }, [session])


    const handleDeleteAccount = () => {
        setConfirmPopup(true);
    };

    return (
        <Layout>
            {!loading && (
                <>
                    <MailDrawer />
                    <PasswordDrawer />
                    <div style={{ minWidth: '100%', maxWidth: '100%' }} className="my-3 mb-6">
                        <div className="max-h-[50px] -mt-2">
                            <div className="flex">
                                <div className="mt-1 text-sm font-semibold cursor-pointer" onClick={() => {
                                    router.push("/scale/admin-settings");
                                }}>
                                    Admin Settings
                                </div>
                            </div>

                        </div>
                    </div>
                    {confirmPopup && (
                        <ConfirmBox showConfirmPopup={showConfirmPopup} />
                    )}
                    {localSessiondata?.data?.role === "Administrator" && (
                        <>
                            <Card style={{ minWidth: '100%', maxWidth: '100%', minHeight: '130px', maxHeight: '130px' }} className="mt-3">
                                <CardContent>
                                    <div>
                                        Modules
                                        <Divider className="mt-2" />
                                    </div>
                                    <div className="flex">
                                        <div className="min-w-[200px]">
                                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[180px]">
                                                <div className="flex mt-3 p-2 ml-2 mr-10 cursor-pointer"
                                                    onClick={() => {
                                                        router.push("/scale/project");
                                                    }}
                                                >
                                                    <SummarizeIcon className="mr-2" />
                                                    <div className="text-sm">
                                                        Projects
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                      

                        </>
                    )}
                    <Card style={{ minWidth: '100%', maxWidth: '100%', minHeight: '100px', maxHeight: '200px' }} className="mt-6">
                        <CardContent>
                            <div>
                                Profile
                                <Divider className="mt-2" />
                            </div>
                            <div className="flex">
                                <div className="min-w-[200px]">
                                    <div className="hover:bg-blue-100 hover:rounded-md max-w-[180px]">
                                        <div className="flex mt-3 p-2 ml-2 cursor-pointer"
                                            onClick={() => {
                                                router.push("/scale/admin-settings/profile");
                                            }}
                                        >
                                            <AccountCircleIcon className="mr-2" />
                                            <div className="text-sm">
                                                Profile
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min-w-[200px]">
                                    <div className="hover:bg-blue-100 hover:rounded-md max-w-[200px]">
                                        <div className="flex mt-3 p-2 ml-2 cursor-pointer"
                                            onClick={() => {
                                                updateIsPasswordDrawer(true);
                                            }}
                                        >
                                            <HttpsIcon className="mr-2" />
                                            <div className="text-sm">
                                                Change Password
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{ minWidth: '100%', maxWidth: '100%', minHeight: '100px', maxHeight: '200px' }} className="mt-6">
                        <CardContent>
                            <div>
                                Account
                                <Divider className="mt-2" />
                            </div>
                            <div className="flex">
                                <div className="min-w-[200px]">
                                    <div className="hover:bg-blue-100 hover:rounded-md max-w-[230px]">
                                        <div className="flex mt-3 p-2 ml-2 cursor-pointer"
                                            onClick={() => {
                                                handleDeleteAccount()
                                            }}
                                        >
                                            <DeleteForeverRoundedIcon className="mr-2"
                                            // style={{ color: '#f97316' }}
                                            />
                                            <div className="text-sm text-orange-600">
                                                Delete Account
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </Layout>
    );
}
