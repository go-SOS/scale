import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";
import useAppStore from '@/store/appStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import useSlug from "@/app/scale/layout/hooks/useSlug";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PlanningModuleSwitch from './PlanningModuleSwitch';

const phoneRegExp = /^(|((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?)$/;

const schema = yup.object().shape({
    fullName: yup.string().required('Please enter name.'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    startDate: yup.date(),
    endDate: yup
        .date()
        .min(yup.ref('startDate'), 'Due Date should be greater than or equal to Start Date'),
});

const CreateEvent = () => {
    const baseURL = '/api/';
    const { updateIsMemberDrawer, sessionData, userId, updateMemberList, updateIsBacklogUpdated, isBacklogUpdated, isMemberDrawer, teamList, organizationName, isClone, currentProject } = useAppStore();
    const [localForm, setLocalForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState(null);
    const [teams, setTeams] = useState(teamList);
    const { projectName, slug, key } = useSlug();
    const [planningSwitch, setPlanningSwitch] = useState([]);
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
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const isSuperAdmin = session?.data?.isSuperAdmin;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [disabled, setDisabled] = useState(false);
    const { projectList } = useAppStore();
    const [projects, setProjects] = useState("");
    const [localSessiondata, setLocalSessiondata] = useState("");

    const handleProjectSelection = (newState) => {
        // console.log('handleProjectSelection ', newState);
        setPlanningSwitch(newState);
    }

    useEffect(() => {
        setLocalSessiondata(session);
    }, [session])

    useEffect(() => {
        // console.log('projectList ', projectList);
        // console.log('isSuperAdmin ', isSuperAdmin);
        setProjects(projectList);
    }, [projectList]);

    useEffect(() => {
        // console.log('teamList ', teamList);
        if (teamList) {
            setTeams(teamList);
        }
    }, [teamList]);

    useEffect(() => {
        // console.log('isMemberDrawer ', isMemberDrawer);
        if (isMemberDrawer !== true && isMemberDrawer !== false) {
            getData();
        }
    }, [isMemberDrawer]);

    const getData = async () => {
        let posturl = baseURL + "member?id=" + isMemberDrawer;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('member ', res?.data[0]);
                setRows(res?.data[0]);
                setPlanningSwitch(res?.data[0]?.projects);
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
        getMasterData();
    }, []);

    useEffect(() => {
        // console.log('rows ', rows);
        reset(rows ? rows : {});
        if (rows) {
            setSelectedDate(rows);
        }
    }, [rows]);

    const getMasterData = async () => {
        let posturl = baseURL + "membermaster";
        await axios
            .get(posturl)
            .then((res) => {
                setLocalForm(res?.data[0]?.members);
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

    const handleDateChange = (date, name) => {
        setSelectedDate(prevContent => ({
            ...prevContent,
            [name]: date
        }));
        setValue(name, date);
    };

    const onSubmit = async (data) => {
        // console.log('sessionData ', sessionData);
        setDisabled(true);
        Object.assign(data, { userId: userId });
        Object.assign(data, { projectSlug: slug });
        Object.assign(data, { projectName: projectName });
        // Object.assign(data, { projectkey: key });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });
        Object.assign(data, { isInvited: true });
        Object.assign(data, { isJoined: false });
        Object.assign(data, { organization: organizationName });
        if (data?.role === "Administrator") {
            Object.assign(data, { projectSlug: '' });
            Object.assign(data, { projectName: '' });
        }

        try {
            const endpoint = baseURL + `member?slug=${slug}`;
            let method;

            if (rows) {
                if (isClone) {
                    Object.assign(data, { createdBy: sessionData.data.fullName });
                    Object.assign(data, { userId: userId });
                    Object.assign(data, {
                        projects: [{
                            name: projectName,
                            slug: slug,
                            active: true
                        }]
                    });
                    method = "post";
                    const { _id, ...newData } = data;
                    const { data: responseData } = await axios[method](endpoint, newData);
                    updateMemberList(responseData);
                } else {
                    Object.assign(data, { createdBy: sessionData.data.fullName });
                    Object.assign(data, { userId: userId });
                    Object.assign(data, { oldName: rows.name });
                    if (planningSwitch) {
                        Object.assign(data, {
                            projects: planningSwitch
                        });
                    }
                    method = "put";
                    const { data: responseData } = await axios[method](endpoint, data);
                    // console.log('responseData ', responseData);
                    updateMemberList(responseData);
                }
            } else {
                Object.assign(data, { createdBy: sessionData.data.fullName });
                Object.assign(data, { userId: userId });
                Object.assign(data, {
                    projects: [{
                        name: projectName,
                        slug: slug,
                        active: true
                    }]
                });
                method = "post";
                const { _id, ...newData } = data;
                const { data: responseData } = await axios[method](endpoint, newData);
                // console.log('responseData ', responseData);
                updateMemberList(responseData);
            }

            const successMessage = rows ? 'Record modified successfully!' : 'Record added successfully!';
            toast.success(successMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastId: 'success',
                theme: "light",
                style: {
                    width: '380px',
                },
            });
            updateIsBacklogUpdated(!isBacklogUpdated)
            updateIsMemberDrawer(false);
            setDisabled(false);
        } catch (error) {
            handleApiError(error);
            setDisabled(false);
        }
    };

    const handleApiError = (error) => {
        const errorMessage =
            error.status === 401 || error.status === 403 || error.status === 500
                ? error
                : "Sorry....the backend server is down!! Please try again later";

        if (error?.response?.data?.error) {
            setError('email', { type: 'custom', message: error.response.data.error });
        } else {
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
        }

        console.log(error);
    };


    const renderFormField = (field) => {
        if (field.quickAdd) {
            switch (field.type) {
                case 'team':
                    return (
                        <div className="mb-4" key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-semibold text-gray-600">
                                {field.label}
                                <span className="ml-3 cursor-pointer"
                                    onClick={() => {
                                        router.push("../team/team");
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: 20 }} />
                                </span>
                            </label>
                            <select
                                id={field.name}
                                name={field.name}
                                disabled={field.readOnly || localSessiondata?.data?.role !== "Administrator"}
                                {...register(field.name)}
                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value=""></option>
                                {teams !== null && teams !== undefined && teams.map((option, index) => (
                                    <option key={index} value={option.teamName}>
                                        {option.teamName}
                                    </option>
                                ))}
                            </select>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'dropdown':
                    return (
                        <div className="mb-4" key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-semibold text-gray-600">
                                {field.label}
                            </label>
                            <select
                                id={field.name}
                                name={field.name}
                                disabled={field.readOnly || localSessiondata?.data?.role !== "Administrator"}
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
                    );
                case 'textbox':
                    return (
                        <div>
                            {field.name === "email" ? (
                                <div className="mb-4" key={field.name}>
                                    <label htmlFor={field.name} className="block text-sm text-gray-600 font-semibold">
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        id={field.name}
                                        disabled={rows?.email}
                                        name={field.name}
                                        {...register(field.name)}
                                        className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                    />

                                    {errors[field.name] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-4" key={field.name}>
                                    <label htmlFor={field.name} className="block text-sm text-gray-600 font-semibold">
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        id={field.name}
                                        disabled={field.readOnly || localSessiondata?.data?.role !== "Administrator"}
                                        name={field.name}
                                        {...register(field.name)}
                                        className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors[field.name] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                    )}
                                </div>
                            )}

                        </div>

                    );
                case 'textarea':
                    return (
                        <div className="mb-4" key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-semibold text-gray-600">
                                {field.label}
                            </label>
                            <textarea
                                id={field.name}
                                name={field.name}
                                disabled={field.readOnly || localSessiondata?.data?.role !== "Administrator"}
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
                        <div className="mb-4" key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-semibold text-gray-600">
                                {field.label}
                            </label>
                            <textarea
                                rows="1"
                                id={field.name}
                                name={field.name}
                                disabled={field.readOnly || localSessiondata?.data?.role !== "Administrator"}
                                {...register(field.name)}
                                placeholder={`tag1,tag2,tag3 (Add tags as a comma separated list)`}
                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            ></textarea>
                        </div>
                    );
                case 'date':
                    return (
                        <div className="mb-4" key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-semibold text-gray-600">
                                {field.label}
                            </label>
                            <DatePicker
                                id={field.name}
                                name={field.name}
                                selected={selectedDate[field.name]}
                                onChange={(date) => { handleDateChange(date, field.name) }}
                                dateFormat={dateFormat}
                                autoComplete="off"
                                disabled={field.readOnly}
                                className={`scaleform max-w-[550px] min-w-[550px] ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                default:
                    return null;
            }
        }
    };

    return (
        <>
            <div className="rounded overflow-hidden">
                <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="sticky top-0 bg-slate-100 z-10">
                            <div>
                                <IconButton onClick={() => { updateIsMemberDrawer(false) }} edge="start" color="inherit" aria-label="close">
                                    <CloseRoundedIcon className="ml-4" />
                                </IconButton>
                            </div>
                            <div className="flex justify-center text-lg font-semibold -mt-5">
                                {isClone ? 'Clone Team Member' : (
                                    <span>
                                        {rows ? 'Edit Team Member' : 'Add Team Member'}
                                    </span>
                                )}
                            </div>
                            <Divider />
                        </div>
                        <div className="flex justify-center mt-4 min-h-[86vh]">
                            <div className="max-w-[550px] min-w-[550px]">
                                {!loading ? (
                                    <>
                                        {localForm.map((field) => renderFormField(field))}
                                        {rows?.projects?.length > 0 && isSuperAdmin && (
                                            <div className="mb-10">
                                                <PlanningModuleSwitch
                                                    handleProjectSelection={handleProjectSelection}
                                                    projectList={projectList}
                                                    selectedProjects={rows?.projects}
                                                />
                                            </div>
                                        )}
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
                            <div className="mt-3 mb-3">
                                <div className="flex justify-end mr-4">
                                    <div>
                                        <div className="flex">
                                            <button onClick={() => updateIsMemberDrawer(false)}
                                                className="pulsebuttonwhite mr-3  min-w-[140px]"
                                            >
                                                <span>Cancel</span>
                                            </button>
                                            {localSessiondata?.data?.role === "Administrator" && (
                                                <div>
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
                                            )}
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

export default CreateEvent;
