"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";
import useAppStore from '@/store/appStore';
import TableView from "@/common/tableView";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import CardView from "@/common/cardView";
import SplitView from "@/common/splitView/splitView";
import FilterForm from '@/common/filters/filterForm';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { useRouter } from 'next-nprogress-bar';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ViewMode from "@/common/viewmode/viewMode";


export default function Page() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uiloading, seUiLoading] = useState(true);
    const { updateViewMode, updateFormData, viewMode, isTimer, updateIsTimer, updateTimerRunning } = useAppStore();
    const { updateRowSelection, rowSelection } = useAppStore();
    const { timerList, updateTimermaster } = useAppStore();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const { updateIsTimerDrawer } = useAppStore();
    const baseURL = '/api/';
    const { projectName, slug, key } = useSlug();
    const refMore = useRef(null);
    const router = useRouter();
    const { updateSavedFilters, updateControlledFilter, updateIsClone } = useAppStore();

    useEffect(() => {
        updateSavedFilters({});
        updateControlledFilter({});
    }, []);

    useEffect(() => {
        if (viewMode === "Table") {
            getData();
        }
    }, [viewMode]);

    const [loadingKanban, setLoadingKanban] = useState(true);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        setLoadingKanban(true);
        // Valid, Not Valid, Open, To be Confirmed
        let kanbanStages = [
            {
                "stageName": "Valid",
            },
            {
                "stageName": "Not Valid",
            },
            {
                "stageName": "Open",
            },
            {
                "stageName": "To be Confirmed",
            }
        ];
        if (kanbanStages !== undefined && kanbanStages.length !== 0) {
            const stages = kanbanStages.map(stage => stage.stageName);
            setSteps(stages);
            setTimeout(() => {
                setLoadingKanban(false);
            }, 100);
        }
    }, []);

    useEffect(() => {
        updateViewMode('Table');
        updateFormData(null);
        updateIsTimerDrawer(false);
        getiForm();
    }, []);

    useEffect(() => {
        setRows(timerList);
    }, [timerList]);

    useEffect(() => {
        seUiLoading(false);
    }, [uiloading]);

    const getiForm = async () => {
        let posturl = baseURL + "timermaster";

        try {
            const response = await axios.get(posturl);
            updateTimermaster(response?.data[0]?.timers);
            getData();
        } catch (error) {
            console.error("Error", error);
        }
    };


    useEffect(() => {
        if (rowSelection !== undefined && rowSelection.length > 0) {
            setRowSelectionModel(rowSelection);
        } else {
            setRowSelectionModel([]);
        }
    }, [rowSelection]);


    const handleOpenForm = () => {
        updateIsClone(false);
        updateFormData(null);
        setRowSelectionModel([]);
        updateRowSelection([]);
        if (isTimer) {
            router.push("/scale/" + slug + "/timer/new");
        } else {
            updateIsTimer(true);
            updateTimerRunning(false);
            router.push("/scale/" + slug + "/timer/new");
        }

    };

    const getData = async () => {
        let posturl = baseURL + `timer?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res?.data);
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

    const handleDelete = () => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this record?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteRow()
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const deleteRow = () => {
        let config = {
            method: 'delete',
            url: baseURL + 'timer',
            data: rowSelectionModel
        };

        axios.request(config)
            .then(response => {
                setRowSelectionModel([]);
                toast.success('Record deleted successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: {
                        width: '380px',
                    },
                });
                getData();
            })
            .catch(err => {
                console.log('Error ', err);
                toast.error(err, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: {
                        width: '380px',
                    },
                });
            })
    }


    return (
        <Layout>
            {!uiloading && (
                <>
                    <Breadcrumb page="Timer" project={projectName} />
                    <div>
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
                            <div className="-mb-6">
                                <div className="flex justify-end -mb-6">
                                    {isTimer ? (
                                        <button
                                            className={`pulsebuttonblue px-3 py-1 mr-1`}
                                            onClick={() => handleOpenForm()}
                                        >
                                            <MoreTimeIcon className="w-5 h-5" />
                                            <span>View running timer</span>
                                        </button>
                                    ) : (
                                        <button
                                            className={`pulsebuttonblue px-3 py-1 mr-1`}
                                            onClick={() => handleOpenForm()}
                                        >
                                            <MoreTimeIcon className="w-5 h-5" />
                                            <span>Log new time</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between mt-3">
                                <div className="mt-5">
                                    <div className="flex">
                                        <div>
                                            {(viewMode === 'Table' || viewMode === 'Split') && (
                                                <FilterForm type="Timer" />
                                            )}
                                        </div>
                                        {rowSelectionModel.length > 0 && (
                                            <div className="mr-2">
                                                <button
                                                    className="pulsebuttonwhite px-3 py-1 mr-1"
                                                    onClick={() => handleDelete()}
                                                >
                                                    <DeleteOutlineIcon className="w-5 h-5" sx={{ fontSize: "16px" }} />
                                                    <span className="text-sm">Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5 -mb-1 flex justify-end">
                                    <ViewMode rows={rows} kanban={false} charts={false} />
                                </div>
                            </div>
                            {!loading ? (
                                <div>
                                    {rows !== undefined && (
                                        <>
                                            {viewMode === "Table" && <TableView rows={rows} from="timer" parent="timer" />}
                                            {viewMode === "Split" && <SplitView rows={rows} from="timer" />}
                                            {viewMode === "Card" && <CardView rows={rows} from="timer" params={['summary', 'startTime', 'endTime', 'totalTime', 'createdAt']} />}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
}