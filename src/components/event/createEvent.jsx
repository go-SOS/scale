"use client";
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import useAppStore from "@/store/appStore";
import { toast } from 'react-toastify';
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Divider from '@mui/material/Divider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";
import SendTo from "@/components/mail/sendTo";


const schema = yup.object().shape({
    title: yup.string().required('Please enter title'),
    // start: yup.date('Please enter start date'),
    // end: yup
    //     .date()
    //     .min(yup.ref('start'), 'End Date should be greater than or equal to Start Date'),
});

const CreateTask = ({ selectedEvent }) => {
    const baseURL = '/api/';
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState(null);
    const { updateIsEventDrawer, userId, updateMeetingData, sessionData, formData, projectList, currentProject } = useAppStore();
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
    const { projectName, slug, key } = useSlug();
    const [localForm, setLocalForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState("");
    const [rows, setRows] = useState(null);
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const [currentSlug, setCurrentSlug] = useState(slug);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [to, setTo] = useState([]);

    const handleSetTo = (newEmail) => {
        setTo(newEmail);
    }

    useEffect(() => {
        setProjects(projectList);
    }, [projectList]);

    const getData = async () => {
        let posturl = baseURL + "meetings?id=" + selectedEvent?._id;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('meetings ', res?.data[0]);
                setRows(res?.data[0]);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    useEffect(() => {
        reset(rows ? rows : {});
        if (rows) {
            setStartDate(new Date(rows?.start));
            setEndDate(new Date(rows?.end));
            setValue('start', new Date(rows?.start));
            setValue('end', new Date(rows?.end));
            setTo(rows?.participants)
        }
    }, [rows]);


    useEffect(() => {
        // console.log('selectedEvent ', selectedEvent);
        getMasterData();
    }, []);

    const getMasterData = async () => {
        let posturl = baseURL + "calendarmaster";
        await axios
            .get(posturl)
            .then((res) => {
                setLocalForm(res?.data[0]?.calendars);
                if (selectedEvent?._id !== undefined && selectedEvent) {
                    getData();
                } else {
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const handleDropdownChange = (e, fieldName) => {
        if (fieldName === 'projectName') {
            if (projectList) {
                let inputVal = e.target.value;
                // console.log('projectName ', inputVal);
                const project = projectList.find(proj => proj.projectName === inputVal);
                let pSlug = project?.projectSlug || '';
                let pKey = project?.projectKey || '';
                setCurrentSlug(pSlug);
            }
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        Object.assign(data, { userId: userId });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });
        Object.assign(data, { owner: sessionData.data.email });
        Object.assign(data, { projectSlug: currentSlug });

        data.participants = to;

        data.start = new Date(startDate);
        data.end = new Date(endDate);

        const project = data.projectName;

        if (!project) {
            data.projectName = currentProject?.projectName;
        }

        try {
            const endpoint = baseURL + `meetings?slug=${slug}`;
            let method = "";
            if (rows) {
                Object.assign(data, { _id: rows?._id });
                method = "put";
            } else {
                method = "post";
            }
            const { data: responseData } = await axios[method](endpoint, data);
            updateMeetingData(responseData);
            const successMessage = rows ? 'Event modified successfully!' : 'Event added successfully!';
            toast.success(successMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: {
                    width: '380px',
                },
            });
            updateIsEventDrawer(false);
            setIsLoading(false);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleApiError = (error) => {
        setIsLoading(false);
        const errorMessage =
            error.status === 401 || error.status === 403 || error.status === 500
                ? error
                : "Sorry....the backend server is down!! Please try again later";

        toast.error(errorMessage, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: {
                width: '380px',
            },
        });

        console.log(error);
    };

    const handleDelete = () => {
        updateIsEventDrawer(false);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this event?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteRow()
                },
                {
                    label: 'No',
                }
            ],
        });
    };

    const deleteRow = () => {
        let config = {
            method: 'delete',
            url: baseURL + 'meetings' + '?slug=' + slug,
            data: [rows?._id]
        };

        axios.request(config)
            .then(response => {
                toast.success('Event deleted successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: {
                        width: '380px',
                    },
                });
                // console.log('del res ', response.data);
                let resdata = response.data;
                updateMeetingData(resdata);
            })
            .catch(err => {
                console.log('Error ', err);
                toast.error(err, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: {
                        width: '380px',
                    },
                });
            })
    }

    const renderFormField = (field) => {
        if (field.quickAdd) {
            switch (field.type) {
                case 'project':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
                                {field.label}
                            </label>
                            <select
                                id={field.name}
                                name={field.name}
                                disabled
                                {...register(field.name)}
                                onChange={(e) => handleDropdownChange(e, field.name)}
                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value={currentProject?.projectName}>{currentProject?.projectName}</option>
                                {projects !== null && projects !== undefined && projects.filter(name => name.projectName !== currentProject?.projectName).map((option, index) => (
                                    <option key={index} value={option.projectName}>
                                        {option.projectName}
                                    </option>
                                ))}
                            </select>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'team':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
                                {field.label}
                            </label>
                            <div className="flex">
                                <div className='mr-3'>
                                    <input
                                        type="text"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        className={`scaleform min-w-[290px] ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                <SendTo handleSetTo={handleSetTo} />
                            </div>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'dropdown':
                    return (
                        <div>
                            {field.name !== "duration" && (
                                <div className="mb-5" key={field.name}>
                                    <label htmlFor={field.name} className="scaleformlabel">
                                        {field.label}
                                    </label>
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        disabled={field.readOnly}
                                        {...register(field.name)}
                                        className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">

                                        </option>
                                        {field.optionList.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    {errors[field.name] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                case 'textbox':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
                                {field.label}
                            </label>
                            <input
                                type="text"
                                id={field.name}
                                disabled={field.readOnly}
                                name={field.name}
                                {...register(field.name)}
                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'textarea':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
                                {field.label}
                            </label>
                            <textarea
                                id={field.name}
                                name={field.name}
                                disabled={field.readOnly}
                                {...register(field.name)}
                                rows="3"
                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            ></textarea>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'list':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
                                {field.label}
                            </label>
                            <textarea
                                rows="1"
                                id={field.name}
                                name={field.name}
                                disabled={field.readOnly}
                                {...register(field.name)}
                                placeholder={`tag1,tag2,tag3 (Add tags as a comma separated list)`}
                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            ></textarea>
                        </div>
                    );
                case 'date':
                    return (
                        <div>
                            {field.name === "start" && (
                                <div>
                                    <div className="mb-5" key={field.name}>
                                        <label htmlFor={field.name} className="scaleformlabel">
                                            {field.label}
                                        </label>
                                        {field.name === "start" && (
                                            <DatePicker
                                                showTimeSelect
                                                selected={startDate}
                                                dateFormat={dateFormat}
                                                onChange={(date) => setStartDate(date)}
                                                className={`scaleform max-w-[550px] min-w-[550px] ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        )}
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                        )}
                                    </div>
                                    <div className="mb-5" key={field.name}>
                                        <label htmlFor={field.name} className="scaleformlabel">
                                            Start Time
                                        </label>
                                        {field.name === "start" && (
                                            <DatePicker
                                                showTimeSelect
                                                selected={startDate}
                                                // dateFormat={dateFormat}
                                                dateFormat="HH:mm:ss"
                                                disabled
                                                onChange={(date) => setStartDate(date)}
                                                className={`scaleform max-w-[550px] min-w-[550px] ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        )}
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                        )}
                                    </div>
                                </div>

                            )}
                            {field.name === "end" && (
                                <div>
                                    <div className="mb-5" key={field.name}>
                                        <label htmlFor={field.name} className="scaleformlabel">
                                            {field.label}
                                        </label>
                                        {field.name === "end" && (
                                            <DatePicker
                                                showTimeSelect
                                                selected={endDate}
                                                dateFormat={dateFormat}
                                                //  dateFormat="dd MMM yyyy, HH:mm:ss"
                                                onChange={(date) => setEndDate(date)}
                                                className={`scaleform max-w-[550px] min-w-[550px] ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        )}
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                        )}
                                    </div>
                                    <div className="mb-5" key={field.name}>
                                        <label htmlFor={field.name} className="scaleformlabel">
                                            End Time
                                        </label>
                                        {field.name === "end" && (
                                            <DatePicker
                                                showTimeSelect
                                                selected={endDate}
                                                disabled
                                                // dateFormat={dateFormat}
                                                dateFormat="HH:mm:ss"
                                                onChange={(date) => setEndDate(date)}
                                                className={`scaleform max-w-[550px] min-w-[550px] ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        )}
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>

                    );
                // case 'time':
                //     return (
                //         <div className="mb-5" key={field.name}>
                //             <label htmlFor={field.name} className="scaleformlabel">
                //                 {field.label}
                //             </label>
                //             <input
                //                 type="time"
                //                 id={field.name}
                //                 disabled={field.readOnly}
                //                 name={field.name}
                //                 {...register(field.name)}
                //                 className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                //             />
                //             {errors[field.name] && (
                //                 <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                //             )}
                //         </div>
                //     );
                default:
                    return null;
            }
        }
    };


    return (
        <>
            <div className="rounded overflow-hidden">
                <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="sticky top-0 bg-slate-100 z-10">
                            <div>
                                <IconButton onClick={() => { updateIsEventDrawer(false) }} edge="start" color="inherit" aria-label="close">
                                    <CloseRoundedIcon className="ml-4" />
                                </IconButton>
                            </div>
                            <div className="flex justify-center text-lg font-semibold -mt-5">
                                Edit Event
                            </div>
                            <Divider className="mt-1" />
                        </div>
                      <div className="flex justify-center mt-4 min-h-[86vh]">
                            <div className="max-w-[550px] min-w-[550px]">
                                {!loading ? (
                                    <>
                                        {localForm.map((field) => renderFormField(field))}
                                    </>
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
                            <div className="mt-3 mb-3 flex justify-between">
                                <div className="ml-5 -mt-2">
                                    {rows && (
                                        <div className="mr-10 mt-2 cursor-pointer" onClick={() => handleDelete()}>
                                            <DeleteOutlineRoundedIcon sx={{ fontSize: "20" }} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end mr-4">
                                    <div>
                                        <div className="flex">
                                            <button
                                                className={`pulsebuttonblue px-3 py-1 mr-1`}
                                                disabled={isLoading}
                                                type="submit"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="flex justify-center">
                                                            Saving...
                                                            <span className="ml-2">
                                                                <div role="status">
                                                                    <svg ariaHidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                    </svg>
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : <span>Save</span>}
                                            </button>
                                            <button
                                                className="pulsebuttonwhite px-3 py-1 mr-1"
                                                onClick={() => updateIsEventDrawer(false)}
                                            >
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
};

export default CreateTask;
