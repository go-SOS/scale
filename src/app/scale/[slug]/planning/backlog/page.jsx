"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import axios from "axios";
import useAppStore from '@/store/appStore';
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import dynamic from "next/dynamic";
import { ToastContainer } from 'react-toastify';
import { useSession } from "next-auth/react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Tooltip } from '@mui/material';
import ViewMode from "@/common/viewmode/viewMode";
import GanttPage from "@/common/gantt/ganttPage";
import Kanban from "@/common/kanbanBoard/Kanban";
import TableView from "@/common/tableView";
import SplitView from "@/common/splitView/splitView";
import CardView from "@/common/cardView";
import WebStoriesIcon from '@mui/icons-material/WebStories';
import FilterDropdown from "@/common/filters/filterDropdown";
import FilterForm from '@/common/filters/filterForm';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DragAndDrop = dynamic(() => import('./kanban/Kanban'),
    {
        loading: () => <Skeleton variant="rounded" className="mt-10" width="100%" height="100px" />,
        ssr: false
    }
);

export default function Page() {
    const [rows, setRows] = useState([]);
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uiloading, seUiLoading] = useState(true);
    const { projectName, slug, key } = useSlug();
    const baseURL = '/api/';
    const { updateBacklogList, isBacklogUpdated, backlogList } = useAppStore();
    const { updateBacklogSteps, updateIsWorkitemDrawer } = useAppStore();
    const { userId, sessionData, updateSprintList, updateIsClone, updateBacklogMaster, updateIntialBacklogList } = useAppStore();
    const [disabled, setDisabled] = useState(false);
    const { data: session } = useSession();
    const [localSessiondata, setLocalSessiondata] = useState("");
    const [members, setMembers] = useState([]);
    const { updateViewMode, viewMode } = useAppStore();
    const [ksteps, setKSteps] = useState([]);
    const [stages, setStages] = useState([]);
    const { rowSelection } = useAppStore();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    useEffect(() => {
        if (rowSelection !== undefined && rowSelection.length > 0) {
            setRowSelectionModel(rowSelection);
        } else {
            setRowSelectionModel([]);
        }
    }, [rowSelection]);

    useEffect(() => {
        setLocalSessiondata(session);
    }, [session])

    useEffect(() => {
        updateViewMode('');
        getSprints();
    }, []);

    useEffect(() => {
        seUiLoading(false);
    }, [uiloading]);

    useEffect(() => {
        setLoading(true);
        getSteps();
    }, [isBacklogUpdated]);

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
                setKSteps(stages);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error", error);
        }
    };

    const getMembers = async () => {
        let posturl = baseURL + `assignee?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setMembers(res.data);
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

    const getData = async () => {
        let posturl = baseURL + `backlog?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res.data);
                updateBacklogList(res.data);
                updateIntialBacklogList(res?.data);
                getWorkflow();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const getSteps = async () => {
        let posturl = baseURL + `steps?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                updateBacklogSteps(res.data);
                const stepsArray = res.data.map(item => item.name).reverse();
                setSteps(stepsArray);
                getData();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const getSprints = async () => {
        let posturl = baseURL + `sprint?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                updateSprintList(res.data);
                getMasterData();
                //    console.log('sprints', res.data);   
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const createSprint = async () => {
        setDisabled(true);
        try {
            const endpoint = baseURL + `sprint?slug=${slug}`;
            let data = {
                userId: userId,
                projectSlug: slug,
                projectName: projectName,
                summary: 'Sprint',
                type: 'Sprint',
                lastModifiedBy: sessionData.data.email,
                createdBy: sessionData.data.fullName
            }
            setLoading(true);
            let method = "post";
            const { data: responseData } = await axios[method](endpoint, data);
            // console.log('responseData ', responseData);
            updateSprintList(responseData?.data);
            const stepsArray = responseData?.stepData.map(item => item.name).reverse();
            setSteps(stepsArray);
            setLoading(false);
            setDisabled(false);
            // updateIsBacklogUpdated(!isBacklogUpdated)
        } catch (error) {
            console.log(error);
        }
    };


    const getMasterData = async () => {
        let posturl = baseURL + "backlogmaster";
        await axios
            .get(posturl)
            .then((res) => {
                updateBacklogMaster(res?.data[0]?.backlogs);
                getMembers();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleRefresh = () => {
        setLoading(true);
        getSteps();
        getSprints();
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
                    <ToastContainer />
                    <div className="sticky-container">
                        <Breadcrumb page="Backlog" project={projectName} section="Planning" />
                        <div className="button-container">
                            <button
                                className="pulsebuttonblue px-3 py-1 mr-1"
                                onClick={() => {
                                    updateIsClone(false)
                                    updateIsWorkitemDrawer(true)
                                }}
                            >
                                <AddCircleOutlineIcon className="w-5 h-5" />
                                <span>Add Work Item</span>
                            </button>
                            {localSessiondata?.data?.role === "Administrator" && (
                                <div>
                                    {disabled ? (
                                        <div
                                            className="pulsebuttonblue px-3 py-1 mr-1"
                                            style={{ opacity: 0.5, pointerEvents: 'none' }}
                                        >
                                            <span className="-mr-4 -mt-1">
                                                <svg ariaHidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            <span>Create Sprint</span>
                                        </div>
                                    ) :
                                        (
                                            <button
                                                className="pulsebuttonblue px-3 py-1 mr-1"
                                                onClick={() => createSprint()}
                                            >
                                                <AddCircleOutlineIcon className="w-5 h-5" />
                                                <span>Create Sprint</span>
                                            </button>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <div className="flex justify-between">
                                <div className="mt-1">
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
                            <div className="flex justify-end">
                                <Tooltip title="Refresh" arrow placement="top">
                                    <div
                                        className="hover:bg-slate-50 cursor-pointer bg-white mr-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2"
                                        onClick={() => handleRefresh()}
                                    >
                                        <RefreshIcon className="w-5 h-5" color="action" />
                                    </div>
                                </Tooltip>
                                <Tooltip title="Backlog" arrow placement="top">
                                    <div
                                        className="hover:bg-slate-50 cursor-pointer bg-white mr-1 ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2"
                                        onClick={() => updateViewMode("")}
                                        style={viewMode === '' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                                    >
                                        <WebStoriesIcon className="w-5 h-5" color="action" />
                                    </div>
                                </Tooltip>
                                <div className="mr-2">
                                    <ViewMode rows={rows} timeline={true} calendar={true} />
                                </div>
                                <div className="mr-2">
                                    <FilterDropdown stages={stages} from="backlog" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {!loading ? (
                        <div className="mt-10">
                            {viewMode === "" && <DragAndDrop rows={backlogList} steps={steps} members={members} key={backlogList?.length} />}
                            {viewMode === "Kanban" && <div style={{ maxWidth: '81vw' }} className="overflow-x-auto mt-6">
                                <Kanban rows={backlogList} steps={ksteps} from="backlog" key={backlogList?.length} />
                            </div>}
                            {viewMode === "Timeline" && <div style={{ maxWidth: '81vw' }} className="overflow-x-auto mt-6">
                                <GanttPage from="Board" />
                            </div>}
                            {viewMode === "Table" && <TableView rows={backlogList} from="backlog" parent="backlog" />}
                            {viewMode === "Split" && <SplitView rows={backlogList} from="backlog" />}
                            {viewMode === "Card" && <CardView rows={backlogList} from="backlog" params={['backlogKey', 'summary', 'status', 'priority', 'assignee', 'workItemType', 'startDate', 'dueDate', 'updatedAt', 'createdAt']} />}
                        </div>
                    ) : (
                        <div className="mt-10">
                            <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
                            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                        </div>
                    )}
                </>
            )}
        </Layout>

    )
}
