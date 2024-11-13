"use client";
import { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import useSlug from "@/app/scale/layout/hooks/useSlug";
import useAppStore from '@/store/appStore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function LabelForm({ showLabel, handleShowLabel }) {
    const [isCreating, setIsCreating] = useState(false);
    const [labelName, setLabelName] = useState("");
    const [loading, setLoading] = useState(true);
    const baseURL = '/api/';
    const { projectName, slug } = useSlug();
    const { userId, sessionData } = useAppStore();
    const { updateLabelList } = useAppStore();

    useEffect(() => {
        setIsCreating(showLabel);
    }, [showLabel]);

    const handleClickOpen = () => {
        setIsCreating(true);
    };

    const handleClose = () => {
        setIsCreating(false);
    };

    useEffect(() => {
        if (isCreating) {
            handleClickOpen();
        }
        handleShowLabel(isCreating);
    }, [isCreating]);

    const createLabel = async () => {
        if (labelName && labelName.trim() !== '') {
            setLoading(true);
            try {
                let endpoint = baseURL + `label?slug=${slug}`;
                let data = {
                    userId: userId,
                    projectSlug: slug,
                    projectName: projectName,
                    name: labelName,
                    lastModifiedBy: sessionData.data.email,
                    createdBy: sessionData.data.email
                }
                let method = "post";
                const { data: responseData } = await axios[method](endpoint, data);
                // console.log('responseData ', responseData);
                updateLabelList(responseData);
                setLabelName("");
                setIsCreating(false);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setIsCreating(false);
            }
        } else {
            setIsCreating(false);
        }
    };

    return (
        <div>
            {isCreating && (
                <div className="flex">
                    <div className="ml-2">
                        <div className="mr-4 ml-3">

                            <div className="mx-2 -mt-3">
                                <Dialog
                                    open={isCreating}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleClose}
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description">
                                            <div className="min-w-[400px]">
                                                <label htmlFor="label" className="scaleformlabel">
                                                    Create label
                                                </label>
                                                <input
                                                    type="text"
                                                    name="label"
                                                    value={labelName}
                                                    onChange={(e) => setLabelName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            createLabel();
                                                        }
                                                    }}
                                                    className={`scaleform border-gray-300`}
                                                />
                                            </div>
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <button onClick={handleClose}
                                            className="pulsebuttonwhite mr-3  min-w-[140px]"
                                        >
                                            <span>Cancel</span>
                                        </button>
                                        {labelName.length === 0 ? (
                                            <div
                                                className="pulsebuttonblue px-3 py-2 mr-1"
                                                style={{ opacity: 0.5, pointerEvents: 'none' }}
                                            >
                                                <span>Save</span>
                                            </div>
                                        ) :
                                            (
                                                <button
                                                    onClick={createLabel}
                                                    className="pulsebuttonblue min-w-[140px]"
                                                >
                                                    Save
                                                </button>
                                            )
                                        }
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LabelForm;
