"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";
import useAppStore from '@/store/appStore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next-nprogress-bar';
import ViewMode from "@/common/viewmode/viewMode";
import MasterDetails from "./masterDetails";


export default function Page() {
    const router = useRouter();
    const [rows, setRows] = useState([]);
    const [backlogs, setBacklogs] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uiloading, seUiLoading] = useState(true);
    const { updateViewMode, updateFormData, viewMode } = useAppStore();
    const { updateRowSelection, rowSelection } = useAppStore();
    const { sprintList, updateSprintMaster } = useAppStore();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const { updateIsSprintDrawer } = useAppStore();
    const baseURL = '/api/';
    const { projectName, slug } = useSlug();
    const { updateSavedFilters, updateControlledFilter } = useAppStore();

    useEffect(() => {
        updateSavedFilters({});
        updateControlledFilter({});
    }, []);


    useEffect(() => {
        updateViewMode('Table');
        updateFormData(null);
        getData();
        updateIsSprintDrawer(false);
        getiForm();
    }, []);

    useEffect(() => {
        setRows(sprintList);
    }, [sprintList]);

    useEffect(() => {
        seUiLoading(false);
    }, [uiloading]);

    const getiForm = async () => {
        let posturl = baseURL + "sprintmaster";

        try {
            const response = await axios.get(posturl);
            updateSprintMaster(response?.data[0]?.sprints);
            setLoading(false);
        } catch (error) {
            console.error("Error", error);
        }
    };


    useEffect(() => {
        setRowSelectionModel(rowSelection);
    }, [rowSelection]);


    const toggleDrawer = () => (event) => {
        if (event.key === 'Escape') {
            updateIsSprintDrawer(false);
        }
    };

    const handleOpenForm = () => {
        updateFormData(null);
        setRowSelectionModel([]);
        updateRowSelection([]);
        updateIsSprintDrawer(true);
    };

    const getBacklog = async () => {
        let posturl = baseURL + `backlog?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('setBacklogs ', res.data);
                setBacklogs(res.data);
                getMembers();
            })
            .catch((err) => {
                console.log(err);

            });
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
            });
    };

    const getData = async () => {
        let posturl = baseURL + `sprint?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res.data);
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
        let url = baseURL + `sprint?slug=${slug}`;
        let config = {
            method: 'delete',
            url: url,
            data: rowSelectionModel
        };
        axios.request(config)
            .then(response => {
                setRowSelectionModel([]);
                toast.success('Sprint deleted successfully!', {
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
                    <Breadcrumb page="Sprints" project={projectName} section="Planning" />
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
                            <div className="flex justify-end -mb-6">
                                <button
                                    className="pulsebuttonblue px-3 py-1 mr-1"
                                    onClick={() => handleOpenForm()}
                                >
                                    <AddCircleOutlineIcon className="w-5 h-5" />
                                    <span>Create Sprint</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3">
                            <div className="mt-5">
                                <div className="flex">
                                    <div>
                                        {(viewMode === 'Table' || viewMode === 'Split') && (
                                            <FilterForm type="Sprint" />
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
                                <ViewMode rows={rows} kanban={false} calendar={true} />
                            </div>
                        </div>
                        {!loading ? (
                            <div>
                                {rows !== undefined && (
                                    <>
                                        {viewMode === "Table" && <MasterDetails rows={rows} from="release" parent="release" backlogs={backlogs} members={members} />}
                                        {/* {viewMode === "Table" && <TableView rows={rows} from="sprint" parent="sprint" />} */}
                                        {viewMode === "Split" && <SplitView rows={rows} from="sprint" />}
                                        {viewMode === "Card" && <CardView rows={rows} from="sprint" params={['name', 'duration', 'startDate', 'endDate', 'sprintStatus']} />}
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