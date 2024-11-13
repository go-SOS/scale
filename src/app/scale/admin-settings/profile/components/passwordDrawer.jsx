"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import ChangePassword from "./changePassword";

export default function PasswordDrawer({ user }) {
    const { isPasswordDrawer, updateIsPasswordDrawer } = useAppStore();
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    useEffect(() => {
        if (isPasswordDrawer) {
            setIsOpenDrawer(true);
        } else {
            setIsOpenDrawer(false);
        }
    }, [isPasswordDrawer])

    const toggleDrawer = () => (event) => {
        if (event.key === 'Escape') {
            updateIsPasswordDrawer(false);
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
                <ChangePassword />
            </Drawer>
        </>
    )
}
