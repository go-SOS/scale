"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Divider from '@mui/material/Divider';
import SetupMail from "./setupMail";

export default function MailDrawer() {
    const { mailSetupDrawer, updateMailSetupDrawer } = useAppStore();
    const [isSetupMail, setIsSetupMail] = useState(false);

    useEffect(() => {
        if (mailSetupDrawer) {
            setIsSetupMail(true);
        } else {
            setIsSetupMail(false);
        }
    }, [mailSetupDrawer])

    const toggleDrawer = () => (event) => {
        if (event.key === 'Escape') {
            updateMailSetupDrawer(false);
        }
    };

    return (
        <>
            <Drawer
                anchor='right'
                open={isSetupMail}
                onClose={toggleDrawer()}
                PaperProps={{
                    sx: { width: "47%" },
                }}
            >
                <div>
                    <IconButton onClick={() => { updateMailSetupDrawer(false) }} edge="start" color="inherit" aria-label="close">
                        <CloseRoundedIcon className="ml-4" />
                    </IconButton>
                </div>
                <div className="flex justify-center text-lg font-semibold -mt-5">
                    Email Setup
                </div>
                <Divider className="mt-1" />
                <SetupMail />
            </Drawer>
        </>
    )
}
