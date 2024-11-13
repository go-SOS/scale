import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";
import useAppStore from '@/store/appStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@mui/material/Divider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import "react-datepicker/dist/react-datepicker.css";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const schema = yup.object().shape({
    // summary: yup.string().required('Please enter summary.'),
});

const UpdateEvent = () => {
    const baseURL = '/api/';
    const { updateIsDashboardDrawer, isDashboardDrawer, updateDashboardState, dashboardState } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState(null);
    const { projectName, slug, key } = useSlug();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [disabled, setDisabled] = useState(false);
    const [state, setState] = useState({
        Backlog: true,
        Risk: true,
        Assumption: true,
        Issue: true,
        Dependency: true,
    });
    const [dashState, setDashState] = useState({
        tasks: {
            1: { id: "Backlog", title: "Backlog" },
            2: { id: "Risk", title: "Risk" },
            3: { id: "Assumption", title: "Assumption" },
            4: { id: "Dependency", title: "Dependency" },
            5: { id: "Issue", title: "Issue" }
        },
        columns: {
            First: { id: "First", title: "First", taskIds: [1, 2, 3] },
            Second: { id: "Second", title: "Second", taskIds: [4, 5] }
        },
        columnOrder: ["First", "Second"]
    });

    // useEffect(() => {
    //     console.log('dashboardState ', dashboardState);

    // }, [dashboardState])

    const updateDashState = (name, checked) => {
        const taskIdMap = {
            Backlog: 1,
            Risk: 2,
            Assumption: 3,
            Dependency: 4,
            Issue: 5,
        };

        const taskId = taskIdMap[name];
        console.log('dashboardState taskId ', taskId);
        setDashState(prevState => {
            const newColumns = { ...prevState.columns };
            if (taskId === 1 || taskId === 2 || taskId === 3) {
                if (checked) {
                    if (!newColumns.First.taskIds.includes(taskId)) {
                        newColumns.First.taskIds.push(taskId);
                    }
                }
                else {
                    newColumns.First.taskIds = newColumns.First.taskIds.filter(id => id !== taskId);
                }
            }
            if (taskId === 4 || taskId === 5) {
                if (checked) {
                    if (!newColumns.Second.taskIds.includes(taskId)) {
                        newColumns.Second.taskIds.push(taskId);
                    }
                }
                else {
                    newColumns.Second.taskIds = newColumns.Second.taskIds.filter(id => id !== taskId);
                }
            }
            return { ...prevState, columns: newColumns };
        });
    };

    useEffect(() => {
        console.log('dashboardState ', dashState);
        updateDashboardState(dashState);
    }, [dashState])

    const handleChange = (event) => {
        const { name, checked } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: checked,
        }));
        updateDashState(name, checked);
        // console.log('dashboardState ', name, ' ', checked);
    };

    useEffect(() => {
        setLoading(false);
        if (isDashboardDrawer !== true && isDashboardDrawer !== false) {
            getData();
        }
    }, [isDashboardDrawer]);


    const onSubmit = async () => {
        setDisabled(true);
        const endpoint = baseURL + `dashboard?slug=${slug}`;
        let method;
        let data = {};

        Object.assign(data, { _id: rows?.dashboardData[0]?._id });
        Object.assign(data, { projectName: projectName });
        Object.assign(data, { dashboardState: dashState });
        method = "put";
        const { data: responseData } = await axios[method](endpoint, data);
        // updateDashboardState(responseData);
        setDisabled(false);
        updateIsDashboardDrawer(false)
        const successMessage = 'Dashboard updated successfully!';
        toast.success(successMessage, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'success',
            progress: undefined,
            theme: "light",
            style: {
                width: '380px',
            },
        });
    };


    return (
        <>
            <div className="rounded overflow-hidden">
                <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="sticky top-0 bg-slate-100 z-10">
                            <div>
                                <IconButton onClick={() => { updateIsDashboardDrawer(false) }} edge="start" color="inherit" aria-label="close">
                                    <CloseRoundedIcon className="ml-4" />
                                </IconButton>
                            </div>
                            <div className="flex justify-center text-lg font-semibold -mt-5">
                                Customize Dashboard
                            </div>
                            <Divider />
                        </div>
                      <div className="flex justify-center mt-4 min-h-[86vh]">
                            <div>
                                {!loading ? (
                                    <div className="mt-10">
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Switch checked={state.Backlog} onChange={handleChange} name="Backlog" />}
                                                label="Work Items"
                                                style={{ marginBottom: "12px" }}
                                            />
                                            <FormControlLabel
                                                control={<Switch checked={state.Risk} onChange={handleChange} name="Risk" />}
                                                label="Risk"
                                                style={{ marginBottom: "12px" }}
                                            />
                                            <FormControlLabel
                                                control={<Switch checked={state.Assumption} onChange={handleChange} name="Assumption" />}
                                                label="Assumption"
                                                style={{ marginBottom: "12px" }}
                                            />
                                            <FormControlLabel
                                                control={<Switch checked={state.Issue} onChange={handleChange} name="Issue" />}
                                                label="Issue"
                                                style={{ marginBottom: "12px" }}
                                            />
                                            <FormControlLabel
                                                control={<Switch checked={state.Dependency} onChange={handleChange} name="Dependency" />}
                                                label="Dependency"
                                                style={{ marginBottom: "12px" }}
                                            />
                                        </FormGroup>
                                    </div>
                                ) : (
                                    <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                                        <svg ariaHidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-slate-100 z-10 min-h-[60px]">
                            <Divider />
                            <div className="mt-3 mb-3">
                                <div className="flex justify-end mr-4">
                                    <div>
                                        <div className="flex">
                                            <button onClick={() => updateIsDashboardDrawer(false)}
                                                className="pulsebuttonwhite mr-3  min-w-[140px]"
                                            >
                                                <span>Cancel</span>
                                            </button>
                                            {disabled ? (
                                                <div
                                                    className="pulsebuttonblue px-3 py-2 mr-1"
                                                    style={{ opacity: 0.5, pointerEvents: 'none' }}
                                                >
                                                    <span>Save</span>
                                                    <span className="mb-1 -mr-4">
                                                        <svg ariaHidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                        </svg>
                                                    </span>

                                                </div>
                                            ) :
                                                (
                                                    <button
                                                        type="submit"
                                                        className="pulsebuttonblue min-w-[140px]"
                                                    >
                                                        Save
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div >
            </div>
        </>
    );
};

export default UpdateEvent;
