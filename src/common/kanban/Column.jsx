"use client";
import { Draggable, Droppable } from "react-beautiful-dnd";

const Column = ({ column, tasks, from }) => {

    return (
        <>
            {column && (
                <div className="flex flex-col rounded-3px mt-5">
                    <div className="p-2 text-[15px] uppercase mr-3 max-h-[100px] text-center border shadow-md min-w-[23vw] bg-blue-100 font-semibold" >
                        {column.title} ({tasks?.length})
                    </div>

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
                                                className={`flex bg-card-bg rounded-3px pt-2 justify-center ${draggableSnapshot.isDragging ? 'solid card-border' : 'outline-transparent'
                                                    } ${draggableSnapshot.isDragging ? 'shadow-sm' : 'shadow-none'
                                                    }`}
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                            >
                                                {(from === "risk" || from === "irisk" || from === "assumption" || from === "iassumption" || from === "dependency" || from === "issue") && (
                                                    <div className="bg-white -ml-2 mb-3 min-w-[23vw] max-w-[23vw] rounded-lg border shadow-sm group relative">
                                                        <div className="ml-3 mt-1 text-[14px] font-medium p-2 flex justify-start text-blue-600">{task?.summary}</div>
                                                        {task?.status && (
                                                            <div className="ml-3 -mt-3 text-[14px] font-medium p-2 flex justify-start">Impact Level: {task?.status}</div>
                                                        )}
                                                        {task?.impactLevel && (
                                                            <div className="ml-3 -mt-3 text-[14px] font-medium p-2 flex justify-start">Impact Level: {task?.impactLevel}</div>
                                                        )}
                                                        {task?.reAssessmentDate && (
                                                            <div className="ml-3 -mt-3 text-[14px] font-medium p-2 flex justify-start">Re-assessment Date: {task?.reAssessmentDate}</div>
                                                        )}
                                                        {task?.escalate && (
                                                            <div className="ml-3 -mt-3 text-[14px] font-medium p-2 flex justify-start">Escalate: {task?.escalate}</div>
                                                        )}
                                                    </div>
                                                )}
                                                {(from === "retrospective" || from === "iretrospective") && (
                                                    <div className="bg-white -ml-2 mb-3 min-w-[19.2vw] max-w-[19.2vw] rounded-lg border shadow-sm group relative">
                                                        <div className="ml-3 mt-1 text-[14px] font-medium p-2 flex justify-start">{task?.sprintName}</div>
                                                        <div className="ml-3 -mt-3 text-[14px] font-medium p-2 flex justify-start">{task?.retrospectiveDetails}</div>
                                                    </div>
                                                )}
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
