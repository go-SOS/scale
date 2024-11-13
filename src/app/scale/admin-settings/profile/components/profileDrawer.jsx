"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import CreateEvent from "./createUser";

export default function ProfileDrawer({ user }) {
    const { isProfileDrawer, updateIsProfileDrawer } = useAppStore();
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    useEffect(() => {
        if (isProfileDrawer) {
            setIsOpenDrawer(true);
        } else {
            setIsOpenDrawer(false);
        }
    }, [isProfileDrawer])

    const toggleDrawer = () => (event) => {
        if (event.key === 'Escape') {
            updateIsProfileDrawer(false);
        }
    };

    return (
        <>
            <Drawer
                anchor='right'
                open={isOpenDrawer}
                onClose={toggleDrawer()}
                PaperProps={{
                    sx: { width: "47%" },
                }}
            >
                <CreateEvent rows={user} />
            </Drawer>
        </>
    )
}
