"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import CreateEvent from "./createEvent";

export default function CalendarDrawer({ selectedEvent }) {
    const { isEventDrawer, updateIsEventDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);


    useEffect(() => {
        if (isEventDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isEventDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsEventDrawer(false);
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
                <CreateEvent selectedEvent={selectedEvent} />
            </Drawer>
        </>
    )
}
