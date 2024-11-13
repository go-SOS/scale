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
import Kanban from "@/common/kanbanBoard/Kanban";
import domtoimage from 'dom-to-image';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkflowDrawer from "@/components/workflow/workflowDrawer";
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next-nprogress-bar';
import TableView from "@/common/tableView";
import SplitView from "@/common/splitView/splitView";
import CardView from "@/common/cardView";
import FilterForm from '@/common/filters/filterForm';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ViewMode from "@/common/viewmode/viewMode";
import GanttPage from "@/common/gantt/ganttPage";
import FilterDropdown from "@/common/filters/filterDropdown";
import { Tooltip } from '@mui/material';
import { useSession } from "next-auth/react";


export default function Page() {
    const router = useRouter();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uiloading, seUiLoading] = useState(true);
    const { backlogList, updateIsWorkflowDrawer, updateBacklogList, updateIntialBacklogList } = useAppStore();
    const { updatedIsKanbanRefresh, isKanbanRefresh, updateBacklogMaster } = useAppStore();
    const baseURL = '/api/';
    const { projectName, slug, key } = useSlug();
    const captureRef = useRef();
    const [steps, setSteps] = useState([]);
    const [stages, setStages] = useState([]);
    const { updateViewMode, viewMode } = useAppStore();
    const { rowSelection } = useAppStore();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        if (rowSelection !== undefined && rowSelection.length > 0) {
            setRowSelectionModel(rowSelection);
        } else {
            setRowSelectionModel([]);
        }
    }, [rowSelection]);

    const handleCaptureClick = () => {
        domtoimage.toPng(captureRef.current)
            .then(dataUrl => {
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = dataUrl;
                link.click();
            })
            .catch(error => {
                console.error('oops, something went wrong!', error);
            });
    };

    useEffect(() => {
        if (viewMode === "Kanban") {
            getiForm();
        }
    }, [viewMode]);

    useEffect(() => {
        updateViewMode('Kanban');
        seUiLoading(false);
    }, []);

    const getiForm = async () => {
        let posturl = baseURL + "backlogmaster";

        try {
            const response = await axios.get(posturl);
            updateBacklogMaster(response?.data[0]?.backlogs);
            getWorkflow();
        } catch (error) {
            console.error("Error", error);
        }
    };

    useEffect(() => {
        if (isKanbanRefresh) {
            getiForm();
        }
    }, [isKanbanRefresh]);

    useEffect(() => {
        // console.log('backlogList ', backlogList?.length);
        setRows(backlogList);
    }, [backlogList]);

    useEffect(() => {
        updateIsWorkflowDrawer(false);
    }, []);

    const getData = async () => {
        let posturl = baseURL + `backlog?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res?.data);
                updateBacklogList(res?.data);
                updateIntialBacklogList(res?.data);
                updatedIsKanbanRefresh(false);
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

    const getWorkflow = async () => {
        setLoading(true);
        let posturl = `${baseURL}workflow?name=backlog`;

        try {
            const response = await axios.get(posturl);
            // console.log('workflow ', response?.data[0]?.stages);
            const kanbanStages = response?.data[0]?.stages;
            setStages(kanbanStages);
            if (kanbanStages !== undefined && kanbanStages.length !== 0) {
                const stages = kanbanStages.map(stage => stage.stageName);
                setSteps(stages);
            }
            getData();
        } catch (error) {
            console.error("Error", error);
        }
    };

    const handleRefresh = () => {
        getWorkflow();
    }

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
            url: baseURL + 'backlog',
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
                    <Breadcrumb page="Kanban Board" project={projectName} section="Development" />
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
                        <div className="flex justify-between">
                            <div className="flex justify-between">
                                <div className="mt-5">
                                    {(viewMode === 'Table' || viewMode === 'Split') && (
                                        <div className="flex">
                                            <div>
                                                <FilterForm type="Backlog" />
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
                                    )}
                                </div>
                            </div>
                            <div className="mt-5 -mb-1 flex justify-end">
                                <div className="flex">
                                    <Tooltip title="Refresh" arrow placement="top">
                                        <button
                                            className="hover:bg-slate-50 bg-white mr-1 ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2"
                                            onClick={() => handleRefresh()}
                                        >
                                            <RefreshIcon className="w-5 h-5" color="action" />
                                        </button>
                                    </Tooltip>
                                    <Tooltip title="Screenshot" arrow placement="top">
                                        <button
                                            className="hover:bg-slate-50 bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2"
                                            onClick={() => handleCaptureClick()}
                                        >
                                            <CameraAltIcon className="w-5 h-5" color="action" />
                                        </button>
                                    </Tooltip>
                                    <div className="mr-2">
                                        <ViewMode rows={rows} timeline={true} calendar={true} />
                                    </div>
                                    <div className="mr-2">
                                        <FilterDropdown stages={stages} from="backlog" />
                                    </div>
                                    {session?.data?.role === "Administrator" && (
                                        <button
                                            className="pulsebuttonwhite mr-2 px-2"
                                            onClick={() => updateIsWorkflowDrawer(true)}
                                        >
                                            Customize
                                            <SettingsIcon color="action" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {!loading ? (
                            <div ref={captureRef} className="mt-3">
                                <>
                                    <WorkflowDrawer masterData={steps} />

                                    {viewMode === "Kanban" && <div style={{ maxWidth: '81vw' }} className="overflow-x-auto mt-6">
                                        <Kanban rows={backlogList} steps={steps} from="backlog" key={backlogList?.length} />
                                    </div>}
                                    {viewMode === "Timeline" && <div style={{ maxWidth: '81vw' }} className="overflow-x-auto mt-6">
                                        <GanttPage from="Board" />
                                    </div>}
                                    {viewMode === "Table" && <TableView rows={rows} from="backlog" parent="backlog" />}
                                    {viewMode === "Split" && <SplitView rows={rows} from="backlog" />}
                                    {viewMode === "Card" && <CardView rows={rows} from="backlog" params={['backlogKey', 'summary', 'status', 'priority', 'assignee', 'workItemType', 'startDate', 'dueDate', 'updatedAt', 'createdAt']} />}
                                </>
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
                </>
            )}
        </Layout>
    );
}