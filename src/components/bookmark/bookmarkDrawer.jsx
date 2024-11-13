"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import CreateEvent from "./createBookmark";

export default function BookmarkDrawer() {
    const { isBookmarkDrawer, updateIsBookmarkDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);

    useEffect(() => {
        if (isBookmarkDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isBookmarkDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsBookmarkDrawer(false);
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
