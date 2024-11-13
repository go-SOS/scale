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

export default function DragAndDrop({ rows, steps, members }) {
  const [state, setState] = useState(initialData(rows, steps));
  const baseURL = '/api/';
  const { updateBacklogSteps } = useAppStore();
  const [winReady, setwinReady] = useState(false);
  const { slug } = useSlug();

  useEffect(() => {
    // console.log('steps ', steps);
    setTimeout(() => {
      setwinReady(true);
    }, 500);
  }, [steps]);


  const getSteps = async (userId, newLeadStatus) => {
    let posturl = baseURL + `steps?slug=${slug}`;
    await axios
      .get(posturl)
      .then((res) => {
        updateBacklogSteps(res.data);
        let allSteps = res.data;
        updateLeadStatus(userId, newLeadStatus, allSteps);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          deleteCookie("logged");
          signOut();
        }
      });
  };

  const updateLeadStatus = (id, status, allSteps) => {
    // console.log('Id ', id);
    // console.log('backlogTypeName ', status);

    let backlogType = "";
    if (status === "WorkItem") {
      backlogType = "WorkItem";
    } else {
      backlogType = "Sprint";
    }

    // console.log('allSteps ', allSteps);
    const item = allSteps.find(item => item.name === status);
    const stepId = item?._id;
    console.log('stepId ', stepId);

    let config = {
      method: 'put',
      url: baseURL + 'backlog',
      data: { _id: id, backlogTypeName: status, backlogType: backlogType, stepId: stepId }
    };

    axios.request(config)
      .then(response => {
        console.log('Response ', response);
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
    await getSteps(userId, newLeadStatus);
    // await updateLeadStatus(userId, newLeadStatus)

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
          <div className="bg-main-bg w-full text-white-text pb-8">
            <div className="px-1">
              {state.columnOrder.map((columnId, index) => {
                const column = state.columns[columnId];
                let tasks = [];
                if (column && column.taskIds) {
                  tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
                }
                return <>
                  {winReady && <Column key={index} column={column} tasks={tasks} members={members} />}
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

const initialData = (rows, steps) => {

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

  // Filter tasks based on leadStatus
  steps.forEach((step) => {
    Object.keys(tasks).forEach((taskId) => {
      const task = tasks[taskId];
      if (task.backlogTypeName === step) {
        allTasks[step][taskId] = task;
      }
    });
  });


  rows.forEach((row) => {
    let data = allTasks[row.backlogTypeName];
    if (data !== undefined) {
      const taskIdsArray = Object.keys(data).map(Number);
      if (taskIdsArray.length !== 0) {
        columns[row.backlogTypeName] = {
          id: row.backlogTypeName,
          title: row.backlogTypeName,
          taskIds: taskIdsArray
        };
      }
    }

  });

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
