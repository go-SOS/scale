"use client";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import dynamic from 'next/dynamic';
import Skeleton from '@mui/material/Skeleton';

const BacklogRecords = dynamic(() => import('../tables/backlogRecords'), {
    loading: () => <Skeleton variant="rounded" width="100%" height="300px" />,
})
const RiskRecords = dynamic(() => import('../tables/riskRecords'), {
    loading: () => <Skeleton variant="rounded" width="100%" height="300px" />,
})
const AssumptionRecords = dynamic(() => import('../tables/assumptionRecords'), {
    loading: () => <Skeleton variant="rounded" width="100%" height="300px" />,
})
const IssueRecords = dynamic(() => import('../tables/issueRecords'), {
    loading: () => <Skeleton variant="rounded" width="100%" height="300px" />,
})
const DependencyRecords = dynamic(() => import('../tables/dependencyRecords'), {
    loading: () => <Skeleton variant="rounded" width="100%" height="300px" />,
})

const Column = ({
    column,
    tasks,
    recentBacklogs,
    recentRisks,
    recentAssumptions,
    recentIssues,
    recentDependencies,
    backlogMaster,
    riskMaster,
    assumptionMaster,
    issueMaster,
    dependencyMaster
}) => {
    const [winReady, setwinReady] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setwinReady(true);
        }, 500);
    }, []);

    return (
        <>
            {column && (
                <div className="flex flex-col rounded-3px min-h-screen">
                    <Droppable droppableId={column.id}>
                        {(droppableProvided, droppableSnapshot) => (
                            <div
                                className="flex flex-col flex-1"
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                            // style={{ backgroundColor: droppableSnapshot.isDraggingOver ? '' : '#f1f5f9' }}
                            >
                                {tasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                        {(draggableProvided, draggableSnapshot) => (
                                            <div
                                                className={`flex bg-card-bg rounded-3px pt-2 justify-center ${draggableSnapshot.isDragging ? 'outline-2px solid card-border' : 'outline-transparent'
                                                    } ${draggableSnapshot.isDragging ? 'shadow-md' : 'shadow-none'
                                                    }`}
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                            >
                                                <div className="mr-2">
                                                    {task?.title == "Backlog" && (
                                                        <Card
                                                            className="gradient max-w-[38vw] min-w-[38vw]"
                                                            sx={{ minWidth: 40 + "%", height: 410 }}
                                                        >
                                                            <div className="mt-3 ml-4 font-semibold">
                                                                Top 5 Work Items
                                                            </div>
                                                            <CardContent>
                                                                {winReady && <BacklogRecords recentBacklogs={recentBacklogs} backlogMaster={backlogMaster} />}

                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                    {task?.title == "Risk" && (
                                                        <Card
                                                            className="gradient  max-w-[38vw] min-w-[38vw]"
                                                            sx={{ minWidth: 40 + "%", height: 410 }}
                                                        >
                                                            <div className="mt-3 ml-4 font-semibold">
                                                                Top 5 Risks
                                                            </div>
                                                            <CardContent>
                                                                {winReady && <RiskRecords recentRisks={recentRisks} riskMaster={riskMaster} />}
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                    {task?.title == "Assumption" && (
                                                        <Card
                                                            className="gradient  max-w-[38vw] min-w-[38vw]"
                                                            sx={{ minWidth: 40 + "%", height: 410 }}
                                                        >
                                                            <div className="mt-3 ml-4 font-semibold">
                                                                Top 5 Assumptions
                                                            </div>
                                                            <CardContent>
                                                                {winReady && <AssumptionRecords recentAssumptions={recentAssumptions} assumptionMaster={assumptionMaster} />}
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                    {task?.title == "Dependency" && (
                                                        <Card
                                                            className="gradient  max-w-[38vw] min-w-[38vw]"
                                                            sx={{ minWidth: 40 + "%", height: 410 }}
                                                        >
                                                            <div className="mt-3 ml-4 font-semibold">
                                                                Top 5 Dependencies
                                                            </div>
                                                            <CardContent>
                                                                {winReady && <DependencyRecords recentDependencies={recentDependencies} dependencyMaster={dependencyMaster} />}
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                    {task?.title == "Issue" && (
                                                        <Card
                                                            className="gradient  max-w-[38vw] min-w-[38vw]"
                                                            sx={{ minWidth: 40 + "%", height: 410 }}
                                                        >
                                                            <div className="mt-3 ml-4 font-semibold">
                                                                Top 5 Issues
                                                            </div>
                                                            <CardContent>
                                                                {winReady && <IssueRecords recentIssues={recentIssues} issueMaster={issueMaster} />}
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}

        </>

    );
};

export default Column;
