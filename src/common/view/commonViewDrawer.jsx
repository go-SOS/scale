"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import DetailsPage from "./details";

export default function CommonViewDrawer() {
    const { isCommonDrawer, updateIsCommonDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);

    useEffect(() => {
        if (isCommonDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isCommonDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsCommonDrawer(false);
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
                <DetailsPage />
            </Drawer>
        </>
    )
}
