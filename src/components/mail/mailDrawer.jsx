"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import SendMail from "./sendMail";

export default function MailDrawer() {
    const { isMailDrawer, updateIsMailDrawer } = useAppStore();
    const [isSendMail, setIsSendMail] = useState(false);

    useEffect(() => {
        if (isMailDrawer) {
            setIsSendMail(true);
        } else {
            setIsSendMail(false);
        }
    }, [isMailDrawer])

    const toggleDrawer = () => (event) => {
        if (event.key === 'Escape') {
            updateIsMailDrawer(false);
        }
    };

    return (
        <>
            <Drawer
                anchor='right'
                open={isSendMail}
                onClose={toggleDrawer()}
                PaperProps={{
                    sx: { width: "72%" },
                }}
            >
                <SendMail />
            </Drawer>
        </>
    )
}
