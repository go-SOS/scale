"use client";
import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";
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
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import PlanningModuleSwitch from './PlanningModuleSwitch';
import DevelopmentModuleSwitch from './DevelopmentModuleSwitch';
import TeamModuleSwitch from './TeamModuleSwitch';
import RaidModuleSwitch from './RaidModuleSwitch';
import SpecialModuleSwitch from './SpecialModuleSwitch';
import dynamic from 'next/dynamic';
import DatePicker from "react-datepicker";
import { useSession } from "next-auth/react";
import "react-datepicker/dist/react-datepicker.css";
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


const schema = yup.object().shape({
    projectName: yup.string().required('Please enter project name.'),
    projectKey: yup.string().required('Please enter key.'),
    expectedStartDate: yup.date().required('Please enter expected start date.').typeError('Invalid date'),
    expectedEndDate: yup
        .date()
        .required('Please enter expected end date.')
        .typeError('Invalid date')
        .min(yup.ref('expectedStartDate'), 'Expected End Date should be greater than or equal to Start Date'),
});

const CreateProject = () => {
    const baseURL = '/api/';
    const { updateIsProjectDrawer, updateProjectList, sessionData, userId, isProjectDrawer, updateCurrentProject } = useAppStore();
    const [localForm, setLocalForm] = useState(null);
    const [rows, setRows] = useState(null);
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [expertMode, setExpertMode] = useState(true);
    const [developmentSwitch, setDevelopmentSwitch] = useState([]);
    const [planningSwitch, setPlanningSwitch] = useState([]);
    const [raidSwitch, setRaidSwitch] = useState([]);
    const [teamSwitch, setTeamSwitch] = useState([]);
    const [specialSwitch, setSpecialSwitch] = useState([]);
    const [content, setContent] = useState({});
    const [allModes, setAllModes] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const modulesList = {
        "Filters": true,
        "TeamCharter": true,
        "Plan": true,
        "Backlog": true,
        "Sprints": true,
        "Releases": true,
        "Risk": true,
        "Assumptions": true,
        "Issues": true,
        "Dependencies": true,
        "Stakeholders": true,
        "Retrospectives": true
    };

    useEffect(() => {
        // console.log('developmentSwitch ', developmentSwitch);
        const combinedSwitches = [
            ...developmentSwitch,
            ...planningSwitch,
            ...raidSwitch,
            ...teamSwitch,
            ...specialSwitch
        ].filter(item => item.name && item.active);

        const modesObject = combinedSwitches.reduce((acc, item) => {
            const sanitizedKey = item.name.replace(/\s+/g, '');
            acc[sanitizedKey] = item.active;
            //    acc[sanitizedKey] = item.active;
            return acc;
        }, {});

        setAllModes(modesObject);

    }, [developmentSwitch, planningSwitch, raidSwitch, teamSwitch, specialSwitch]);

    const contentconfig = useMemo(
        () => ({
            readonly: false,
            placeholder: "Enter Content",
            minHeight: 200,
            showCharsCounter: true,
            showWordsCounter: true,
            buttons: [
                'paragraph',
                'source',
                'bold',
                'italic',
                'underline',
                'font',
                'fontsize',
                // 'image',
                'table',
                'align',
                'undo',
                'redo',
                'fullsize',
                'brush',
                // 'strikethrough',
                // 'eraser',
                // 'superscript',
                // 'subscript',
                // 'ul',
                // 'ol',
                // 'outdent',
                // 'indent',
                // 'file',
                // 'video',
                // 'link',
                // 'copyformat',
                // 'hr',
                // 'symbol',
                // 'print',
                // 'about'
            ],
            toolbar: true,
            toolbarAdaptive: false,
            toolbarSticky: false,
            showCharsCounter: true,
            showWordsCounter: true,
            showXPathInStatusbar: false,
        }),
        []
    );

    const onContentBlur = useCallback(
        (newContent, name) => {
            setContent(prevContent => ({
                ...prevContent,
                [name]: newContent // Update the content for the specific textarea field
            }));
            setValue(name, newContent);
        },
        [content]
    );



    // useEffect(() => {
    //     console.log('allModes ', allModes);
    // }, [allModes])


    const handleDevelopmentSwitch = (newState) => {
        setDevelopmentSwitch(newState);
    }

    const handlePlanningSwitch = (newState) => {
        setPlanningSwitch(newState);
    }

    const handleRaidSwitch = (newState) => {
        setRaidSwitch(newState);
    }

    const handleTeamSwitch = (newState) => {
        setTeamSwitch(newState);
    }

    const handleSpecialSwitch = (newState) => {
        setSpecialSwitch(newState);
    }

    const toggleExpertMode = () => {
        setExpertMode(!expertMode);
        if (expertMode) {
            setModules({});
        } else {
            setModules(modulesList);
        }
    }

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

    useEffect(() => {
        // console.log('Rows modules ', rows?.modules);
        setModules(rows ? rows?.modules : modulesList);
        reset(rows ? rows : {});
        if (rows) {
            setSelectedDate(rows);
        }
        setExpertMode(rows?.expertMode);
    }, [rows]);

    useEffect(() => {
        if (isProjectDrawer !== true && isProjectDrawer !== false) {
            getData();
        } else {
            setExpertMode(true);
        }
    }, [isProjectDrawer]);

    useEffect(() => {
        getMasterData();
    }, []);

    const getMasterData = async () => {
        let posturl = baseURL + "projectmaster";
        await axios
            .get(posturl)
            .then((res) => {
                setLocalForm(res?.data[0]?.projects);
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

    const onSubmit = async (data) => {
        setDisabled(true);
        // console.log(data);
        Object.assign(data, { userId: userId });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });
        Object.assign(data, { modules: allModes });
        Object.assign(data, { expertMode: expertMode });

        try {
            const endpoint = baseURL + "project";
            let method;
            if (rows) {
                Object.assign(data, { createdBy: sessionData.data.fullName });
                Object.assign(data, { userId: userId });
                Object.assign(data, { oldName: rows.name });
                method = "put";
                const { data: responseData } = await axios[method](endpoint, data);
                // console.log('responseData ', responseData);
                updateProjectList(responseData);
                updateCurrentProject(responseData[0]);
            } else {
                Object.assign(data, { createdBy: sessionData.data.fullName });
                Object.assign(data, { userId: userId });
                Object.assign(data, { isActive: true });
                method = "post";
                const { _id, ...newData } = data;
                const { data: responseData } = await axios[method](endpoint, newData);
                // console.log('project response ', responseData);
                updateProjectList(responseData);
                updateCurrentProject(responseData[0]);
            }
            setDisabled(false);
            const successMessage = rows ? 'Project details modified successfully!' : 'New project added successfully!';
            toast.success(successMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                toastId: 'success',
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: {
                    width: '380px',
                },
            });
            updateIsProjectDrawer(false);
        } catch (error) {
            setDisabled(false);
            handleApiError(error);
        }
    };

    const handleApiError = (error) => {
        const errorMessage =
            error.status === 401 || error.status === 403 || error.status === 500
                ? error
                : "Sorry....the backend server is down!! Please try again later";

        if (error?.response?.data?.nameError) {
            setError('projectName', { type: 'custom', message: error.response.data.nameError });
        }
        else
            if (error?.response?.data?.keyError) {
                setError('projectKey', { type: 'custom', message: error.response.data.keyError });
            }
            else {
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

    const getData = async () => {
        let posturl = baseURL + "project?id=" + isProjectDrawer;

        try {
            const response = await axios.get(posturl);
            setRows(response?.data[0]);
            setContent(response?.data[0]);
        } catch (error) {
            console.log(error);
            if (error?.response?.status === 401) {
                deleteCookie("logged");
                signOut();
            }
        }
    };


    const handleInputChange = (e, fieldName) => {
        if (fieldName === 'projectName' && !rows) {
            let inputValue = e.target.value.trim();
            inputValue = inputValue.slice(0, 3);
            const uniqueChars = generateKeyFromProjectName(e.target.value);
            setValue('projectKey', uniqueChars);
            const slug = generateSlugFromProjectName(e.target.value);
            setValue('projectSlug', slug);
        }
    };

    const generateKeyFromProjectName = (projectName) => {
        const words = projectName.split(' ');
        const initials = words.map(word => {
            const firstTwoChars = word.slice(0, 2).toUpperCase();
            return firstTwoChars;
        });
        const key = initials.join('');
        return key;
    };

    const generateSlugFromProjectName = (projectName) => {
        let slug = projectName.toLowerCase();
        slug = slug.replace(/\s+/g, '-');
        slug = slug.replace(/[^a-z0-9-]/g, '');
        return slug;
    };

    const handleDateChange = (date, name) => {
        setSelectedDate(prevContent => ({
            ...prevContent,
            [name]: date
        }));
        setValue(name, date);
    };

    const renderFormField = (field) => {
        if (field.quickAdd) {
            switch (field.type) {
                case 'dropdown':
                    return (
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
                                {/* <option value="">None</option> */}
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
                        <>
                            <div className="mb-5" key={field.name}>
                                <label htmlFor={field.name} className="scaleformlabel">
                                    {field.label}
                                </label>
                                <input
                                    type="text"
                                    id={field.name}
                                    disabled={field.readOnly || (field.name === "projectKey" && rows?.projectKey)}
                                    name={field.name}
                                    {...register(field.name)}
                                    onChange={(e) => handleInputChange(e, field.name)}
                                    className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                )}
                            </div>
                        </>

                    );
                case 'textarea':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
                                {field.label}
                            </label>
                            <JoditEditor
                                value={content[field.name] || ''}
                                config={contentconfig}
                                tabIndex={1}
                                onBlur={(newContent) => { onContentBlur(newContent, field.name) }}
                                name={field.name}
                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {/* <textarea
                                id={field.name}
                                name={field.name}
                                disabled={field.readOnly}
                                {...register(field.name)}
                                rows="3"
                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            ></textarea> */}
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
                        <div className="mb-10" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
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
                                <IconButton onClick={() => { updateIsProjectDrawer(false) }} edge="start" color="inherit" aria-label="close">
                                    <CloseRoundedIcon className="ml-4" />
                                </IconButton>
                            </div>
                            <div className="flex justify-center text-lg font-semibold -mt-5">
                                {rows ? 'Edit Project' : 'New Project'}
                            </div>
                            <Divider />
                        </div>
                        <div className="flex justify-center mt-4 min-h-[86vh]">
                            <div className="max-w-[550px] min-w-[550px]">
                                {!loading ? (
                                    <div className="mb-16">
                                        {localForm.map((field) => renderFormField(field))}
                                        <div>
                                            {/* {!rows && ( */}
                                            <div className="flex items-center justify-between pt-5 pb-2">
                                                <span className="font-semibold">Expert mode</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={expertMode}
                                                        onChange={() => toggleExpertMode()}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            {/* )} */}
                                        </div>
                                        <PlanningModuleSwitch handlePlanningSwitch={handlePlanningSwitch} rowModules={modules} />
                                        <DevelopmentModuleSwitch handleDevelopmentSwitch={handleDevelopmentSwitch} rowModules={modules} />
                                        <TeamModuleSwitch handleTeamSwitch={handleTeamSwitch} rowModules={modules} />
                                        <RaidModuleSwitch handleRaidSwitch={handleRaidSwitch} rowModules={modules} />
                                        <SpecialModuleSwitch handleSpecialSwitch={handleSpecialSwitch} rowModules={modules} />
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
                                            <button onClick={() => updateIsProjectDrawer(false)}
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

export default CreateProject;
