"use client";
import * as React from 'react';
import { useEffect, useState } from "react";
import { DataGridPro, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid-pro';
import useAppStore from '@/store/appStore';
import { useSession } from "next-auth/react";
import { format } from 'date-fns';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import axios from "axios";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';

const getStatusTypeColor = (status) => {
    switch (status) {
        case 'Backlog':
            return 'bg-blue-100';
        case 'To Do':
            return 'bg-teal-100';
        case 'In Progress':
            return 'bg-yellow-100';
        case 'Done':
            return 'bg-green-100';
        case 'Cancelled':
            return 'bg-red-100';
        case 'Duplicate':
            return 'bg-purple-100';
        default:
            return 'bg-gray-100';
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'Critical':
            return 'bg-red-100';
        case 'High':
            return 'bg-orange-100';
        case 'Medium':
            return 'bg-yellow-100';
        case 'Low':
            return 'bg-green-100';
        default:
            return 'bg-gray-100';
    }
};


const getWorkItemTypeColor = (workItemType) => {
    switch (workItemType) {
        case 'Epic':
            return 'bg-purple-100';
        case 'Feature':
            return 'bg-blue-100';
        case 'Story':
            return 'bg-green-100';
        case 'Bug':
            return 'bg-red-100';
        case 'Technical Debt':
            return 'bg-gray-100';
        case 'Proof of Concept':
            return 'bg-orange-100';
        case 'Spike':
            return 'bg-yellow-100';
        case 'Enabler':
            return 'bg-teal-100';
        case 'Technical Improvement':
            return 'bg-indigo-100';
        case 'Process Improvement':
            return 'bg-pink-100';
        default:
            return 'bg-gray-100';
    }
};



function DetailPanelContent({ row, members, backlogs }) {
    const { updateIsSprintDrawer, updateSprintList } = useAppStore();
    const { slug } = useSlug();
    const baseURL = '/api/';

    const getFirstNameByEmail = (email) => {
        const teamMember = members.find(member => member.email === email);
        return teamMember ? teamMember.fullName : null;
    }

    const workitems = backlogs.filter(item => item?.backlogTypeName === row?.name);

    const ActionButtons = () => (
        <>
            <div className="flex">
                <button onClick={handleOpenForm} className="pulsebuttonwhite mr-2">
                    <span>Edit</span>
                </button>
                <button onClick={handleDelete} className="cursor-pointer mb-2 mr-2 border border-slate-300 px-3 rounded-sm">
                    <DeleteOutlineIcon />
                </button>
            </div>
        </>
    );

    const handleOpenForm = () => {
        updateIsSprintDrawer(row?._id);
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
            url: baseURL + `sprint?slug=${slug}`,
            data: [row?._id]
        };

        axios.request(config)
            .then(response => {
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
                // console.log('deleted response ', response);
                updateSprintList(response?.data);

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
        <div className="p-4 max-w-[79vw] border-slate-300 rounded-lg border m-3 min-h-[380px]">
            <div className="mt-5 mr-4 flex justify-end">
                <ActionButtons />
            </div>
            {workitems && workitems.length > 0 ? (
                <div>
                    <p className="min-w-[200px] capitalize mt-4 font-semibold text-sm">Work Items: </p>
                    <table className="mb-2 mt-3 ml-16 table-auto border border-collapse border-gray-300 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-sm">
                                <th className="border border-gray-300 px-4 py-2 min-w-[20vw]">Summary</th>
                                <th className="border border-gray-300 px-4 py-2 min-w-[10vw]">Type</th>
                                <th className="border border-gray-300 px-4 py-2 min-w-[7vw]">Status</th>
                                <th className="border border-gray-300 px-4 py-2">Priority</th>
                                <th className="border border-gray-300 px-4 py-2">Story Points</th>
                                <th className="border border-gray-300 px-4 py-2">Assignee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workitems && workitems.map((item, index) => (
                                <tr key={index} className="mb-2">
                                    <td className="border border-gray-300 px-4 py-2 text-[13px]">{item?.summary}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span className={`text-[13px] px-1 py-[2px] rounded-sm ${getWorkItemTypeColor(item?.workItemType)}`}>
                                            {item?.workItemType}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span className={`text-[13px] px-2 py-[2px] border rounded-sm ${getStatusTypeColor(item?.status)}`}>
                                            {item?.status}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span className={`text-[13px] px-1 py-[2px] rounded-sm ${getPriorityColor(item?.priority)}`}>
                                            {item?.priority}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-[13px]">
                                        {item?.storyPoints}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-[13px]">
                                        {getFirstNameByEmail(item?.assignee)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <div className="flex justify-center text-md mt-16">
                        No record to display.
                    </div>
                </div>
            )}
        </div>
    );
}


export default function MasterDetails({ rows, members, backlogs }) {
    const { dopen, updateIsCommonDrawer, updateFromPage } = useAppStore();
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const [loading, setLoading] = useState(true);
    const { updateIsSprintDrawer, updateSprintList } = useAppStore();
    const { slug } = useSlug();
    const baseURL = '/api/';

    useEffect(() => {
        setLoading(false);
    }, [])

    const columns = [
        {
            field: 'name', headerName: 'Sprint Name', width: 200, cellClassName: `font-semibold text-blue-500 cursor-pointer`,
            renderHeader: () => (
                <strong>
                    Sprint Name
                </strong>
            ),
        },
        {
            field: 'duration', headerName: 'Duration', width: 200, renderHeader: () => (
                <strong>
                    Duration
                </strong>
            ),
        },
        {
            field: 'startDate', headerName: 'Start Date', width: 200,
            valueGetter: (value, row) => {
                if (value) {
                    try {
                        return format(new Date(value), dateFormat);
                    } catch (error) {
                        console.error("Error formatting date:", error);
                        return "";
                    }
                }
                else {
                    console.warn("Value is undefined for date field.");
                    return "";
                }
            },
            renderHeader: () => (
                <strong>
                    Start Date
                </strong>
            ),
        },
        {
            field: 'endDate', headerName: 'End Date', width: 200,
            valueGetter: (value, row) => {
                if (value) {
                    try {
                        return format(new Date(value), dateFormat);
                    } catch (error) {
                        console.error("Error formatting date:", error);
                        return "";
                    }
                }
                else {
                    console.warn("Value is undefined for date field.");
                    return "";
                }
            },
            renderHeader: () => (
                <strong>
                    End Date
                </strong>
            ),
        },
        {
            field: 'sprintStatus', headerName: 'Status', width: 200, renderHeader: () => (
                <strong>
                    Status
                </strong>
            ),
        },
        {
            field: 'sprintGoal', headerName: 'SprintGoal', width: 350, renderHeader: () => (
                <strong>
                    Sprint Goal
                </strong>
            ),
        },
        {
            field: 'createdBy', headerName: 'Created By', width: 200, renderHeader: () => (
                <strong>
                    Created By
                </strong>
            ),
        },
        {
            field: 'createdAt', headerName: 'Created On', width: 200, renderHeader: () => (
                <strong>
                    Created On
                </strong>
            ),
            valueGetter: (value, row) => {
                return format(value, dateFormat);
            },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Action',
            width: 100,
            cellClassName: 'actions',
            renderHeader: () => (
                <strong>
                    Action
                </strong>
            ),
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={() => updateIsSprintDrawer(id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlineIcon />}
                        label="Delete"
                        className="textPrimary"
                        onClick={() => handleDelete(id)}
                    />,
                ];
            },
        }
    ];

    const handleDelete = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this record?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteRow(id)
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const deleteRow = (id) => {
        let config = {
            method: 'delete',
            url: baseURL + `sprint?slug=${slug}`,
            data: [id]
        };

        axios.request(config)
            .then(response => {
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
                // console.log('deleted response ', response);
                updateSprintList(response?.data);

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


    const getDetailPanelContent = React.useCallback(
        ({ row }) => <DetailPanelContent row={row} members={members} backlogs={backlogs} />,
        [backlogs, members],
    );

    const getDetailPanelHeight = React.useCallback(() => 400, []);

    const handleOnCellClick = (params) => {
        // console.log('params ', params);
        if (params.field === "releaseName") {
            updateFromPage('release');
            updateIsCommonDrawer(params?.id);
        }
    }

    return (
        <div>
            {rows.length > 0 ? (
                <div style={
                    (dopen ? { minHeight: '57vh', height: '57vh', maxHeight: '57vh', width: '81vw', backgroundColor: '#f0f9ff' } :
                        { minHeight: '57vh', height: '57vh', maxHeight: '57vh', width: '89vw', backgroundColor: '#f0f9ff' })} className="rounded-lg mt-4">

                    <DataGridPro
                        columns={columns}
                        rows={rows}
                        getRowId={(row) => (row?._id)}
                        getRowClassName={(params) => {
                            return 'bg-white';
                        }}
                        slots={{ toolbar: GridToolbar }}
                        onCellClick={handleOnCellClick}
                        getDetailPanelHeight={getDetailPanelHeight}
                        getDetailPanelContent={getDetailPanelContent}
                    />

                </div>
            ) : (
                <div>
                    <div className="border-2 border-dashed border-gray-500 p-4 min-w-[76vw] rounded-lg mt-16">
                        <div className="flex justify-center p-4 min-h-[22vh]">
                            <div className="text-md text-left mt-4 ml-10">
                                <div>
                                    <h2 className="text-md font-semibold mb-1">Start creating sprint</h2>
                                    <p className="text-gray-700">
                                        A sprint is a defined period within Agile methodology where specific tasks are completed and reviewed,
                                        <br />
                                        enabling incremental progress and regular feedback.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
