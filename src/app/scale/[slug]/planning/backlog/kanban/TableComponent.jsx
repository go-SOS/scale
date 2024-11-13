"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";
import AvatarComponent from './AvatarComponent';
import AddIcon from '@mui/icons-material/Add';
import NewWorkItem from "./NewWorkItem";
import useAppStore from '@/store/appStore';
import Popover from '@mui/material/Popover';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tooltip } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MailDrawer from "@/components/mail/mailDrawer";
import { useSession } from "next-auth/react";
import { format } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';


const TableComponent = ({ headers, tasks, column, members }) => {
    const baseURL = '/api/';
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortedTasks, setSortedTasks] = useState([...tasks]);
    const [isCreating, setIsCreating] = useState(false);
    const handleCloseCreating = () => { setIsCreating(false); }
    const [backlogType, setBacklogType] = useState('');
    const [backlogTypeName, setBacklogTypeName] = useState('');
    const { updateIsWorkitemDrawer, updateIsCommonDrawer, updateFromPage, updateBacklogList } = useAppStore();
    const { updateIsMailDrawer, updateIsBacklogUpdated, isBacklogUpdated, updateIsClone, updateIsCommentDrawer } = useAppStore();
    const { slug } = useSlug();
    const [anchorEl, setAnchorEl] = useState(null);
    const [pointerId, setPointerId] = useState(null);
    const [isPointerEvent, setIsPointerEvent] = useState('auto');
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [value, setValue] = useState("");
    const ref = useRef(null);
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setAnchorEl(null);
        }
    };
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;


    const checkOverdue = (dueDateString) => {
        const dueDate = new Date(dueDateString);
        const currentDate = new Date();

        const dueDateOnly = new Date(dueDate.setHours(0, 0, 0, 0));
        const currentDateOnly = new Date(currentDate.setHours(0, 0, 0, 0));

        const isOverdue = dueDateOnly < currentDateOnly;
        return isOverdue;
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {

        // console.log('Headers ', headers);
        // console.log('Tasks ', tasks);
        // console.log('Column ', column);

        if (column?.title === "Product Backlog") {
            setBacklogType("WorkItem");
            setBacklogTypeName("Product Backlog");
        } else {
            setBacklogType("Sprint");
            setBacklogTypeName(column?.title);
        }

        const filteredTasks = tasks.filter((task) =>
            task.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (sortConfig.key) {
            filteredTasks.sort((a, b) => {

                if (sortConfig.key === 'summary' || sortConfig.key === 'key') {
                    if (a.summary.toLowerCase() < b.summary.toLowerCase()) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a.summary.toLowerCase() > b.summary.toLowerCase()) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                }
                else if (sortConfig.key === 'size') {
                    return sortConfig.direction === 'asc'
                        ? a.storyPoints - b.storyPoints
                        : b.storyPoints - a.storyPoints;
                }
                else {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                }

            });
        }

        setSortedTasks(filteredTasks);
    }, [searchQuery, sortConfig, tasks]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleKeyClick = (id) => {
        // console.log('handleKeyClick ', id);
        updateIsCommonDrawer(id);
        updateFromPage("backlog");
    };

    const handlePopoverOpen = (event, id) => {
        updateIsClone(false);
        setPointerId(id);
        setValue(id);
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = (event, id) => {
        if (pointerId == id) {
            setIsPointerEvent('auto');
            // console.log('handlePopoverClose auto');
        }
        else {
            setIsPointerEvent('none');
            setAnchorEl(null);
            // console.log('handlePopoverClose none');
        }
    };

    const handleEvent = (type) => {
        switch (type) {
            case 'view':
                setIsPointerEvent('none');
                setAnchorEl(null);
                updateFromPage("backlog");
                updateIsCommonDrawer(value);
                break;
            case 'add':
                setIsPointerEvent('none');
                setAnchorEl(null);
                updateIsWorkitemDrawer(true);
                break;
            case 'edit':
                setIsPointerEvent('none');
                setAnchorEl(null);
                updateIsWorkitemDrawer(value);
                break;
            case 'comment':
                setIsPointerEvent('none');
                setAnchorEl(null);
                updateIsCommentDrawer(value);
                break;
            case 'delete':
                setIsPointerEvent('none');
                setAnchorEl(null);
                handleDelete();
                break;
            case 'clone':
                setIsPointerEvent('none');
                setAnchorEl(null);
                updateIsClone(true);
                updateIsWorkitemDrawer(value);
                break;
            case 'email':
                setIsPointerEvent('none');
                setAnchorEl(null);
                updateIsMailDrawer(true);
                break;
            default:
                // console.log('Invalid event type');
                break;
        }
    }

    const handleDelete = () => {
        setAnchorEl(null);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this work item?',
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
            url: baseURL + `backlog?slug=${slug}`,
            data: [value],
        };

        axios.request(config)
            .then(response => {
                toast.success('Work item deleted successfully!', {
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
                updateBacklogList(response.data);
                updateIsBacklogUpdated(!isBacklogUpdated);
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

    const handleImportLink = () => {
        router.push(`/scale/${slug}/import`);
    };

    const getFirstNameByEmail = (email) => {
        const teamMember = members.find(member => member.email === email);
        return teamMember ? teamMember.fullName : null;
    }

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


    return (
        <>
            <MailDrawer />
            {sortedTasks.length === 0 ? (
                <div className="flex justify-center p-4 min-h-[20vh]">
                    <div className="border-2 border-dashed border-gray-500 p-4 min-w-[76vw] rounded-lg">
                        <div className="my-4 flex justify-center">
                            {column?.title === "Product Backlog" ? (
                                <div className="text-md text-left mt-4 ml-10">
                                    <h2 className="text-md font-semibold mb-1">Create the product backlog</h2>
                                    <p className="text-gray-700">
                                        Add the work items by Clicking - Add Work Item
                                        <br />
                                        or Import the Work Items from the{" "}
                                        <span onClick={handleImportLink} className="text-blue-500 cursor-pointer">
                                            Import module
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <div className="text-md text-left mt-4 ml-10">
                                    <h2 className="text-md font-semibold mb-1">Create the {column?.title} backlog </h2>
                                    <p className="text-gray-700">
                                        Add the work items by Clicking - Add Work Item
                                        <br />
                                        or Drag and Drop the Work Items from the Product Backlog
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="pb-1 pr-2 bg-white dark:bg-gray-900 flex justify-end pt-1">
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" ariaHidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search"
                                className="block pt-1 pb-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search for tasks"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="relative overflow-x-auto w-full">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                                <tr className="flex">
                                    {headers.map((header, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className={`px-6 py-3 ${header.className}`}
                                            onClick={() => header.sortable && handleSort(header.label)}
                                        >
                                            {header.label}
                                            {header.sortable && (
                                                <span className="mt-[2px] cursor-pointer">
                                                    <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                                    </svg>
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sortedTasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                            {(draggableProvided, draggableSnapshot) => (
                                                <div ref={ref}>
                                                    <tr
                                                        className={`bg-white border-b flex dark:bg-gray-800 dark:border-gray-700 ${draggableSnapshot.isDragging ? 'outline-2px solid card-border' : 'outline-transparent'} ${draggableSnapshot.isDragging ? 'shadow-md' : 'shadow-none'}`}
                                                        ref={draggableProvided.innerRef}
                                                        {...draggableProvided.draggableProps}
                                                        {...draggableProvided.dragHandleProps}
                                                    >
                                                        <td className="px-6 py-2 whitespace-nowrap dark:text-white">
                                                            <div className="flex max-w-[8vw] min-w-[8vw]">
                                                                <div>
                                                                    <MoreVertIcon sx={{ fontSize: "22px" }} />
                                                                </div>
                                                                <div className="text-blue-600 font-medium"
                                                                    onClick={() => handleKeyClick(task.id)}
                                                                    onMouseEnter={(event) => handlePopoverOpen(event, task.id)}
                                                                    onMouseLeave={(event) => handlePopoverClose(event, task.id)}
                                                                    data-field={task?.backlogKey}
                                                                    data-id={task?.id}
                                                                >
                                                                    {task?.backlogKey}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-2 whitespace-nowrap dark:text-white max-w-[11vw] min-w-[11vw]">
                                                            <div className="text-gray-800 text-left overflow-hidden mr-4">
                                                                <Tooltip title={task?.summary} arrow placement="bottom">
                                                                    {task?.summary}
                                                                </Tooltip>
                                                            </div>
                                                        </td>
                                                        <td className="max-w-[12vw] min-w-[12vw]">
                                                            {task?.workItemType && (
                                                                <div className="px-6 py-2 whitespace-nowrap dark:text-white">
                                                                    <div className="text-gray-800 text-left">
                                                                        <span className={`text-[13px] px-2 py-[2px] border rounded-sm ${getWorkItemTypeColor(task?.workItemType)}`}>
                                                                            {task?.workItemType}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="max-w-[8vw] min-w-[8vw]">
                                                            {task?.status && (
                                                                <div className="py-2 whitespace-nowrap dark:text-white">
                                                                    <div className="text-gray-800 text-left">
                                                                        <span className={`text-[13px] px-2 py-[2px] border rounded-sm ${getStatusTypeColor(task?.status)}`}>
                                                                            {task?.status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="max-w-[9vw] min-w-[9vw]">
                                                            {task?.priority && (
                                                                <div className="px-6 py-2 whitespace-nowrap dark:text-white">
                                                                    <div className="text-gray-800 text-left">
                                                                        <span className={`text-[13px] px-1 py-[2px] rounded-sm ${getPriorityColor(task?.priority)}`}>
                                                                            {task?.priority}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-2 max-w-[9vw] min-w-[9vw]">{task?.storyPoints}</td>
                                                        <td className={`px-6 py-2 max-w-[9vw] min-w-[9vw] ${checkOverdue(task?.dueDate) ? 'text-red-500' : ''}`}>
                                                            {format(new Date(task?.dueDate), dateFormat)}
                                                        </td>
                                                        <td className="px-6 py-2 max-w-[10vw] min-w-[10vw]">{getFirstNameByEmail(task?.assignee)}</td>
                                                    </tr>
                                                    <Popover
                                                        sx={{
                                                            pointerEvents: isPointerEvent,
                                                        }}
                                                        id={task.id}
                                                        open={open}
                                                        anchorEl={anchorEl}
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        }}
                                                        onClose={(event) => handlePopoverClose(event, task.id)}
                                                        disableRestoreFocus
                                                        className="-ml-14"
                                                    >
                                                        <div className="flex p-3">
                                                            <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('view')}>
                                                                <Tooltip title="View" arrow placement="bottom">
                                                                    <VisibilityIcon />
                                                                </Tooltip>
                                                            </div>
                                                            <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('edit')}>
                                                                <Tooltip title="Update" arrow placement="bottom">
                                                                    <EditIcon />
                                                                </Tooltip>
                                                            </div>
                                                            <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('comment')}>
                                                                <Tooltip title="Comment" arrow placement="bottom">
                                                                    <MessageRoundedIcon />
                                                                </Tooltip>
                                                            </div>
                                                            {/* <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('add')}>
                                                                <Tooltip title="Add" arrow placement="bottom">
                                                                    <AddCircleOutlineIcon />
                                                                </Tooltip>
                                                            </div> */}
                                                            <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('clone')}>
                                                                <Tooltip title="Clone" arrow placement="bottom">
                                                                    <FileCopyIcon />
                                                                </Tooltip>
                                                            </div>
                                                            <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('email')}>
                                                                <Tooltip title="Send Email" arrow placement="bottom">
                                                                    <MailOutlineIcon />
                                                                </Tooltip>
                                                            </div>
                                                            <div className="mr-3 cursor-pointer text-orange-500 hover:text-orange-700 hover:rounded-full" onClick={() => handleEvent('delete')}>
                                                                <Tooltip title="Remove" arrow placement="bottom">
                                                                    <DeleteOutlineIcon />
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </Popover>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            <div>
                {isCreating ? (
                    <div className="my-3 ml-2">
                        <NewWorkItem handleCloseCreating={handleCloseCreating} backlogType={backlogType} backlogTypeName={backlogTypeName} />
                    </div>
                ) : (
                    <div className="flex my-3 ml-2 cursor-pointer" onClick={() => setIsCreating(true)}>
                        <AddIcon />
                        <span className="font-semibold">
                            Add Work Item
                        </span>
                    </div>
                )}

            </div>
        </>
    );
};

export default TableComponent;
