"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import UpdateEvent from "./updateWorkflow";

export default function WorkflowDrawer({ masterData }) {
    const { isWorkflowDrawer, updateIsWorkflowDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);

    useEffect(() => {
        if (isWorkflowDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isWorkflowDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsWorkflowDrawer(false);
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
                <UpdateEvent masterData={masterData} />
            </Drawer>
        </>
    )
}
