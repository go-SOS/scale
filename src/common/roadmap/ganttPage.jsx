'use client'
import { useEffect, useState } from "react";
import { Gantt, ViewMode, StylingOption } from "gantt-task-react";
import axios from "axios";
import useSlug from "@/app/scale/layout/hooks/useSlug";
import ViewSwitcher from "./ViewSwitcher";
import useAppStore from '@/store/appStore';
import Skeleton from '@mui/material/Skeleton';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import domtoimage from 'dom-to-image';

const customStyling = {
  barCornerRadius: 3,
  barHeight: 20,
  barProgressColor: "#1a0a93",
  barColor: "#b8fea8",
  backgroundColor: "#dfe6e9",
  gridLineColor: "#b2bec3",
  arrowColor: "#d63031"
};


export default function GanttPage({ from }) {
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [nodata, setNodata] = useState(true);
  const { slug } = useSlug();
  const baseURL = '/api/';
  const { roadmapList, updateIsRoadmapDrawer, sessionData } = useAppStore();
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newId, setNewId] = useState('');

  useEffect(() => {
    if (newId && newStart && newEnd) {
      updateDate(newId, newStart, newEnd);
    }
  }, [newId, newEnd]);

  useEffect(() => {
    fetchData();
  }, [roadmapList]);

  const fetchData = async () => {
    try {
      const projects = await fetchStepData();

      const combinedTasks = [
        ...projects.map(task => ({
          ...task,
          start: new Date(task.start),
          end: new Date(task.end),
          hideChildren: false,
        })),

      ];

      setTasks(combinedTasks);
      setNodata(combinedTasks.length === 0);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchStepData = async () => {
    const currentDate = new Date();
    try {
      const posturl = `${baseURL}roadmap?slug=${slug}`;
      const response = await axios.get(posturl);
      const formattedSteps = response.data.map(item => ({
        id: item._id,
        name: item.objective,
        start: item.startDate,
        end: item.dueDate,
        dependencies: [item.parent],
        progress: item.progress,
        type: 'task',
        styles: { backgroundColor: '#34d399', progressColor: '#3b82f6', progressSelectedColor: '#1e40af' },
        project: item.objective
      }));
      return formattedSteps;
    } catch (error) {
      console.error("Error fetching steps data:", error);
      return [];
    }
  };

  const getStartEndDateForProject = (tasks, projectId) => {
    const projectTasks = tasks.filter((t) => t.project === projectId);

    // Check if projectTasks array is empty
    if (projectTasks.length === 0) {
      return [new Date(), new Date()]; // Or any default values you prefer
    }

    let start = projectTasks[0].start;
    let end = projectTasks[0].end;

    for (let i = 0; i < projectTasks.length; i++) {
      const task = projectTasks[i];
      if (start.getTime() > task.start.getTime()) {
        start = task.start;
      }
      if (end.getTime() < task.end.getTime()) {
        end = task.end;
      }
    }
    return [start, end];
  };

  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task) => {
    // console.log("On date change Id:", task);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);

      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.id)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
    // console.log("projectTasks : newTasks ", newTasks);
    const record = newTasks.find(proj => proj.id == task.id);
    // console.log("record ", record);
    setNewId(task.id);
    setNewStart(record.start);
    setNewEnd(record.end);
  };

  const updateDate = async (id, startDate, endData) => {
    try {
      const endpoint = baseURL + `roadmap?slug=${slug}`;
      let method;
      let data = {};
      Object.assign(data, { _id: id });
      Object.assign(data, { updatedAt: Date.now() });
      Object.assign(data, { lastModifiedBy: sessionData.data.email });
      Object.assign(data, { updatedBy: sessionData.data.fullName });
      Object.assign(data, { startDate: startDate });
      Object.assign(data, { dueDate: endData });
      method = "put";
      const { data: responseData } = await axios[method](endpoint, data);
      // console.log('responseData ', responseData);
    } catch (error) {
      console.log(error);
    }
  }

  // const handleTaskDelete = (task) => {
  //   if (task.type === "task") {
  //     handleDelete(task.id, task.name);
  //   }
  //   if (task.type === "project") {
  //     if (task.name !== "Product Backlog") {
  //       handleSprintDelete(task.name)
  //       console.log("On delete Id: ", task);
  //     }
  //   }
  // };

  const handleProgressChange = async (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    // console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task) => {
    console.log("On double click Id: ", task);
    if (task.type === "task") {
      updateIsRoadmapDrawer(task.id);
    }
    if (task.type === "project") {
      updateIsRoadmapDrawer(true);
    }
  };

  // const handleSelect = (task, isSelected) => {
  //   console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  // };

  const handleExpanderClick = (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    // console.log("On expander click Id:", task);
  };

  // const handleDelete = (id, name) => {
  //   confirmAlert({
  //     title: 'Confirm to submit',
  //     message: 'are you sure to delete ' + name + '?',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => deleteRow(id)
  //       },
  //       {
  //         label: 'No',
  //       }
  //     ]
  //   });
  // };

  // const deleteRow = (id) => {
  //   let config = {
  //     method: 'delete',
  //     url: baseURL + `backlog?slug=${slug}`,
  //     data: [id]
  //   };

  //   axios.request(config)
  //     .then(response => {
  //       toast.success('Work item deleted successfully!', {
  //         position: "top-center",
  //         autoClose: 3000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         style: {
  //           width: '380px',
  //         },
  //       });
  //       // console.log('deleted response ', response);
  //       updateBacklogList(response);
  //     })
  //     .catch(err => {
  //       console.log('Error ', err);
  //       toast.error(err, {
  //         position: "top-center",
  //         autoClose: 3000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         style: {
  //           width: '380px',
  //         },
  //       });
  //     })
  // }

  // const handleSprintDelete = (title) => {
  //   confirmAlert({
  //     title: 'Confirm to submit',
  //     message: 'are you sure to delete ' + title + '?',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => deleteSprintRow(title)
  //       },
  //       {
  //         label: 'No',
  //       }
  //     ]
  //   });
  // };

  // const deleteSprintRow = (title) => {
  //   let config = {
  //     method: 'post',
  //     url: baseURL + `manage-backlog?slug=${slug}`,
  //     data: { 'title': title },
  //   };

  //   axios.request(config)
  //     .then(response => {
  //       toast.success('Sprint deleted successfully!', {
  //         position: "top-center",
  //         autoClose: 3000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         style: {
  //           width: '380px',
  //         },
  //       });
  //       updateBacklogList(response);
  //       // updateIsBacklogUpdated(!isBacklogUpdated);
  //     })
  //     .catch(err => {
  //       console.log('Error ', err);
  //       toast.error(err, {
  //         position: "top-center",
  //         autoClose: 3000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         style: {
  //           width: '380px',
  //         },
  //       });
  //     })
  // }

  return (
    <div>
      {!loading ? (
        <div className="-mt-2">
          <ViewSwitcher
            onViewModeChange={(viewMode) => setView(viewMode)}
            onViewListChange={setIsChecked}
            isChecked={isChecked}
            view={view}
          />
          {nodata ? (
            <div className="flex justify-center p-4 min-h-[40vh]">
              <div className="border-2 border-dashed border-gray-500 p-10 min-w-[76vw] rounded-lg">
                <div className="my-4 flex justify-center">
                  <div className="text-md text-left mt-4 ml-10">
                    <h2 className="text-md font-semibold mb-1">Your Roadmap is currently empty.</h2>
                    <p className="text-gray-700">
                      The roadmap list will be shown here.
                      <br />
                      To add work items click{" "}
                      <span className="font-semibold text-blue-500 cursor-pointer" onClick={() => updateIsRoadmapDrawer(true)}>
                        Add Roadmap.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg m-1 p-1" >
              <Gantt
                tasks={tasks}
                viewMode={view}
                onDateChange={handleTaskChange}
                // onDelete={handleTaskDelete}
                onProgressChange={handleProgressChange}
                onDoubleClick={handleDblClick}
                // onSelect={handleSelect}
                onExpanderClick={handleExpanderClick}
                listCellWidth={isChecked ? "155px" : ""}
                // ganttHeight="48vh"
                ganttHeight={`${from === "Board" ? '44vh' : '48vh'}`}
                columnWidth={columnWidth}
                StylingOption={customStyling}
              />
            </div>
          )}
        </div>
      ) :
        (
          <>
            <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
            <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
          </>
        )
      }
    </div>
  );
}
