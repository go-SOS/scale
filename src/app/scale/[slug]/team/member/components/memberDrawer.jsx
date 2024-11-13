"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import CreateEvent from "./createMember";

export default function memberDrawer() {
    const { isMemberDrawer, updateIsMemberDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);

    useEffect(() => {
        if (isMemberDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isMemberDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsMemberDrawer(false);
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
