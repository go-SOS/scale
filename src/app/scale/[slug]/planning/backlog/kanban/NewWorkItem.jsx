import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";
import useAppStore from '@/store/appStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import { useSession } from "next-auth/react";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Modal from "./Modal";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const schema = yup.object().shape({
    summary: yup.string().required('Please enter summary.'),
    startDate: yup.date().required('Please enter start date.').typeError('Invalid date'),
    dueDate: yup
        .date()
        .required('Please enter end date.')
        .typeError('Invalid date')
        .min(yup.ref('startDate'), 'Due Date should be greater than or equal to Start Date'),
});

const NewWorkItem = ({ handleCloseCreating, backlogType, backlogTypeName }) => {
    const baseURL = '/api/';
    const { updateIsWorkitemDrawer, sessionData, userId, updateIsBacklogUpdated, isBacklogUpdated, backlogSteps, backlogmaster } = useAppStore();
    const { projectName, slug, key } = useSlug();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [disabled, setDisabled] = useState(false);
    const { updateBacklogList } = useAppStore();
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const [workflows, setWorkflows] = useState([]);
    const today = dayjs();
    const [startDate, setStartDate] = useState(dayjs());
    const [dueDate, setDueDate] = useState(dayjs());
    const [isOpen, setIsOpen] = useState(false);
    const [workItemType, setWorkItemType] = useState(null);
    const [status, setStatus] = useState(null);
    const [priority, setPriority] = useState(null);
    const [storyPoints, setStoryPoints] = useState(null);

    const handleStartDateChange = (newDate) => {
        setStartDate(newDate);
        // console.log('newDate ', JSON.stringify(newDate));
        setValue('startDate', newDate);
    };

    const handleEndDateChange = (newDate) => {
        setDueDate(newDate);
        setValue('dueDate', newDate);
    };

    const dateFormats = [
        { key: 'MM/dd/yyyy', value: 'MM/dd/yyyy  (12/31/2099)' },
        { key: 'dd/MM/yyyy', value: 'dd/MM/yyyy  (31/12/2099)' },
        { key: 'yyyy-MM-dd', value: 'yyyy-MM-dd  (2099-12-31)' },
        { key: 'dd MMMM yyyy', value: 'dd MMMM yyyy  (31 December 2099)' },
        { key: 'MMMM dd, yyyy', value: 'MMMM dd, yyyy  (December 31, 2099)' },
        { key: 'EEE, MMM dd, yyyy', value: 'EEE, MMM dd, yyyy  (Tue, Dec 31, 2099)' },
        { key: 'yyyy/MM/dd', value: 'yyyy/MM/dd  (2099/12/31)' },
        { key: 'MM-dd-yyyy', value: 'MM-dd-yyyy  (12-31-2099)' },
        { key: 'dd-MM-yyyy', value: 'dd-MM-yyyy  (31-12-2099)' },
    ];
    const dayjsFormats = [
        'MM/DD/YYYY',
        'DD MMM YYYY',
        'YYYY-MM-DD',
        'MMMM D, YYYY',
        'MMMM D, YYYY',
        'ddd, MMM D, YYYY',
        'YYYY/MM/DD',
        'MM-DD-YYYY',
        'DD-MM-YYYY',
    ];

    const selectedDateFormatIndex = dateFormats.findIndex(format => format.key === dateFormat);

    useEffect(() => {
        setValue('startDate', dayjs());
        getData();
    }, []);

    const getWorkflow = async () => {
        let posturl = `${baseURL}workflow?name=backlog`;

        try {
            const response = await axios.get(posturl);
            setWorkflows(response?.data[0]?.stages);
            setLoading(false);
        } catch (error) {
            console.error("Error", error);
        }
    };

    const getData = async () => {
        let posturl = baseURL + `assignee?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setMembers(res.data);
                getWorkflow();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
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


    const handleInputChange = (e, fieldName) => {
        if (fieldName === 'summary') {
            let inputValue = e.target.value.trim();
            inputValue = inputValue.slice(0, 3);
            const uniqueChars = generateKeyFromProjectName(e.target.value);
            setValue('backlogKey', uniqueChars);
        }
    };

    const getFirstNameByEmail = (email) => {
        const teamMember = members.find(member => member.email === email);
        return teamMember ? teamMember.fullName : null;
    }

    const onSubmit = async (data) => {
        setDisabled(true);
        // console.log(data);
        Object.assign(data, { userId: userId });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { projectSlug: slug });
        Object.assign(data, { projectName: projectName });
        Object.assign(data, { backlogType: backlogType });
        Object.assign(data, { backlogTypeName: backlogTypeName });
        // Object.assign(data, { workItemType: workItemType });
        if (data.assignee) {
            let fullName = getFirstNameByEmail(data.assignee);
            Object.assign(data, { fullName: fullName });
        }
        const item = backlogSteps.find(item => item.name === backlogTypeName);
        const stepId = item?._id;
        Object.assign(data, { stepId: stepId });
        // Object.assign(data, { dueDate: 7 });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });

        try {
            const endpoint = baseURL + `backlog?slug=${slug}`;
            let method;

            Object.assign(data, { createdBy: sessionData.data.fullName });
            Object.assign(data, { userId: userId });
            Object.assign(data, { backlogKey: key + "-WORK-" });
            if (!data.status) {
                data.status = "To Do";
            }
            method = "post";
            const { _id, ...newData } = data;
            const { data: responseData } = await axios[method](endpoint, newData);
            // console.log('responseData ', responseData);
            updateBacklogList(responseData);

            updateIsBacklogUpdated(!isBacklogUpdated);
            const successMessage = 'Record added successfully!';
            toast.success(successMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: 'success',
                draggable: true,
                progress: undefined,
                theme: "light",
                style: {
                    width: '380px',
                },
            });
            updateIsWorkitemDrawer(false);
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

    const toggleDropdown = (type) => {
        if (type === "type") {
            setIsOpen("type");
        }
        else if (type === "status") {
            setIsOpen("status");
        }
        else if (type === "priority") {
            setIsOpen("priority");
        }
        else if (type === "storyPoints") {
            setIsOpen("storyPoints");
        }
        else {
            setIsOpen(false);
        }
    };

    const handleModalClose = () => {
        setIsOpen(false);
    };

    const getWorkItemTypeColor = (workItemType) => {
        switch (workItemType) {
            case 'Epic':
                return 'bg-purple-200 border-purple-300';
            case 'Feature':
                return 'bg-blue-200 border-blue-300';
            case 'Story':
                return 'bg-green-200 border-green-300';
            case 'Bug':
                return 'bg-red-200 border-red-300';
            case 'Technical Debt':
                return 'bg-gray-200 border-gray-300';
            case 'Proof of Concept':
                return 'bg-orange-200 border-orange-300';
            case 'Spike':
                return 'bg-yellow-200 border-yellow-300';
            case 'Enabler':
                return 'bg-teal-200 border-teal-300';
            case 'Technical Improvement':
                return 'bg-indigo-200 border-indigo-300';
            case 'Process Improvement':
                return 'bg-pink-200 border-purple-300';
            default:
                return 'bg-gray-200 border-gray-300';
        }
    };

    const getStatusTypeColor = (status) => {
        switch (status) {
            case 'Backlog':
                return 'text-blue-500';
            case 'To Do':
                return 'text-teal-500';
            case 'In Progress':
                return 'text-yellow-500';
            case 'Done':
                return 'text-green-500';
            case 'Cancelled':
                return 'text-red-500';
            case 'Duplicate':
                return 'text-purple-500';
            default:
                return 'text-gray-500';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical':
                return 'border-red-300';
            case 'High':
                return 'border-orange-500';
            case 'Medium':
                return 'border-yellow-500';
            case 'Low':
                return 'border-green-500';
            default:
                return 'border-gray-500';
        }
    };

    const filterByName = (name) => {
        const options = backlogmaster.filter(field => field.name === name);
        const optionList = options[0].optionList;
        return optionList;
    };

    const handleSelect = (item) => {
        // console.log('Selected Item:', item);
        setValue(item.type, item.value);
        if (item.type === "workItemType") {
            setWorkItemType(item.value);
        }
        if (item.type === "status") {
            setStatus(item.value);
        }
        if (item.type === "priority") {
            setPriority(item.value);
        }
        if (item?.type === "storyPoints") {
            setStoryPoints(item.value);
        }
    };


    return (
        <>
            <div className="rounded overflow-hidden -mb-2 -mt-1">
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex justify-between">
                            <div className="ml-3">
                                <label htmlFor="summary" className="block text-[13px] text-gray-600 font-semibold mb-1">
                                    Summary
                                </label>
                                <input
                                    type="text"
                                    id="summary"
                                    name="summary"
                                    {...register("summary")}
                                    onChange={(e) => handleInputChange(e, "summary")}
                                    className={`px-2 mt-[1px] py-[2px] border rounded-md min-w-[10vw] text-[13px] ${errors["summary"] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors["summary"] && (
                                    <p className="text-red-500 text-[13px] mt-1">{errors["summary"].message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-[13px] text-gray-600 font-semibold">
                                    Type
                                </label>
                                <div className="mt-1">
                                    <div onClick={() => toggleDropdown('type')}>
                                        <span className={`text-[12px] px-2 py-[3px] cursor-pointer border rounded-md ${getWorkItemTypeColor(workItemType)}`}>
                                            {workItemType ? workItemType : 'Select type'}
                                        </span>
                                    </div>
                                </div>
                                {
                                    isOpen === "type" && (
                                        <div>
                                            <Modal
                                                handleModalClose={handleModalClose}
                                                items={filterByName("workItemType")}
                                                handleSelect={handleSelect}
                                                type="workItemType"
                                            />
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                <label htmlFor="summary" className="block text-[13px] text-gray-600 font-semibold">
                                    Status
                                </label>
                                <div className="mt-1">
                                    <div onClick={() => toggleDropdown('status')}>
                                        <span className={`text-[12px] px-2 py-[3px] cursor-pointer border-slate-400 border rounded-md ${getStatusTypeColor(status)}`}>
                                            {status ? status : 'Select status'}
                                        </span>
                                    </div>
                                </div>
                                {
                                    isOpen === "status" && (
                                        <div>
                                            <Modal
                                                handleModalClose={handleModalClose}
                                                items={filterByName("status")}
                                                handleSelect={handleSelect}
                                                type="status"
                                            />
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                <label htmlFor="summary" className="block text-[13px] text-gray-600 font-semibold">
                                    Priority
                                </label>
                                <div className="mt-1">
                                    <div onClick={() => toggleDropdown('priority')}>
                                        <span className={`text-[12px] px-2 py-[3px] cursor-pointer border rounded-md ${getPriorityColor(priority)}`}>
                                            {priority ? priority : 'Select priority'}
                                        </span>
                                    </div>
                                </div>
                                {
                                    isOpen === "priority" && (
                                        <div>
                                            <Modal
                                                handleModalClose={handleModalClose}
                                                items={filterByName("priority")}
                                                handleSelect={handleSelect}
                                                type="priority"
                                            />
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                <label htmlFor="summary" className="block text-[13px] text-gray-600 font-semibold">
                                    Story Points
                                </label>
                                <div className="mt-1">
                                    <div onClick={() => toggleDropdown('storyPoints')}>
                                        <span className={`text-[12px] px-2 py-[3px] cursor-pointer border border-slate-400 rounded-md`}>
                                            {storyPoints ? storyPoints : 'Select points'}
                                        </span>
                                    </div>
                                </div>
                                {
                                    isOpen === "storyPoints" && (
                                        <div>
                                            <Modal
                                                handleModalClose={handleModalClose}
                                                items={filterByName("storyPoints")}
                                                handleSelect={handleSelect}
                                                type="storyPoints"
                                            />
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                <div className="mb-5 z-50">
                                    <label htmlFor="startDate" className="block text-[13px] text-gray-600 font-semibold">
                                        Start Date
                                    </label>
                                    <div className="mt-2">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <MobileDatePicker
                                                value={startDate}
                                                onChange={handleStartDateChange}
                                                format={dayjsFormats[selectedDateFormatIndex]}
                                                sx={{
                                                    width: '130px',
                                                    '.MuiInputBase-root': {
                                                        fontSize: '12px',
                                                        // paddingLeft: '5px',
                                                        // paddingRight: '5px',
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider >
                                    </div>
                                    {errors.startDate && (
                                        <p className="text-red-500 text-[13px] mt-1">{errors.startDate.message}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="mb-5">
                                    <label htmlFor="dueDate" className="block text-[13px] text-gray-600 font-semibold">
                                        Due Date
                                    </label>
                                    <div className="mt-2">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <MobileDatePicker
                                                value={dueDate}
                                                onChange={handleEndDateChange}
                                                format={dayjsFormats[selectedDateFormatIndex]}
                                                sx={{
                                                    width: '130px',
                                                    '.MuiInputBase-root': {
                                                        fontSize: '12px',
                                                        color: dueDate.isBefore(today) ? 'red' : 'inherit',
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    {errors.dueDate && (
                                        <p className="text-red-500 text-[13px] mt-1">{errors.dueDate.message}</p>
                                    )}
                                </div>
                            </div>
                            {!loading && (
                                <div className="mb-5">
                                    <label htmlFor="assignee" className="block text-[13px] text-gray-600 font-semibold mb-1">
                                        Assignee
                                    </label>
                                    <select
                                        id="assignee"
                                        name="assignee"
                                        {...register("assignee")}
                                        className={`text-[12px] px-2 py-[3px] cursor-pointer border rounded-md min-w-[5vw] ${errors.assignee ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value=""></option>
                                        {members !== null && members !== undefined && members.map((option, index) => (
                                            <option key={index} value={option.email}>
                                                {option.fullName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.assignee && (
                                        <p className="text-red-500 text-[13px] mt-1">{errors.assignee.message}</p>
                                    )}
                                </div>
                            )}
                            <div className="min-h-[60px]">
                                <div className="mt-4">
                                    <div className="flex justify-end mr-4">
                                        <div>
                                            <div className="flex">
                                                <button onClick={() => handleCloseCreating()}
                                                    className="mr-3"
                                                >
                                                    <CancelOutlinedIcon sx={{ fontSize: 30 }} className="text-orange-600" />
                                                </button>
                                                {disabled ? (
                                                    <div
                                                        className="px-3mr-1"
                                                        style={{ opacity: 0.5, pointerEvents: 'none' }}
                                                    >
                                                        <CheckCircleOutlineIcon sx={{ fontSize: 30 }} color="primary" className="text-blue-600" />
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
                                                        >
                                                            <CheckCircleOutlineIcon sx={{ fontSize: 30 }} className="text-blue-600" />
                                                        </button>
                                                    )
                                                }
                                            </div>
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


export default NewWorkItem;
