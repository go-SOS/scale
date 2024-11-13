"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import CreateComment from "./createComment";

export default function CommentDrawer() {
    const { isCommentDrawer, updateIsCommentDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);

    useEffect(() => {
        if (isCommentDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isCommentDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsCommentDrawer(false);
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
                <CreateComment />
            </Drawer>
        </>
    )
}
