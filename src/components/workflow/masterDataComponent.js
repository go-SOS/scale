"use client";
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Skeleton from '@mui/material/Skeleton';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import axios from "axios";
import useAppStore from '@/store/appStore';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { usePathname } from 'next/navigation';


const MasterDataComponent = ({ masterData }) => {
    const baseURL = '/api/';
    const { userId } = useAppStore();
    const { updateIsWorkflowDrawer, updatedIsKanbanRefresh } = useAppStore();
    const [winReady, setwinReady] = useState(false);
    const [data, setData] = useState([]);
    const [transformedData, setTransformedData] = useState([]);
    const [editmode, setEditMode] = useState(null);
    const [addMode, setAddMode] = useState(false);
    const [label, setLabel] = useState('');
    const currentPath = usePathname();
    const [from, setFrom] = useState('');

    useEffect(() => {
        // console.log('masterData ', masterData);
        const newData = masterData.map(item => ({ label: item }));
        setData(newData);
        setTransformedData(newData);
        setTimeout(() => {
            setwinReady(true);
        }, 500);
    }, []);

    useEffect(() => {
        const slug = currentPath.split("/")[3];
        console.log('masterData data ', slug);
        if (slug === "project-todo") {
            setFrom("todo");
        } else {
            setFrom("backlog");
        }

    }, [currentPath]);


    const onDragEnd = (result) => {
        if (!result.destination) return;

        // if the user drags and drops back in the same position
        if (
            result.destination.droppableId === result.source.droppableId &&
            result.destination.index === result.source.index
        ) {
            return;
        }

        const newRows = Array.from(data);
        const [movedRow] = newRows.splice(result.source.index, 1);
        newRows.splice(result.destination.index, 0, movedRow);
        setData(newRows);

        handleUpdate(newRows);

    };

    const handleUpdate = (newRows) => {
        const originalData = newRows.map(item => ({ stageName: item.label }));
        // console.log('masterdata Result ', originalData);

        let config = {
            method: 'put',
            url: `${baseURL}workflow?name=${from}`,
            data: { userId: userId, stages: originalData }
        };

        axios.request(config)
            .then(response => {
                // console.log('Response ', response?.data);
                // const kanbanStages = response?.data[0]?.stages;
                // if (kanbanStages !== undefined && kanbanStages.length !== 0) {
                //     const stages = kanbanStages.map(stage => stage.stageName);
                // }
            })
            .catch(err => {
                console.log('Error ', err);
            })

    }

    const handleDelete = (item) => {
        updateIsWorkflowDrawer(false);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this record?',
            buttons: [
                {
                    label: 'Yes',
                    // onClick: () => deleteRow(item)
                    onClick: () => handleRemoveItem(item)
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const handleRemoveItem = async (item) => {
        const itemToRemove = item;
        const updatedFields = data.filter(item => item.label !== itemToRemove.label);
        setData(updatedFields);
        await handleUpdate(updatedFields);
        updatedIsKanbanRefresh(true);
        toast.success('Deleted successfully!', {
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

    const handleEditMode = (data) => {
        if (editmode === null) {
            setEditMode(data);
        }
    }

    const handleRowUpdate = () => {
        handleUpdate(data);
        setEditMode(null);
    }

    const handleLabelInputChange = (index) => (e) => {
        const updatedDatas = [...data];
        updatedDatas[index].label = e.target.value;
        setData(updatedDatas);
    };

    const handleCloseEditMode = () => {
        setEditMode(null);
        setData(transformedData);
    };

    const handleSave = async () => {
        // console.log('dataArray ', dataArray);
        const newRow = {
            label: label,
        };
        // Create a new array with the added row
        const newDatas = [...data, newRow];
        // Update the state with the new array
        setData(newDatas);
        await handleUpdate(newDatas);
        setAddMode(false);
        scrollToBottom();
        toast.success(label + 'added successfully!', {
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

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };

    return (
        <div>
            <div className="flex justify-end mt-10 mb-5">
                <div className="flex">
                    <button
                        className={`px-3 py-1 mr-1 max-h-8 min-w-[200px] mt-4 ${addMode ? 'pulsebuttonblueDisabled' : 'pulsebuttonblue'}`}
                        onClick={() => setAddMode(true)}
                        disabled={addMode}
                    >
                        <AddCircleOutlineIcon className="w-5 h-5" />
                        <span>Add Stage</span>
                    </button>
                </div>
            </div>

            <div>
                {addMode && (
                    <div>
                        <div className="bg-white rounded-md min-h-3 mb-4 shadow-md">
                            <div className="flex p-2 justify-between">
                                <div className="flex items-center justify-center">
                                    <div className="flex items-center min-w-[25vw]">
                                        <div className="ml-9 -mt-1 min-w-[16vw] py-1">
                                            <label htmlFor="datalabel" className="block text-sm text-gray-600 font-semibold">
                                                Stage
                                            </label>
                                            <input
                                                type="text"
                                                value={label}
                                                onChange={(e) => setLabel(e.target.value)}
                                                placeholder="Enter Stage"
                                                className={`mt-1 p-1 border border-gray-300 text-sm rounded-md focus:border-blue-500 focus:outline-none`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div>
                                        <div className="mr-2 cursor-pointer">
                                            <button
                                                disabled={editmode !== null}
                                                onClick={() => handleSave()}
                                                className={`text-green-600 px-3 rounded-[6px] border border-green-600 mr-2 cursor-pointer hover:bg-green-600 hover:text-white ${editmode !== null ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mr-1">
                                        <button
                                            onClick={() => setAddMode(false)}
                                            className="text-orange-600 px-3 rounded-[6px] border border-orange-600 mr-2 cursor-pointer hover:bg-orange-600 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                {winReady ? <div>
                    <Droppable droppableId="dataList" type="DATA">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {data.map((item, index) => (
                                    <Draggable key={index} draggableId={`data-${index}`} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >

                                                <div key={index}>
                                                    <div className="bg-white rounded-md min-h-3 mb-4 shadow-md">

                                                        <div className="flex p-2 justify-between">
                                                            <div className="flex items-center justify-center">
                                                                <div>
                                                                    <DragIndicatorIcon className="text-slate-700" />
                                                                </div>
                                                                <div className="flex items-center min-w-[25vw]">
                                                                    {editmode === index ? (
                                                                        <div className="ml-3 -mt-1 min-w-[16vw] py-1">
                                                                            <label htmlFor={item.label} className="block text-sm text-gray-600 font-semibold">
                                                                                {item.label}
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                id={`labelInput-${index}`}
                                                                                name={`labelInput-${index}`}
                                                                                value={item.label}
                                                                                onChange={handleLabelInputChange(index)}
                                                                                placeholder="Enter label"
                                                                                className={`mt-1 p-1 border border-gray-300 text-sm rounded-md focus:border-blue-500 focus:outline-none`}
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="ml-3 text-sm text-blue-600 min-w-[16vw]">
                                                                            {item.label}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-center">
                                                                <div>
                                                                    {editmode !== index && (
                                                                        <div className="mr-2 cursor-pointer">
                                                                            {item.label !== "To Do" ? (
                                                                                <div>
                                                                                    <button
                                                                                        onClick={() => { handleEditMode(index) }}
                                                                                        disabled={editmode !== null}
                                                                                        className={`text-blue-600 px-3 rounded-[6px] border border-blue-600 mr-2 cursor-pointer hover:bg-blue-600 hover:text-white ${editmode !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="min-w-200px"></div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    {editmode === index && (<div className="mr-3 cursor-pointer" onClick={() => { handleRowUpdate() }}>
                                                                        <CheckCircleOutlineRoundedIcon className="text-green-600" sx={{ fontSize: 27 }} />
                                                                    </div>)}
                                                                </div>
                                                                <div>
                                                                    {editmode === index && (<div className="mr-3 cursor-pointer" onClick={() => { handleCloseEditMode() }}>
                                                                        <CancelRoundedIcon className="text-slate-700" sx={{ fontSize: 27 }} />
                                                                    </div>)}
                                                                </div>
                                                                {item.label !== "To Do" ? (
                                                                    <div>
                                                                        <div className="mr-1">
                                                                            <button onClick={() => { handleDelete(item) }}
                                                                                className={`text-orange-600 px-3 rounded-[6px] border border-orange-600 mr-2 cursor-pointer hover:bg-orange-600 hover:text-white`}>
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="min-w-200px"></div>
                                                                )}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div> : <div>
                    <Skeleton variant="rounded" className="mt-10" width="500px" height="40px" />
                    <Skeleton variant="rounded" className="mt-4" width="500px" height="40px" />
                    <Skeleton variant="rounded" className="mt-4" width="500px" height="40px" />
                    <Skeleton variant="rounded" className="mt-4" width="500px" height="40px" />
                    <Skeleton variant="rounded" className="mt-4" width="500px" height="40px" />
                    <Skeleton variant="rounded" className="mt-4" width="500px" height="40px" />
                    <Skeleton variant="rounded" className="mt-4" width="500px" height="40px" />
                    <Skeleton variant="rounded" className="mt-4" width="500px" height="40px" />
                </div>
                }

            </DragDropContext >

        </div >
    );
};

export default MasterDataComponent;
