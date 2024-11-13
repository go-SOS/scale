"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DragDropContext } from "react-beautiful-dnd";
import Skeleton from '@mui/material/Skeleton';
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

export default function DragAndDrop({
    recentBacklogs,
    recentRisks,
    recentAssumptions,
    recentIssues,
    recentDependencies,
    backlogMaster,
    riskMaster,
    assumptionMaster,
    issueMaster,
    dependencyMaster,
    dashboardStateProp
}) {
    const [state, setState] = useState(dashboardStateProp);
    const [winReady, setwinReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { updateDashboardState, dashboardState } = useAppStore();

    useEffect(() => {
        // console.log('dashboardState ', dashboardState);
        if (dashboardState) {
            setState(dashboardState);
            setIsLoading(false);
        }
    }, [dashboardState]);

    useEffect(() => {
        // console.log('dashboardState ', dashboardState);
        setTimeout(() => {
            setwinReady(true);
        }, 500);
    }, []);


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
            setState(newState);
            // console.log('dashboardState newState start ', newState);
            updateDashboardState(newState);
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
        // console.log('dashboardState newState end ', newState);
        updateDashboardState(newState);
    };

    return (
        <div>
            {!isLoading ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col bg-main-bg min-h-screen w-full text-white-text pb-8">
                        <div className="flex justify-between">
                            {state.columnOrder.map((columnId) => {
                                const column = state.columns[columnId];
                                const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
                                return <>
                                    {winReady ?
                                        <Column
                                            key={column.id}
                                            column={column}
                                            tasks={tasks}
                                            recentBacklogs={recentBacklogs}
                                            recentRisks={recentRisks}
                                            recentAssumptions={recentAssumptions}
                                            recentIssues={recentIssues}
                                            recentDependencies={recentDependencies}
                                            backlogMaster={backlogMaster}
                                            riskMaster={riskMaster}
                                            assumptionMaster={assumptionMaster}
                                            issueMaster={issueMaster}
                                            dependencyMaster={dependencyMaster}
                                        /> :
                                        <Skeleton variant="rounded" className="mt-10" width="100%" height="450px" />}
                                </>;
                            })}
                        </div>
                    </div>
                </DragDropContext>
            ) : (
                <div>
                    <Skeleton variant="rounded" className="mt-10" width="100%" height="450px" />
                    <Skeleton variant="rounded" className="mt-10" width="100%" height="450px" />
                    <Skeleton variant="rounded" className="mt-10" width="100%" height="450px" />
                </div>
            )}

        </div>
    );
}