"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import CreateEvent from "./createTimesheet";

export default function timesheetDrawer() {
    const { isTimesheetDrawer, updateIsTimesheetDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);

    useEffect(() => {
        if (isTimesheetDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isTimesheetDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsTimesheetDrawer(false);
        }
    };

    return (
        <>
            <Drawer
                anchor='right'
                open={isOpenEvent}
                onClose={toggleDrawer()}
                PaperProps={{
                    sx: { width: "47%" },
                }}
            >
                <CreateEvent />
            </Drawer>
        </>
    )
}
