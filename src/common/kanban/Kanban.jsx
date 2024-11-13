"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import useAppStore from '@/store/appStore';
import { DragDropContext } from "react-beautiful-dnd";
import Skeleton from '@mui/material/Skeleton';
import useSlug from "@/app/scale/layout/hooks/useSlug";

const Column = dynamic(() => import('./Column'),
    {
        loading: () => <Skeleton variant="rounded" width="100%" height="100px" />,
        ssr: false
    }
);

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
    const newTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = newTaskIds.splice(startIndex, 1);
    newTaskIds.splice(endIndex, 0, removed);

    const newColumn = {
        ...sourceCol,
        taskIds: newTaskIds,
    };

    return newColumn;
};

export default function Kanban({ rows, steps, from }) {
    const [state, setState] = useState(initialData(rows, steps, from));
    const baseURL = '/api/';
    const { updateRiskList } = useAppStore();
    const [winReady, setwinReady] = useState(false);
    const { slug } = useSlug();

    useEffect(() => {
        setTimeout(() => {
            setwinReady(true);
        }, 1500);
    }, []);

    const updateStatus = (id, changedStatus) => {

        let endpoint = '';
        if (from === "iretrospective") {
            endpoint = baseURL + `retrospective?slug=${slug}`;
        }
        else if (from === "irisk") {
            endpoint = baseURL + `risk?slug=${slug}`;
        }
        else if (from === "iassumption") {
            endpoint = baseURL + `assumption?slug=${slug}`;
        }
        else {
            endpoint = baseURL + `${from}?slug=${slug}`;
        }
        let data = '';

        if (from === "retrospective") {
            data = { _id: id, retrospectiveCategory: changedStatus };
        }
        if (from === "risk") {
            data = { _id: id, action: changedStatus };
        }
        if (from === "iretrospective" || from === "irisk" || from === "iassumption") {
            data = { _id: id, ideasForImprovement: changedStatus };
        }

        if (from === "assumption" || from === "dependency" || from === "issue") {
            data = { _id: id, status: changedStatus };
        }

        let config = {
            method: 'put',
            url: endpoint,
            data: data
        };

        axios.request(config)
            .then(response => {
                console.log('Response ', response);
                // if (from === "risk") {
                //     updateRiskList(response);
                // }
            })
            .catch(err => {
                console.log('Error ', err);
            })
    }




    const onDragEnd = async (result) => {

        const { destination, source } = result;

        // If user tries to drop in an unknown destination
        if (!destination) return;

        // if the user drags and drops back in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        console.log('Result ', result);

        let userId = result.draggableId;
        // console.log('draggableId ', userId);

        let newLeadStatus = result?.destination?.droppableId;
        // console.log('newLeadStatus ', newLeadStatus);
        await updateStatus(userId, newLeadStatus);

        // If the user drops within the same column but in a different positoin
        const sourceCol = state.columns[source.droppableId];
        const destinationCol = state.columns[destination.droppableId];

        if (sourceCol.id === destinationCol.id) {
            const newColumn = reorderColumnList(
                sourceCol,
                source.index,
                destination.index
            );

            const newState = {
                ...state,
                columns: {
                    ...state.columns,
                    [newColumn.id]: newColumn,
                },
            };
            setState(newState);;

            return;
        }

        // If the user moves from one column to another
        const startTaskIds = Array.from(sourceCol.taskIds);
        const [removed] = startTaskIds.splice(source.index, 1);
        const newStartCol = {
            ...sourceCol,
            taskIds: startTaskIds,
        };

        const endTaskIds = Array.from(destinationCol.taskIds);
        endTaskIds.splice(destination.index, 0, removed);
        const newEndCol = {
            ...destinationCol,
            taskIds: endTaskIds,
        };

        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol,
            },
        };

        setState(newState);
    };

    return (
        <>
            {winReady ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col bg-main-bg w-full text-white-text pb-8">
                        <div className="flex justify-left px-1">
                            {state.columnOrder.map((columnId, index) => {
                                const column = state.columns[columnId];
                                let tasks = [];
                                if (column && column.taskIds) {
                                    tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
                                }
                                return <>
                                    {winReady && <Column key={index} column={column} tasks={tasks} from={from} />}
                                </>;
                            })}
                        </div>
                    </div>
                </DragDropContext>
            ) : (
                <Skeleton variant="rounded" className="mt-10" width="100%" height="450px" />
            )}

        </>

    );
}

