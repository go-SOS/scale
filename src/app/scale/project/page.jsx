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
import Breadcrumb from '@/app/scale/admin-settings/components/breadcrumb';
import CardView from "@/common/cardView";
import SplitView from "@/common/splitView/splitView";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useSession } from "next-auth/react";
import ViewMode from "@/common/viewmode/viewMode";


export default function DataTable() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const { updateViewMode, updateFormData, viewMode } = useAppStore();
    const { updateRowSelection, rowSelection } = useAppStore();
    const { projectList, updateProjectMaster, updateProjectList, updateCurrentProject, currentProject } = useAppStore();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const { updateIsProjectDrawer } = useAppStore();
    const baseURL = '/api/';
    const [selectedProject, setSelectedProject] = useState(null);
    const { data: session } = useSession();
    const [localSessiondata, setLocalSessiondata] = useState("");
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        if (currentProject) {
            const newDefaultOption = rows?.find(option => option.projectName === currentProject.projectName)?.projectName || '';
            setSelectedOption(newDefaultOption);
        }
    }, [currentProject, rows]);


    useEffect(() => {
        setLocalSessiondata(session);
    }, [session])

    useEffect(() => {
        setRows(projectList);
    }, [projectList]);

    useEffect(() => {
        if (projectList?.length > 0) {
            const activeProject = projectList.find(proj => proj.isActive === true);
            // console.log('activeProject ', activeProject);
            setSelectedProject(activeProject);
            updateCurrentProject(activeProject);
        }
        else {
            updateCurrentProject(null);
            setSelectedProject(null);
        }
    }, [projectList]);


    useEffect(() => {
        updateViewMode('Table');
        updateFormData(null);
        updateIsProjectDrawer(false);
        getiForm();
    }, []);

    const getiForm = async () => {
        let posturl = baseURL + "projectmaster";

        try {
            const response = await axios.get(posturl);
            // console.log('Response', response.data[0].leads);
            updateProjectMaster(response?.data[0]?.projects);
            getData();
        } catch (error) {
            console.error("Error", error);
        }
    };


    useEffect(() => {
        setRowSelectionModel(rowSelection);
    }, [rowSelection]);

    const handleOpenForm = () => {
        setRowSelectionModel([]);
        updateRowSelection([]);
        updateIsProjectDrawer(true);
    };

    const getData = async () => {
        let posturl = baseURL + "project";
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res.data);
                updateProjectList(res.data);
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
            message: 'are you sure to delete this project ?',
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
            url: baseURL + 'project',
            data: rowSelectionModel
        };

        axios.request(config)
            .then(response => {
                updateCurrentProject({});
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
                updateProjectList(response.data);
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

    const handleDropdownChange = (e) => {
        let inputVal = e.target.value;
        const project = rows.find(proj => proj.projectName === inputVal);
        // console.log('projectName ', project);
        setSelectedProject(project);
        setSelectedOption(e.target.value);
    };

    const handleActivateProject = async () => {
        const endpoint = baseURL + "activate-project";
        let data = {};
        const method = "put";
        Object.assign(data, { _id: selectedProject?._id });
        Object.assign(data, { isActive: true });
        const { data: responseData } = await axios[method](endpoint, data);
        updateCurrentProject(responseData);

        toast.success(`${responseData?.projectName} activated!`, {
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
    };


    return (
        <Layout>
            <Breadcrumb page="Project" />
            <div>
                {(localSessiondata?.data?.role === "Administrator" && localSessiondata?.data?.isSuperAdmin) ? (
                    <div>
                        <div className="mt-5">
                            <div className="flex justify-between">
                                {rows.length !== undefined && rows.length > 1 ? (
                                    <div className="flex">
                                        <div className="-mb-6">
                                            <select
                                                onChange={(e) => handleDropdownChange(e)}
                                                value={selectedOption}
                                                className={`scaleform border-gray-300 min-w-[200px]`}
                                            >
                                                {rows !== null && rows !== undefined && rows
                                                    .map((option, index) => (
                                                        <option key={index} value={option.projectName}>
                                                            {option.projectName}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="-mb-6 ml-3">
                                            <button
                                                className="pulsebuttongreen px-3 mr-1 mt-[5px]"
                                                onClick={() => handleActivateProject()}
                                            >
                                                <RocketLaunchIcon className="w-5 h-5" />
                                                <span>Activate Project</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="min-w-[200px]"></div>
                                )}
                                <div className="flex justify-end -mb-6">
                                    <button
                                        className="pulsebuttonblue px-3 py-1 mr-1"
                                        onClick={() => handleOpenForm()}
                                    >
                                        <AddCircleOutlineIcon className="w-5 h-5" />
                                        <span>Add Project</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3">
                            <div className="mt-5">
                                {rowSelectionModel.length > 0 && (
                                    <div className="flex">
                                        <div className="mr-2">
                                            <button
                                                className="pulsebuttonwhite px-3 py-1 mr-1"
                                                onClick={() => handleDelete()}
                                            >
                                                <DeleteOutlineIcon className="w-5 h-5" sx={{ fontSize: "16px" }} />
                                                <span className="text-sm">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-5 -mb-1 flex justify-end">
                                <ViewMode rows={rows} kanban={false} charts={false} />
                            </div>
                        </div>
                        {!loading ? (
                            <div>
                                {rows !== undefined && (
                                    <>
                                        {viewMode === "Table" && <TableView rows={rows} from="project" parent="project" />}
                                        {viewMode === "Split" && <SplitView rows={rows} from="project" />}
                                        {viewMode === "Card" && <CardView rows={rows} from="project" params={['projectKey', 'projectName', 'expectedStartDate', 'expectedEndDate', 'createdBy']} />}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="mt-16">
                                <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {!loading ? (
                            <div className="flex justify-center mt-32 text-md">
                                <div className="text-center">
                                    <div>
                                        <div className="flex justify-between">
                                            <div className="flex">
                                                <div className="-mb-6">
                                                    <select
                                                        onChange={(e) => handleDropdownChange(e)}
                                                        value={selectedOption}
                                                        className={`scaleform border-gray-300 min-w-[200px]`}
                                                    >
                                                        {rows !== null && rows !== undefined && rows
                                                            .map((option, index) => (
                                                                <option key={index} value={option.projectName}>
                                                                    {option.projectName}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="-mb-6 ml-3">
                                                    <button
                                                        className="pulsebuttongreen px-3 mr-1 mt-[5px]"
                                                        onClick={() => handleActivateProject()}
                                                    >
                                                        <RocketLaunchIcon className="w-5 h-5" />
                                                        <span>Activate Project</span>
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-16">
                                <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                            </div>
                        )}
                    </div>
                )}
            </div>

        </Layout>
    );
}