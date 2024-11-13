"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import UpdateEvent from "./updateDashboard";

export default function DashboardDrawer() {
    const { isDashboardDrawer, updateIsDashboardDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);

    useEffect(() => {
        if (isDashboardDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isDashboardDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsDashboardDrawer(false);
        }
    };

    return (
        <>
            <Drawer
                anchor='right'
                open={isOpenEvent}
                onClose={toggleDrawer()}
                PaperProps={{
                    sx: { width: "25%" },
                }}
            >
                <UpdateEvent />
            </Drawer>
        </>
    )
}
