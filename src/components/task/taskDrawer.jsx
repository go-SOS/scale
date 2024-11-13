"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Divider from '@mui/material/Divider';
import CreateTask from "./createTask";

export default function TaskDrawer() {
    const { isTaskDrawer, updateIsTaskDrawer, taskRowSelected } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isTaskDrawer) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [isTaskDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsTaskDrawer(false);
        }
    };

    return (
        <>
            <Drawer
                anchor='right'
                open={isOpen}
                onClose={toggleDrawer()}
                PaperProps={{
                    sx: { width: "47%" },
                }}
            >
                <div>
                    <IconButton onClick={() => { updateIsTaskDrawer(false) }} edge="start" color="inherit" aria-label="close">
                        <CloseRoundedIcon className="ml-4" />
                    </IconButton>
                </div>
                <div className="flex justify-center text-lg font-semibold -mt-5">
                    {taskRowSelected ? 'Edit Task' : 'New Task'}
                </div>
                <Divider className="mt-1" />
                <CreateTask rows={taskRowSelected} />
            </Drawer>
        </>
    )
}
