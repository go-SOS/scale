import React, { useEffect, useState, useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import useAppStore from '@/store/appStore';
import AvatarComponent from './AvatarComponent';
import TableComponent from './TableComponent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import Popover from '@mui/material/Popover';
import { format } from 'date-fns';
import { useSession } from "next-auth/react";


const Column = ({ column, tasks, members }) => {
  const baseURL = '/api/';
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ref = useRef(null);
  const sprintref = useRef(null);
  const { updateIsBacklogUpdated, isBacklogUpdated, updateIsSprintDrawer, sprintList } = useAppStore();
  const { slug } = useSlug();
  const [sprintDetails, setSprintDetails] = useState(null);
  const { data: session } = useSession();
  const dateFormat = session?.data?.dateFormat;

  const [sprintAnchorEl, setSprintAnchorEl] = React.useState(null);
  const handleSprintClick = (event, title) => {
    const currentSprint = sprintList.filter(item => item.summary === title);
    setSprintAnchorEl(event.currentTarget);
    setSprintDetails(currentSprint[0]);
  };
  const handleSprintClose = () => {
    setSprintAnchorEl(null);
  };
  const sprintOpen = Boolean(sprintAnchorEl);
  const handleSprintClickOutside = (event) => {
    if (sprintref.current && !sprintref.current.contains(event.target)) {
      setSprintAnchorEl(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleSprintClickOutside);
    return () => {
      document.removeEventListener('click', handleSprintClickOutside);
    };
  }, []);

  const handleDelete = (title) => {
    handleClose();
    confirmAlert({
      title: 'Confirm to submit',
      message: 'are you sure to delete this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteRow(title)
        },
        {
          label: 'No',
        }
      ]
    });
  };

  const deleteRow = (title) => {
    let config = {
      method: 'post',
      url: baseURL + `manage-backlog?slug=${slug}`,
      data: { 'title': title },
    };

    axios.request(config)
      .then(response => {
        toast.success('Sprint deleted successfully!', {
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

  const handleEdit = (title) => {
    const item = sprintList.find((item) => item.name === title);
    updateIsSprintDrawer(item._id);
  }

  const headers = [
    // { label: '', className: '', sortable: false },
    { label: 'Key', className: 'flex min-w-[9vw] max-w-[9vw] ml-3', sortable: true },
    { label: 'Summary', className: 'flex min-w-[14vw] max-w-[14vw]', sortable: true },
    { label: 'Type', className: 'flex min-w-[9vw] max-w-[9vw]', sortable: true },
    { label: 'Status', className: 'flex min-w-[9vw] max-w-[9vw]', sortable: true },
    { label: 'Priority', className: 'flex min-w-[9vw] max-w-[9vw]', sortable: true },
    { label: 'Story Points', className: 'flex min-w-[10vw] max-w-[10vw]', sortable: true },
    { label: 'Due Date', className: 'flex min-w-[9vw] max-w-[9vw]', sortable: true },
    { label: 'Assigned to', className: '', sortable: false },
  ];

  const rows = tasks.map(task => [
    <AvatarComponent name={task?.workItemType} />,
    task?.backlogKey,
    task?.name,
    task?.tShirtSize,
    'User'
  ]);

  return (
    <>
      {column && (
        <div className="flex flex-col rounded-3px mt-20">
          <div className="text-[15px] font-semibold" >
            {column.title === "Product Backlog" && <>
              <div>
                Product Backlog
              </div>
              <div className="ml-2 mt-1 text-xs text-slate-400">
                {tasks.length} Work Items
              </div>
            </>}
            {column.title !== "Product Backlog" &&
              <>
                <div className="flex">
                  <div ref={sprintref}>
                    <div
                      aria-describedby={column.title}
                      onMouseEnter={(event) => handleSprintClick(event, column.title)}
                    >
                      {column.title}
                    </div>
                    <Popover
                      id={column.title}
                      open={sprintOpen}
                      anchorEl={sprintAnchorEl}
                      onClose={handleSprintClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <div className="p-2 text-sm overflow-hidden shadow-sm rounded-lg text-[13px] min-w-[250px]">
                        <span className="font-semibold mb-1">{sprintDetails?.summary}</span><br />
                        {sprintDetails?.duration && (
                          <div className="flex mb-1 mt-1 text-[13px]">
                            <div className="font-semibold min-w-[75px]">Duration: </div> {sprintDetails?.duration}<br />
                          </div>
                        )}
                        {sprintDetails?.startDate && (
                          <div className="flex mb-1 mt-1 text-[13px]">
                            <span className="font-semibold min-w-[75px]">Start Date: </span> {format(new Date(sprintDetails?.startDate), dateFormat)}<br />
                          </div>
                        )}
                        {sprintDetails?.endDate && (
                          <div className="flex mb-1 mt-1 text-[13px]">
                            <span className="font-semibold min-w-[75px]">End Date: </span> {format(new Date(sprintDetails?.endDate), dateFormat)}<br />
                          </div>
                        )}
                        {sprintDetails?.sprintStatus && (
                          <div className="flex mb-1 mt-1 text-[13px]">
                            <span className="font-semibold min-w-[75px]">Status: </span> {sprintDetails?.sprintStatus}<br />
                          </div>
                        )}
                        {sprintDetails?.sprintGoal && (
                          <div className="flex mb-1 mt-1 text-[13px]">
                            <span className="font-semibold min-w-[75px]">Goal: </span> {sprintDetails?.sprintGoal}<br />
                          </div>
                        )}
                      </div>
                    </Popover>
                  </div>
                  <div ref={ref}>
                    <button
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      // onMouseEnter={handleClick}
                      // onMouseLeave={handleClose}
                      className=" text-slate-900 space-x-2 -mt-3 ml-1"
                    >
                      <MoreVertIcon sx={{ fontSize: "19px" }} />
                    </button>
                  </div>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                    PaperProps={{
                      style: {
                        width: '80px',
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleEdit(column.title)} key='edit' className="-my-2">
                      <span className="text-sm">Edit</span>
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(column.title)} key='clone' className="-my-2">
                      <span className="text-sm">Delete</span>
                    </MenuItem>
                  </Menu>
                </div>
                <div className="ml-2 -mt-1 text-xs text-slate-400">
                  {tasks.length} Work Items
                </div>
              </>
            }
          </div>

          <Droppable droppableId={column.id}>
            {(droppableProvided, droppableSnapshot) => (
              <div
                className="flex flex-col flex-1 mt-4"
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">

                  <TableComponent headers={headers} tasks={tasks} column={column} members={members} />
                  {droppableProvided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </>
  );
};

export default Column;
