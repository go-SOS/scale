"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";
import useAppStore from '@/store/appStore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
import Kanban from "@/common/kanban/Kanban";
import FilterForm from '@/common/filters/filterForm';
import domtoimage from 'dom-to-image';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next-nprogress-bar';
import RefreshIcon from '@mui/icons-material/Refresh';
import ViewMode from "@/common/viewmode/viewMode";
import { Tooltip } from '@mui/material';
import KanbanBoard from "@/common/kanbanBoard/Kanban";


export default function Page() {
    const router = useRouter();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uiloading, seUiLoading] = useState(true);
    const { updateViewMode, updateFormData, viewMode } = useAppStore();
    const { updateRowSelection, rowSelection } = useAppStore();
    const { assumptionList, updateAssumptionMaster } = useAppStore();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const { updateIsAssumptionDrawer } = useAppStore();
    const baseURL = '/api/';
    const { projectName, slug, key } = useSlug();
    const { updateAssumptionList } = useAppStore();
    const { updateSavedFilters, updateControlledFilter, updateIsClone } = useAppStore();
    const captureRef = useRef();

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

    const handleRefresh = () => {
        setLoading(true);
        getData();
    }

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
    const [isteps, setISteps] = useState([]);

    useEffect(() => {
        setLoadingKanban(true);
        let kanbanStages = [
            {
                "stageName": "Open",
            },
            {
                "stageName": "To be Confirmed",
            },
            {
                "stageName": "Valid",
            },
            {
                "stageName": "Not Valid",
            },
            {
                "stageName": "Duplicate",
            }
        ];
        let iStages = [
            {
                "stageName": "To Do",
            },
            {
                "stageName": "In Progress",
            },
            {
                "stageName": "Done",
            }
        ];
        if (kanbanStages !== undefined && kanbanStages.length !== 0) {
            const stages = kanbanStages.map(stage => stage.stageName);
            setSteps(stages);
        }
        if (iStages !== undefined && iStages.length !== 0) {
            const stages = iStages.map(stage => stage.stageName);
            setISteps(stages);
            setTimeout(() => {
                setLoadingKanban(false);
            }, 100);
        }
    }, []);

    useEffect(() => {
        updateViewMode('Table');
        updateFormData(null);
        updateIsAssumptionDrawer(false);
        getiForm();
    }, []);

    useEffect(() => {
        setRows(assumptionList);
    }, [assumptionList]);

    useEffect(() => {
        seUiLoading(false);
    }, [uiloading]);

    const getiForm = async () => {
        let posturl = baseURL + "assumptionmaster";

        try {
            const response = await axios.get(posturl);
            updateAssumptionMaster(response?.data[0]?.assumptions);
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

    const toggleDrawer = () => (event) => {
        if (event.key === 'Escape') {
            updateIsAssumptionDrawer(false);
        }
    };

    const handleOpenForm = () => {
        updateIsClone(false);
        updateFormData(null);
        setRowSelectionModel([]);
        updateRowSelection([]);
        updateIsAssumptionDrawer(true);
    };

    const getData = async () => {
        let posturl = baseURL + `assumption?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res?.data);
                updateAssumptionList(res?.data);
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
            url: baseURL + 'assumption',
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
                    <Breadcrumb page="Assumption Logs" project={projectName} section="Raid" />
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
                        <div>
                            <div className="flex justify-end -mb-6">
                                <button
                                    className="pulsebuttonblue px-3 py-1 mr-1"
                                    onClick={() => handleOpenForm()}
                                >
                                    <AddCircleOutlineIcon className="w-5 h-5" />
                                    <span>Add Assumption Log</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3">
                            <div className="mt-5">
                                <div className="flex">
                                    <div>
                                        {(viewMode === 'Table' || viewMode === 'Split') && (
                                            <FilterForm type="Assumption" />
                                        )}
                                    </div>
                                    {rowSelectionModel.length > 0 && (viewMode === "Table" || viewMode === "Split") && (
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
                                <ViewMode rows={rows} />
                            </div>
                        </div>
                        {!loading ? (
                            <div ref={captureRef}>
                                {rows !== undefined && (
                                    <>
                                        {viewMode === "Table" && <TableView rows={rows} from="assumption" parent="assumption" />}
                                        {viewMode === "Split" && <SplitView rows={rows} from="assumption" />}
                                        {viewMode === "Card" && <CardView rows={rows} from="assumption" params={['key', 'summary', 'status', 'priority', 'action']} />}
                                        {viewMode === "Kanban" && (
                                            <div style={{ maxWidth: '81vw' }} className="overflow-x-auto mt-2">
                                                <div className="mt-5">
                                                    <div className="p-2 rounded-lg">
                                                        <KanbanBoard rows={assumptionList} steps={steps} from="assumption" key={assumptionList?.length} />
                                                    </div>
                                                    <div className="p-2 border border-slate-300 rounded-lg mt-32">
                                                        <div className="flex justify-center my-3 mt-5 text-lg font-semibold">
                                                            Open / To Be Confirmed Assumptions
                                                        </div>
                                                        <Kanban rows={rows} steps={isteps} from="iassumption" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {viewMode === "Charts" && <ChartView rows={rows} from="assumption" />}
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
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            </>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
}