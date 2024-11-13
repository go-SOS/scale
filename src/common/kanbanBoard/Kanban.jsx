"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";
import Skeleton from '@mui/material/Skeleton';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import useAppStore from '@/store/appStore';

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
    const { updateBacklogSteps, updateIsClone } = useAppStore();
    const baseURL = '/api/';
    const [winReady, setwinReady] = useState(false);
    const { slug } = useSlug();
    const [workflows, setWorkflows] = useState([]);
    const [localForm, setLocalForm] = useState(null);
    const [members, setMembers] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [wsteps, setWSteps] = useState([]);

    const getWorkflow = async () => {
        if (from === "retrospective") {
            let kanbanStages = [
                {
                    "stageName": "What Went Well",
                },
                {
                    "stageName": "What Didn't Go Well",
                },
                {
                    "stageName": "Ideas for Improvement",
                }
            ];
            setWorkflows(kanbanStages);
            setwinReady(true);

        } else if (from === "risk") {
            let kanbanStages = [
                {
                    "stageName": "Open",
                },
                {
                    "stageName": "Owned",
                },
                {
                    "stageName": "Escalated",
                },
                {
                    "stageName": "Accepted",
                },
                {
                    "stageName": "Mitigated",
                },
                {
                    "stageName": "Resolved",
                },
                {
                    "stageName": "Duplicate",
                }
            ];
            setWorkflows(kanbanStages);
            setwinReady(true);
        } else if (from === "assumption") {
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
            setWorkflows(kanbanStages);
            setwinReady(true);
        } else if (from === "issue") {
            let kanbanStages = [
                {
                    "stageName": "Open",
                },
                {
                    "stageName": "Assigned",
                },
                {
                    "stageName": "In Progress",
                },
                {
                    "stageName": "Closed",
                },
                {
                    "stageName": "Duplicate",
                }
            ];
            setWorkflows(kanbanStages);
            setwinReady(true);
        } else if (from === "dependency") {
            let kanbanStages = [
                {
                    "stageName": "Open",
                },
                {
                    "stageName": "Assigned",
                },
                {
                    "stageName": "Monitoring",
                },
                {
                    "stageName": "Closed",
                }
            ];
            setWorkflows(kanbanStages);
            setwinReady(true);
        }
        else {
            let posturl = `${baseURL}workflow?name=${from}`;

            try {
                const response = await axios.get(posturl);
                const stages = response?.data[0]?.stages;
                const stageNames = stages.map(stage => stage.stageName);
                setWorkflows(stageNames);
                setwinReady(true);
            } catch (error) {
                console.error("Error", error);
            }
        }

    };

    const getMasterData = async () => {
        let posturl = '';

        if (from === "backlog") {
            posturl = baseURL + "backlogmaster";
        } else if (from === "todo") {
            posturl = baseURL + "todomaster";
        } else if (from === "retrospective") {
            posturl = baseURL + "retrospectivemaster";
        } else if (from === "risk") {
            posturl = baseURL + "riskmaster";
        } else if (from === "issue") {
            posturl = baseURL + "issuemaster";
        } else if (from === "assumption") {
            posturl = baseURL + "assumptionmaster";
        } else if (from === "dependency") {
            posturl = baseURL + "dependencymaster";
        }

        if (posturl) {
            try {
                const res = await axios.get(posturl);
                const data = res?.data[0];
                if (from === "backlog") {
                    setLocalForm(data?.backlogs);
                } else if (from === "todo") {
                    setLocalForm(data?.todos);
                }
                else if (from === "retrospective") {
                    setLocalForm(data?.retrospective);
                } else if (from === "risk") {
                    setLocalForm(data?.risks);
                } else if (from === "assumption") {
                    setLocalForm(data?.assumptions);
                } else if (from === "issue") {
                    setLocalForm(data?.issues);
                } else if (from === "dependency") {
                    setLocalForm(data?.dependencies);
                }
                getWorkflow();
            } catch (err) {
                console.log(err);
            }
        }
    };


    const getData = async () => {
        let posturl = baseURL + `assignee?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setMembers(res.data);
                getMasterData();
            })
            .catch((err) => {
                console.log(err);
            });
        if (from === "retrospective") {
            let posturl = baseURL + `sprint?slug=${slug}`;
            await axios
                .get(posturl)
                .then((res) => {
                    let records = res.data;
                    const sprintArray = records.map(record => record.name);
                    // console.log('sprintArray ', sprintArray);
                    setSprints(sprintArray);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const getSteps = async () => {
        let posturl = baseURL + `steps?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                updateBacklogSteps(res.data);
                const stepsArray = res.data.map(item => item.name).reverse();
                setWSteps(stepsArray);
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


    useEffect(() => {
        updateIsClone(false);
        getSteps();
    }, []);

    const updateLeadStatus = (id, changedStatus) => {
        // console.log('changedStatus id ', id);
        // console.log('changedStatus ', changedStatus);

        const endpoint = baseURL + `${from}?slug=${slug}&id=${id}`;
        let data = '';
        if (from === "backlog" || from === "todo" || from === "risk" || from === "assumption" || from === "issue" || from === "dependency") {
            data = { _id: id, status: changedStatus };
        }
        if (from === "retrospective") {
            data = { _id: id, retrospectiveCategory: changedStatus };
        }

        let config = {
            method: 'put',
            url: endpoint,
            data: data
        };

        axios.request(config)
            .then(response => {
                // console.log('Response ', response);
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

        // console.log('Result ', result);

        let userId = result.draggableId;
        // console.log('draggableId ', userId);

        let newLeadStatus = result?.destination?.droppableId;
        // console.log('newLeadStatus ', newLeadStatus);
        await updateLeadStatus(userId, newLeadStatus);

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
                <div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div
                            className={`flex flex-col bg-main-bg w-full text-white-text pb-8  ${(from === "todo" || from === "backlog") ? "min-h-[59vh]" : "min-h-[100px]"} `}>
                            <div className="flex justify-left px-1">
                                {state.columnOrder.map((columnId, index) => {
                                    const column = state.columns[columnId];
                                    let tasks = [];
                                    if (column && column.taskIds) {
                                        tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
                                    }
                                    return <>
                                        {winReady &&
                                            <Column
                                                key={index}
                                                column={column}
                                                tasks={tasks}
                                                from={from}
                                                workflows={workflows}
                                                localForm={localForm}
                                                members={members}
                                                sprints={sprints}
                                                wsteps={wsteps}
                                            />
                                        }
                                    </>;
                                })}
                            </div>
                        </div>
                    </DragDropContext>
                </div>
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
    if (from === "retrospective") {
        steps.forEach((step) => {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                if (task.retrospectiveCategory === step) {
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


    if (from === "retrospective") {
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