const initialData = (rows, steps, from) => {
    const tasks = {};
    const columns = {};
    const columnOrder = [];

    rows.forEach((user, index) => {
        const userId = index + 1;
        tasks[userId] = { ...user, id: user._id };
    });

    //Modifications
    const allTasks = [];
    steps.forEach((step) => {
        allTasks[step] = {};
    });

    // Filter tasks based on 
    if (from === "risk") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.action === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }
    else if (from === "assumption") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.status === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }
    else if (from === "issue") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.status === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }
    else if (from === "dependency") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.status === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }
    else if (from === "retrospective") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.retrospectiveCategory === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }
    else if (from === "iretrospective") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.ideasForImprovement === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }
    else if (from === "irisk") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.ideasForImprovement === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }
    else if (from === "iassumption") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.ideasForImprovement === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }
    else {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.status === step) {
                    allTasks[step][taskId] = task;
                }
            });
        });
    }


    if (from === "risk") {
        rows.forEach((row) => {
            let data = allTasks[row.action];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.action] = {
                        id: row.action,
                        title: row.action,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    }
    else if (from === "assumption") {
        rows.forEach((row) => {
            let data = allTasks[row.status];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.status] = {
                        id: row.status,
                        title: row.status,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    }
    else if (from === "dependency") {
        rows.forEach((row) => {
            let data = allTasks[row.status];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.status] = {
                        id: row.status,
                        title: row.status,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    }
    else if (from === "issue") {
        rows.forEach((row) => {
            let data = allTasks[row.status];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.status] = {
                        id: row.status,
                        title: row.status,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    }
    else if (from === "retrospective") {
        rows.forEach((row) => {
            let data = allTasks[row.retrospectiveCategory];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.retrospectiveCategory] = {
                        id: row.retrospectiveCategory,
                        title: row.retrospectiveCategory,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    }
    else if (from === "iretrospective") {
        rows.forEach((row) => {
            let data = allTasks[row.ideasForImprovement];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.ideasForImprovement] = {
                        id: row.ideasForImprovement,
                        title: row.ideasForImprovement,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    } 
    else if (from === "irisk") {
        rows.forEach((row) => {
            let data = allTasks[row.ideasForImprovement];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.ideasForImprovement] = {
                        id: row.ideasForImprovement,
                        title: row.ideasForImprovement,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    }
    else if (from === "iassumption") {
        rows.forEach((row) => {
            let data = allTasks[row.ideasForImprovement];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.ideasForImprovement] = {
                        id: row.ideasForImprovement,
                        title: row.ideasForImprovement,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    }
    else {
        rows.forEach((row) => {
            let data = allTasks[row.status];
            if (data !== undefined) {
                const taskIdsArray = Object.keys(data).map(Number);
                if (taskIdsArray.length !== 0) {
                    columns[row.status] = {
                        id: row.status,
                        title: row.status,
                        taskIds: taskIdsArray
                    };
                }
            }

        });
    }

    //  Populate columnOrder with statuses
    for (let i = 0; i < steps.length; i++) {
        columnOrder.push(steps[i])
    }

    const notInObject = columnOrder.filter(element => !(element in columns));

    notInObject.forEach(element => {
        columns[element] = {
            id: String(element),
            title: element,
            taskIds: []
        };
    });

    // console.log('kanban tasks ', tasks);
    // console.log('kanban columns ', columns);
    // console.log('kanban columnOrder ', columnOrder);

    return {
        tasks,
        columns,
        columnOrder,
    };
};
