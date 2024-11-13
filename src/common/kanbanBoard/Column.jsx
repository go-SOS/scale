"use client";
import React, { useEffect, useState, useRef } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddIcon from '@mui/icons-material/Add';
import useAppStore from '@/store/appStore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from "axios";
import { useSession } from "next-auth/react";
import useSlug from "@/app/scale/layout/hooks/useSlug";
import Dropdown from './Dropdown';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import MoreEvent from "./MoreEvent";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from '@mui/material';


const Column = ({ column, tasks, from, workflows, localForm, members, wsteps, sprints }) => {
    const baseURL = '/api/';
    const { updateIsWorkitemDrawer, updateIsMailDrawer, updateBacklogList, updateIsCommentDrawer, updateIsCommonDrawer, updateFromPage } = useAppStore();
    const { updateIsClone, updatedTodoList, updateIsTodoDrawer, updateRetrospectiveList, updateIsRetrospectiveDrawer, backlogSteps } = useAppStore();
    const { updateIsRiskDrawer, updateIsAssumptionDrawer, updateIsDependencyDrawer, updateIsIssueDrawer } = useAppStore();
    const { updateRiskList, updateAssumptionList, updateDependencyList, updateIssueList } = useAppStore();
    const [isHovered, setIsHovered] = useState(false);
    const [isAddNewItem, setIsAddNewItem] = useState(false);
    const { data: session } = useSession();
    const { projectName, slug, key } = useSlug();
    const refNewItemBox = useRef(null);
    const refMenuItem = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [taskList, setTaskList] = useState(tasks);
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const currentDate = new Date();

    const handleCloseMoreClick = (newState) => {
        setIsDropdownOpen(null);
        if (from === "backlog") {
            if (newState?.type === "comment") {
                updateIsCommentDrawer(newState?.id);
            }
            if (newState?.type === "view") {
                updateFromPage('backlog')
                updateIsCommonDrawer(newState?.id);
            }
            if (newState?.type === "edit") {
                updateIsWorkitemDrawer(newState?.id);
            }
            if (newState?.type === "delete") {
                deleteRecord(newState?.id);
            }
            if (newState?.type === "email") {
                updateIsMailDrawer(true);
            }
            if (newState?.type === "copy") {
                updateIsClone(true);
                updateIsWorkitemDrawer(newState?.id);
            }
        }
        else if (from === "todo") {
            if (newState?.type === "view") {
                updateFromPage('todo')
                updateIsCommonDrawer(newState?.id);
            }
            if (newState?.type === "edit") {
                updateIsTodoDrawer(newState?.id);
            }
            if (newState?.type === "delete") {
                deleteRecord(newState?.id);
            }
        }
        else if (from === "retrospective") {
            if (newState?.type === "view") {
                updateFromPage('retrospective')
                updateIsCommonDrawer(newState?.id);
            }
            if (newState?.type === "edit") {
                updateIsRetrospectiveDrawer(newState?.id);
            }
            if (newState?.type === "delete") {
                deleteRecord(newState?.id);
            }
        }
        else if (from === "risk") {
            if (newState?.type === "view") {
                updateFromPage('risk')
                updateIsCommonDrawer(newState?.id);
            }
            if (newState?.type === "edit") {
                updateIsRiskDrawer(newState?.id);
            }
            if (newState?.type === "delete") {
                deleteRecord(newState?.id);
            }
        }
        else if (from === "assumption") {
            if (newState?.type === "view") {
                updateFromPage('assumption')
                updateIsCommonDrawer(newState?.id);
            }
            if (newState?.type === "edit") {
                updateIsAssumptionDrawer(newState?.id);
            }
            if (newState?.type === "delete") {
                deleteRecord(newState?.id);
            }
        }
        else if (from === "issue") {
            if (newState?.type === "view") {
                updateFromPage('issue')
                updateIsCommonDrawer(newState?.id);
            }
            if (newState?.type === "edit") {
                updateIsIssueDrawer(newState?.id);
            }
            if (newState?.type === "delete") {
                deleteRecord(newState?.id);
            }
        }
        else if (from === "dependency") {
            if (newState?.type === "view") {
                updateFromPage('dependency')
                updateIsCommonDrawer(newState?.id);
            }
            if (newState?.type === "edit") {
                updateIsDependencyDrawer(newState?.id);
            }
            if (newState?.type === "delete") {
                deleteRecord(newState?.id);
            }
        }
    };


    const handleMoreClick = (id) => {
        // console.log('isDropdownOpen ', isDropdownOpen, ' ', id);
        setIsDropdownOpen(isDropdownOpen ? null : id);
    };

    const handleSelect = (item) => {
        // console.log('Selected Item:', item);
        onUpdate(item);
    };

    const onUpdate = async (item) => {
        const endpoint = baseURL + `${from}?slug=${slug}`;
        let data = {};
        Object.assign(data, { updatedBy: session.data.email });
        Object.assign(data, { _id: item?.id });
        Object.assign(data, { projectName: projectName });
        if (item?.name === "status") {
            Object.assign(data, { status: item?.value });
        }
        if (item?.name === "workItemType") {
            Object.assign(data, { workItemType: item?.value });
        }
        if (item?.name === "priority") {
            Object.assign(data, { priority: item?.value });
        }
        if (item?.name === "assignee") {
            let fullName = getFirstNameByEmail(data.assignee);
            Object.assign(data, { fullName: fullName });
            Object.assign(data, { assignee: item?.value });
        }
        if (item?.name === "storyPoints") {
            Object.assign(data, { storyPoints: item?.value });
        }
        if (item?.name === "tShirtSize") {
            Object.assign(data, { tShirtSize: item?.value });
        }
        if (item?.name === "startDate") {
            Object.assign(data, { startDate: JSON.parse(item?.value) });
        }
        if (item?.name === "dueDate") {
            Object.assign(data, { dueDate: JSON.parse(item?.value) });
        }
        if (item?.name === "sprintName") {
            Object.assign(data, { sprintName: item?.value });
        }
        try {
            const method = "put";
            const { data: responseData } = await axios[method](endpoint, data);
            if (from === "backlog" || from === "todo" || from === "risk" || from === "assumption" || from === "dependency" || from === "issue") {
                const filteredTasks = responseData.filter(task => task.status === column.id);
                setTaskList(filteredTasks);
            }
            if (from === "retrospective") {
                const filteredTasks = responseData.filter(task => task.retrospectiveCategory === column.id);
                setTaskList(filteredTasks);
            }
        } catch (error) {
            handleApiError(error);
        }

    }

    const handleApiError = (error) => {
        const errorMessage =
            error.status === 401 || error.status === 403 || error.status === 500
                ? error?.response?.data?.error || "An unexpected error occurred."
                : "Sorry....the backend server is down!! Please try again later";

        if (error?.response?.data?.error) {
            toast.error(error?.response?.data?.error, {
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
        } else {
            toast.error(errorMessage, {
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

        }

        if (error?.response?.data?.message) {
            toast.error(error.response.data.message, {
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
        }

        console.log(error);
    };

    useEffect(() => {
        setTaskList(taskList);
    }, [taskList])

    useEffect(() => {
        // console.log('tasks ', tasks);
        setTaskList(tasks);
    }, [tasks])

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit();
            setInputValue('');
        }
    };

    const getFirstNameByEmail = (email) => {
        const teamMember = members.find(member => member.email === email);
        return teamMember ? teamMember.fullName : null;
    }

    const onSubmit = async () => {
        // console.log(data);
        let data = {}
        if (from === "backlog" || from === "todo" || from === "risk" || from === "assumption" || from === "dependency" || from === "issue") {
            Object.assign(data, { summary: inputValue });
            Object.assign(data, { status: column?.id });
        }
        if (from === "retrospective") {
            Object.assign(data, { retrospectiveDetails: inputValue });
            Object.assign(data, { retrospectiveCategory: column?.id });
        }
        Object.assign(data, { userId: session?.data?._id });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { projectSlug: slug });
        Object.assign(data, { projectName: projectName });
        Object.assign(data, { lastModifiedBy: session.data.email });
        Object.assign(data, { createdBy: session.data.fullName });
        if (data.assignee) {
            let fullName = getFirstNameByEmail(data.assignee);
            Object.assign(data, { fullName: fullName });
        }
        try {
            const endpoint = baseURL + `${from}?slug=${slug}`;
            let method;

            if (from === "backlog") {
                // const item = wsteps.find(item => item.name === "Product Backlog");
                // const stepId = item?._id;
                const item = backlogSteps.find(item => item.name === "Product Backlog");
                const stepId = item?._id;
                Object.assign(data, { stepId: stepId });
                Object.assign(data, { backlogType: "WorkItem" });
                Object.assign(data, { backlogTypeName: "Product Backlog" });
                Object.assign(data, { backlogKey: key + "-WORK-" });
            }
            if (from === "risk") {
                Object.assign(data, { key: key + "-RISK-" });
            }
            if (from === "assumption") {
                Object.assign(data, { key: key + "-ASSU-" });
            }
            if (from === "dependency") {
                Object.assign(data, { key: key + "-DEPE-" });
            }
            if (from === "issue") {
                Object.assign(data, { key: key + "-ISSU-" });
            }
            // console.log('Work item data ', data);
            method = "post";
            const { data: responseData } = await axios[method](endpoint, data);
            if (from === "backlog") {
                updateBacklogList(responseData);
            }
            else if (from === "todo") {
                updatedTodoList(responseData);
            }
            else if (from === "retrospective") {
                updateRetrospectiveList(responseData);
            }
            else if (from === "risk") {
                updateRiskList(responseData);
            }
            else if (from === "assumption") {
                updateAssumptionList(responseData);
            }
            else if (from === "dependency") {
                updateDependencyList(responseData);
            }
            else if (from === "issue") {
                updateIssueList(responseData);
            }
            // console.log('responseData ', responseData);
            const filteredTasks = responseData.filter(task => task.status === column.id);
            setTaskList(filteredTasks);
        } catch (error) {
            console.log('error ', error);
        }
    };

    useEffect(() => {
        setIsLoading(false);
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleMenuClickOutside);
        return () => {
            document.removeEventListener('click', handleMenuClickOutside);
        };
    }, []);

    const handleAddNewItem = () => {
        setIsAddNewItem(true);
    }

    const handleClickOutside = (event) => {
        if (refNewItemBox.current && !refNewItemBox.current.contains(event.target)) {
            setIsAddNewItem(false);
        }
    };

    const handleMenuClickOutside = (event) => {
        if (refMenuItem.current && !refMenuItem.current.contains(event.target)) {
            // console.log('refMenuItem.current ', refMenuItem.current);
            // setIsDropdownOpen(null);
        }
    };

    const filterByName = (name) => {
        const options = localForm.filter(field => field.name === name);
        const optionList = options[0].optionList;
        return optionList;
    };

    const deleteRecord = (id) => {
        // console.log('deleteRecord ', rows?._id);
        updateIsWorkitemDrawer(false);
        updateIsTodoDrawer(false);
        updateIsRetrospectiveDrawer(false);
        updateIsRiskDrawer(false);
        updateIsAssumptionDrawer(false);
        updateIsDependencyDrawer(false);
        updateIsIssueDrawer(false);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this Work item?',
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
            url: baseURL + `${from}?slug=${slug}`,
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
                if (from === "backlog") {
                    updateBacklogList(response?.data);
                }
                else if (from === "todo") {
                    updatedTodoList(response?.data);
                }
                else if (from === "retrospective") {
                    updateRetrospectiveList(response?.data);
                }
                else if (from === "risk") {
                    updateRiskList(response?.data);
                }
                else if (from === "assumption") {
                    updateAssumptionList(response?.data);
                }
                else if (from === "issue") {
                    updateDependencyList(response?.data);
                }
                else if (from === "dependency") {
                    updateIssueList(response?.data);
                }
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

    const remainingDays = (dueDate) => {
        const parsedDueDate = new Date(dueDate);
        const timeDifference = parsedDueDate.getTime() - currentDate.getTime();
        const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return dayDifference;
    }

    return (
        <>
            {column && (
                <div className="flex flex-col rounded-3px">
                    <div className="p-2 text-[15px] uppercase mr-6 max-h-[100px] text-center border shadow-md min-w-[23vw] bg-blue-100 font-semibold" >
                        {column.title} ({taskList?.length})
                    </div>
                    <div>
                        {!isLoading && (
                            <Droppable droppableId={column.id}>
                                {(droppableProvided, droppableSnapshot) => (
                                    <div
                                        className="flex flex-col flex-1 mt-2"
                                        ref={droppableProvided.innerRef}
                                        {...droppableProvided.droppableProps}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    // style={{ backgroundColor: droppableSnapshot.isDraggingOver ? '' : '#f1f5f9' }}
                                    >
                                        {taskList.map((task, index) => (
                                            <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                                {(draggableProvided, draggableSnapshot) => (
                                                    <div
                                                        className={`flex bg-card-bg rounded-3px pt-2 justify-center ${draggableSnapshot.isDragging ? 'outline-2px solid card-border' : 'outline-transparent'
                                                            } ${draggableSnapshot.isDragging ? 'shadow-none' : 'shadow-none'
                                                            }`}
                                                        ref={draggableProvided.innerRef}
                                                        {...draggableProvided.draggableProps}
                                                        {...draggableProvided.dragHandleProps}
                                                    >

                                                        <div>
                                                            <div className="bg-white -ml-6 mb-2 min-w-[23vw] max-w-[23vw] rounded-lg border shadow-sm group relative">
                                                                <div className="relative">
                                                                    <span
                                                                        className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                        onClick={() => handleMoreClick(task.id)}
                                                                        ref={refMenuItem}
                                                                    >
                                                                        <MoreVertIcon fontSize="small" />
                                                                    </span>
                                                                    <div >
                                                                        {isDropdownOpen === task.id && (
                                                                            <MoreEvent
                                                                                taskId={task.id}
                                                                                createdOn={task.createdAt}
                                                                                updatedOn={task.updatedAt}
                                                                                handleCloseMoreClick={handleCloseMoreClick}
                                                                                from={from}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="p-3">
                                                                    {from === "backlog" && (
                                                                        <div className="text-[13.5px] font-medium text-blue-500">
                                                                            {task?.backlogKey}
                                                                        </div>
                                                                    )}
                                                                    {(from === "risk" || from === "assumption" || from === "issue" || from === "dependency") && (
                                                                        <div className="text-[13.5px] font-medium text-blue-500">
                                                                            {task?.key}
                                                                        </div>
                                                                    )}
                                                                    {(from === "backlog" || from === "todo" || from === "risk" || from === "assumption" || from === "issue" || from === "dependency") && (
                                                                        <div className="mt-1 text-[14px] font-medium">{task?.summary}</div>
                                                                    )}
                                                                    {(from === "retrospective") && (
                                                                        <div>
                                                                            <div className="mt-1 text-[14px] font-medium text-blue-500">{task?.sprintName}</div>
                                                                            <div className="mt-1 text-[14px] font-medium">{task?.retrospectiveDetails}</div>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex flex-wrap mt-5 justify-start">
                                                                        {(from === "retrospective") && (
                                                                            <div className="flex flex-wrap mt-5 justify-start">
                                                                                <div className="mr-2 mt-2">
                                                                                    <Dropdown
                                                                                        items={sprints}
                                                                                        sprint={task?.sprintName}
                                                                                        onSelect={handleSelect}
                                                                                        type="sprintName"
                                                                                        id={task?._id}
                                                                                    />
                                                                                </div>
                                                                                {column?.id === "Ideas for Improvement" && (
                                                                                    <div className="mr-2 mt-2">
                                                                                        <Dropdown
                                                                                            items={members}
                                                                                            members={members}
                                                                                            onSelect={handleSelect}
                                                                                            type="assignee"
                                                                                            id={task?._id}
                                                                                            assignee={task?.assignee}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {(from === "risk" || from === "assumption" || from === "issue") && (
                                                                            <div className="flex flex-wrap">
                                                                                <div className="mr-2 mt-2">
                                                                                    <Dropdown
                                                                                        items={members}
                                                                                        members={members}
                                                                                        onSelect={handleSelect}
                                                                                        type="assignee"
                                                                                        id={task?._id}
                                                                                        assignee={task?.assignee}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {(from === "risk" || from === "issue") && (
                                                                            <div className="flex flex-wrap">
                                                                                <div className="mr-2 mt-2">
                                                                                    <Dropdown
                                                                                        items={filterByName("priority")}
                                                                                        onSelect={handleSelect}
                                                                                        type="priority"
                                                                                        id={task?._id}
                                                                                        priority={task?.priority}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {(from === "backlog" || from === "todo") && (
                                                                            <div className="flex flex-wrap mt-5 justify-start">
                                                                                {from === "backlog" && (
                                                                                    <div className="mr-2 mt-2">
                                                                                        <Dropdown
                                                                                            items={filterByName("workItemType")}
                                                                                            onSelect={handleSelect}
                                                                                            type="workItemType"
                                                                                            id={task?._id}
                                                                                            workItemType={task?.workItemType}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                                <div className="flex flex-wrap">
                                                                                    <div className="mr-2 mt-2">
                                                                                        <Dropdown
                                                                                            items={filterByName("priority")}
                                                                                            onSelect={handleSelect}
                                                                                            type="priority"
                                                                                            id={task?._id}
                                                                                            priority={task?.priority}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="mr-2 mt-2">
                                                                                        <Dropdown
                                                                                            items={members}
                                                                                            members={members}
                                                                                            onSelect={handleSelect}
                                                                                            type="assignee"
                                                                                            id={task?._id}
                                                                                            assignee={task?.assignee}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    {from === "backlog" && (
                                                                                        <div className="flex flex-wrap">
                                                                                            <div className="mr-2 mt-2">
                                                                                                <Dropdown
                                                                                                    items={filterByName("storyPoints")}
                                                                                                    onSelect={handleSelect}
                                                                                                    type="storyPoints"
                                                                                                    id={task?._id}
                                                                                                    storyPoints={task?.storyPoints}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="mr-2 mt-2">
                                                                                                <Dropdown
                                                                                                    items={filterByName("tShirtSize")}
                                                                                                    onSelect={handleSelect}
                                                                                                    type="tShirtSize"
                                                                                                    id={task?._id}
                                                                                                    tShirtSize={task?.tShirtSize}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex mt-[2px] flex-wrap">
                                                                                    <div className="mr-2 mt-2">
                                                                                        <Dropdown
                                                                                            onSelect={handleSelect}
                                                                                            type="dueDate"
                                                                                            id={task?._id}
                                                                                            dueDates={task?.dueDate}
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        {task?.dueDate !== undefined && (
                                                                                            <div className={`text-[13px] font-semibold mt-2 ${remainingDays(task?.dueDate) >= 1 ? 'text-green-500' : 'text-red-500'}`}>
                                                                                                <Tooltip title="Days remaining until the due date" arrow placement="top">
                                                                                                    {remainingDays(task?.dueDate)}D
                                                                                                </Tooltip>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {(from === "risk" || from === "dependency" || from === "issue") && (
                                                                            <div className="flex mt-[2px] flex-wrap">
                                                                                <div className="mr-2 mt-2">
                                                                                    <Dropdown
                                                                                        onSelect={handleSelect}
                                                                                        type="dueDate"
                                                                                        id={task?._id}
                                                                                        dueDates={task?.dueDate}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    {task?.dueDate !== undefined && (
                                                                                        <div className={`text-[13px] font-semibold mt-2 ${remainingDays(task?.dueDate) >= 1 ? 'text-green-500' : 'text-red-500'}`}>
                                                                                            <Tooltip title="Days remaining until the due date" arrow placement="top">
                                                                                                {remainingDays(task?.dueDate)}D
                                                                                            </Tooltip>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}

                                        {isAddNewItem ? (
                                            <div ref={refNewItemBox} className="ml-2">
                                                <div className="bg-white -ml-2 mb-3 min-w-[23vw] max-w-[23vw] min-h-[120px] my-3 rounded-lg border shadow-sm group relative">
                                                    <div className="p-3">
                                                        {from === "backlog" && (
                                                            <div className="text-sm text-blue-500">
                                                                {key}
                                                            </div>
                                                        )}
                                                        <div className="my-2">
                                                            <input
                                                                type="text"
                                                                className="border-none focus:outline-none min-w-[20vw] max-w-[20vw]"
                                                                placeholder="Enter summary"
                                                                value={inputValue}
                                                                onChange={handleInputChange}
                                                                onKeyDown={handleKeyPress}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-[13px] bg-slate-200 px-4 py-1 absolute bottom-0 min-w-[100%]">
                                                        Press <b>Enter</b> to add another work item
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="ml-5 mt-5 cursor-pointer">
                                                <div className="flex text-slate-400" onClick={() => handleAddNewItem()}>
                                                    <AddIcon sx={{ fontSize: 20 }} className="mr-1 mt-[3px] text-slate-400" />
                                                    Add
                                                </div>
                                            </div>
                                        )}
                                        {droppableProvided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )}

                    </div>

                </div >
            )}

        </>

    );
};

export default Column;
