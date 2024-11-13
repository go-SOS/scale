import React, { useEffect, useRef, useState } from "react";
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
import useSlug from "@/app/scale/layout/hooks/useSlug";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePathname } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import LabelAutocomplete from "@/components/bookmark/autocomplete";
import LabelForm from "@/common/labels/labelForm";
import RiskAutocomplete from "@/components/autocomplete/riskautocomplete";
import AssumptionAutocomplete from "@/components/autocomplete/assumptionautocomplete";
import IssueAutocomplete from "@/components/autocomplete/issueautocomplete";
import DependencyAutocomplete from "@/components/autocomplete/dependencyautocomplete";
import InputSlider from "@/components/roadmap/inputSlider";

const schema = yup.object().shape({
    summary: yup.string().required('Please enter summary.'),
    startDate: yup.date().required('Please enter start date.').typeError('Invalid date'),
    dueDate: yup
        .date()
        .required('Please enter end date.')
        .typeError('Invalid date')
        .min(yup.ref('startDate'), 'Due Date should be greater than or equal to Start Date'),
});

const CreateEvent = () => {
    const baseURL = '/api/';
    const { updateIsWorkitemDrawer, sessionData, userId, updateIsBacklogUpdated, isBacklogUpdated, isWorkitemDrawer, backlogSteps, isClone } = useAppStore();
    const [localForm, setLocalForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [workitemtype, setWorkitemtype] = useState("");
    const [members, setMembers] = useState([]);
    const [rows, setRows] = useState(null);
    const [parents, setParents] = useState(null);
    const { projectName, slug, key } = useSlug();
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
    const { projectList, updateBacklogList, updatedIsKanbanRefresh } = useAppStore();
    const [projects, setProjects] = useState("");
    const [id, setId] = useState(null);
    const [currentSlug, setCurrentSlug] = useState(slug);
    const [currentKey, setCurrentKey] = useState(key);
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const currentPath = usePathname();
    const [isTimeline, setIsTimeline] = useState(false);
    const [workflows, setWorkflows] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState([]);
    const [showLabel, setShowLabel] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState([]);
    const [selectedAssumption, setSelectedAssumption] = useState([]);
    const [selectedDependency, setSelectedDependency] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState([]);
    const [riskArray, setRiskArray] = useState([]);
    const [dependencyArray, setDependencyArray] = useState([]);
    const [issueArray, setIssueArray] = useState([]);
    const [assumptionArray, setAssumptionArray] = useState([]);
    const [progress, setProgress] = useState(0);

    const handleTrackProgress = (newValue) => {
        setProgress(newValue);
        setValue('progress', newValue);
    }

    const getriskworkitem = async () => {
        let posturl = baseURL + `riskworkitem?slug=${slug}&backlogId=${isWorkitemDrawer}`;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('getriskworkitem ', res.data);
                const mainArray = res?.data;

                const dependenciesArray = [];
                const issuesArray = [];
                const assumptionsArray = [];
                const risksArray = [];

                mainArray.forEach(item => {
                    if (item.dependencyId) {
                        dependenciesArray.push(item);
                    }
                    if (item.issueId) {
                        issuesArray.push(item);
                    }
                    if (item.assumptionId) {
                        assumptionsArray.push(item);
                    }
                    if (item.riskId) {
                        risksArray.push(item);
                    }
                });

                setDependencyArray(dependenciesArray);
                setIssueArray(issuesArray);
                setAssumptionArray(assumptionsArray);
                setRiskArray(risksArray);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSeletedRisk = (newRecord) => {
        setSelectedRisk(newRecord);
    }

    const handleSeletedAssumption = (newRecord) => {
        setSelectedAssumption(newRecord);
    }

    const handleSeletedDependency = (newRecord) => {
        setSelectedDependency(newRecord);
    }

    const handleSeletedIssue = (newRecord) => {
        setSelectedIssue(newRecord);
    }

    const handleShowLabel = (newState) => {
        setShowLabel(newState);
    }

    const handleSeletedLabel = (newRecord) => {
        setSelectedLabel(newRecord);
    }

    useEffect(() => {
        setProjects(projectList);
    }, [projectList]);

    useEffect(() => {
        const isTimelineIncluded = currentPath.includes('timeline');
        setIsTimeline(isTimelineIncluded);
        getMasterData();
    }, []);

    useEffect(() => {
        if (isWorkitemDrawer !== true && isWorkitemDrawer !== false) {
            getWorkItem();
        }
    }, [isWorkitemDrawer]);

    useEffect(() => {
        // console.log('formData ', rows);
        setId(rows ? rows._id : null);
        reset(rows ? rows : {});
        if (rows) {
            setSelectedDate(rows);
            setSelectedLabel(rows?.labels);
            setValue('startDate', rows?.startDate);
            setValue('dueDate', rows?.dueDate);
            setProgress(rows?.progress);
        }
    }, [rows]);

    const getWorkItem = async () => {
        let posturl = baseURL + "backlog?id=" + isWorkitemDrawer;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('Backlog ', res?.data[0]);
                setRows(res?.data[0]);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const getWorkflow = async () => {
        let posturl = `${baseURL}workflow?name=backlog`;

        try {
            const response = await axios.get(posturl);
            setWorkflows(response?.data[0]?.stages);
            getParent();
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

    const getMasterData = async () => {
        let posturl = baseURL + "backlogmaster";
        await axios
            .get(posturl)
            .then((res) => {
                setLocalForm(res?.data[0]?.backlogs);
                getData();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const getParent = async () => {
        let posturl = baseURL + `backlog?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setParents(res.data);
                getriskworkitem();
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

    const handleDropdownChange = (e, fieldName) => {
        if (fieldName === 'workItemType') {
            let inputValue = e.target.value;
            setWorkitemtype(inputValue);
        }
        if (fieldName === 'projectName') {
            if (projectList) {
                let inputVal = e.target.value;
                console.log('projectName ', inputVal);
                const project = projectList.find(proj => proj.projectName === inputVal);
                let pSlug = project?.projectSlug || '';
                let pKey = project?.projectKey || '';
                setCurrentSlug(pSlug);
                setCurrentKey(pKey);
            }
        }
    };

    const handleDateChange = (date, name) => {
        setSelectedDate(prevContent => ({
            ...prevContent,
            [name]: date
        }));
        setValue(name, date);
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
        Object.assign(data, { projectSlug: currentSlug });
        Object.assign(data, { projectName: projectName });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });
        data.labels = selectedLabel;
        data.risk = selectedRisk;
        data.assumption = selectedAssumption;
        data.dependency = selectedDependency;
        data.issue = selectedIssue;
        Object.assign(data, { progress: progress });

        if (data.assignee) {
            let fullName = getFirstNameByEmail(data.assignee);
            Object.assign(data, { fullName: fullName });
        }
        if (data.parent) {
            const parentSummary = parents.filter(item => item._id == data.parent);
            Object.assign(data, { parentSummary: parentSummary[0]?.summary });
        }
        try {
            const endpoint = baseURL + `backlog?slug=${slug}`;
            let method;

            if (rows) {
                if (isClone) {
                    Object.assign(data, { backlogKey: currentKey + "-WORK-" });
                    Object.assign(data, { updatedBy: sessionData.data.email });
                    Object.assign(data, { userId: userId });
                    Object.assign(data, { backlogKey: rows.backlogKey });
                    Object.assign(data, { progress: progress });
                    if (!data.status) {
                        data.status = "To Do";
                    }
                    method = "post";
                    const { _id, ...newData } = data;
                    const { data: responseData } = await axios[method](endpoint, newData);
                    updateBacklogList(responseData);
                } else {
                    if (!data.status) {
                        data.status = "To Do";
                    }
                    Object.assign(data, { updatedBy: sessionData.data.email });
                    Object.assign(data, { userId: userId });
                    Object.assign(data, { backlogKey: rows.backlogKey });
                    Object.assign(data, { progress: progress });
                    method = "put";
                    const { data: responseData } = await axios[method](endpoint, data);
                    updateBacklogList(responseData);
                }
            } else {
                const item = backlogSteps.find(item => item.name === "Product Backlog");
                const stepId = item?._id;
                Object.assign(data, { stepId: stepId });
                Object.assign(data, { backlogType: "WorkItem" });
                Object.assign(data, { backlogTypeName: "Product Backlog" });
                Object.assign(data, { createdBy: sessionData.data.fullName });
                Object.assign(data, { userId: userId });
                Object.assign(data, { backlogKey: currentKey + "-WORK-" });
                Object.assign(data, { progress: progress });
                if (!data.status) {
                    data.status = "To Do";
                }
                method = "post";
                const { _id, ...newData } = data;
                const { data: responseData } = await axios[method](endpoint, newData);
                updateBacklogList(responseData);
            }
            updateIsBacklogUpdated(!isBacklogUpdated);
            updatedIsKanbanRefresh(true);
            const successMessage = 'Work item added successfully!';
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
        } catch (error) {
            handleApiError(error);
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

    const renderFormField = (field) => {
        if (field.summaryType === "Backlog" || field.summaryType === workitemtype) {
            switch (field.type) {
                case 'project':
                    return (
                        <div className="mb-4" key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-semibold text-gray-600">
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
                                <option value={projectName}>{projectName}</option>
                                {projects !== null && projects !== undefined && projects.filter(name => name.projectName !== projectName).map((option, index) => (
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
                case 'risk':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel mb-2">
                                {field.label}
                            </label>
                            <div className='mr-3'>
                                <div className="flex">
                                    <RiskAutocomplete handleSeletedRecord={handleSeletedRisk} />
                                </div>
                                <ul className="text-gray-700 list-disc ml-5">
                                    {riskArray.length > 0 && riskArray.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            - {item?.riskSummary}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'issue':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel mb-2">
                                {field.label}
                            </label>
                            <div className='mr-3'>
                                <div className="flex">
                                    <IssueAutocomplete handleSeletedRecord={handleSeletedIssue} />
                                </div>
                                <ul className="text-gray-700 list-disc ml-5">
                                    {issueArray.length > 0 && issueArray.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            - {item?.issueSummary}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'assumption':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel mb-2">
                                {field.label}
                            </label>
                            <div className='mr-3'>
                                <div className="flex">
                                    <AssumptionAutocomplete handleSeletedRecord={handleSeletedAssumption} />
                                </div>
                                <ul className="text-gray-700 list-disc ml-5">
                                    {assumptionArray.length > 0 && assumptionArray.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            - {item?.assumptionSummary}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'dependency':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel mb-2">
                                {field.label}
                            </label>
                            <div className='mr-3'>
                                <div className="flex">
                                    <DependencyAutocomplete handleSeletedRecord={handleSeletedDependency} />
                                </div>
                                <ul className="text-gray-700 list-disc ml-5">
                                    {dependencyArray.length > 0 && dependencyArray.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            - {item?.dependencySummary}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'label':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
                                {field.label}
                            </label>
                            <span className="text-blue-500 text-sm cursor-pointer" onClick={() => setShowLabel(true)}>
                                <AddIcon fontSize="small" /> Create new label
                            </span>
                            <div className="flex mt-2">
                                <LabelAutocomplete handleSeletedRecord={handleSeletedLabel} />
                            </div>
                            <ul className="text-gray-700 list-disc ml-5">
                                {selectedLabel !== undefined && selectedLabel.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        - {item}
                                    </li>
                                ))}
                            </ul>
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                            )}
                        </div>
                    );
                case 'parent':
                    return (
                        <div>
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
                                    <option value=""></option>
                                    {parents !== null && parents !== undefined && parents.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.summary}
                                        </option>
                                    ))}
                                </select>
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                )}
                            </div>
                        </div>
                    );
                case 'team':
                    return (
                        <div>
                            {isTimeline ? (
                                <div>
                                    {rows && (
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
                                                <option value=""></option>
                                                {members !== null && members !== undefined && members.map((option, index) => (
                                                    <option key={index} value={option.email}>
                                                        {option.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[field.name] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
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
                                        <option value=""></option>
                                        {members !== null && members !== undefined && members.map((option, index) => (
                                            <option key={index} value={option.email}>
                                                {option.fullName}
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
                case 'dropdown':
                    return (
                        <div>
                            {isTimeline ? (
                                <div>
                                    {rows && (
                                        <div className="mb-5" key={field.name}>
                                            <label htmlFor={field.name} className="scaleformlabel">
                                                {field.label}
                                            </label>
                                            <select
                                                id={field.name}
                                                name={field.name}
                                                disabled={field.readOnly}
                                                {...register(field.name)}
                                                onChange={(e) => handleDropdownChange(e, field.name)}
                                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value=""></option>
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
                            ) : (
                                <div className="mb-5" key={field.name}>
                                    <label htmlFor={field.name} className="scaleformlabel">
                                        {field.label}
                                    </label>
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        disabled={field.readOnly}
                                        {...register(field.name)}
                                        onChange={(e) => handleDropdownChange(e, field.name)}
                                        className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                    >
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
                case 'workitem':
                    return (
                        <div>
                            {isTimeline ? (
                                <div>
                                    {rows && (
                                        <div className="mb-5" key={field.name}>
                                            <label htmlFor={field.name} className="scaleformlabel">
                                                {field.label}
                                            </label>
                                            <select
                                                id={field.name}
                                                name={field.name}
                                                disabled={field.readOnly}
                                                {...register(field.name)}
                                                onChange={(e) => handleDropdownChange(e, field.name)}
                                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                {workflows.map((option, index) => (
                                                    <option key={index} value={option.stageName}>
                                                        {option.stageName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[field.name] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-5" key={field.name}>
                                    <label htmlFor={field.name} className="scaleformlabel">
                                        {field.label}
                                    </label>
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        disabled={field.readOnly}
                                        {...register(field.name)}
                                        onChange={(e) => handleDropdownChange(e, field.name)}
                                        className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value=""></option>
                                        {workflows.map((option, index) => (
                                            <option key={index} value={option.stageName}>
                                                {option.stageName}
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
                        <div>
                            {(isTimeline && field.name == "description") ? (
                                <div>
                                    {rows && (
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
                                                onChange={(e) => handleInputChange(e, field.name)}
                                                className={`scaleform ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors[field.name] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
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
                                        onChange={(e) => handleInputChange(e, field.name)}
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
                        <div>
                            {isTimeline ? (
                                <div>
                                    {rows && (
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
                                    )}
                                </div>
                            ) : (
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
                        <div className="mb-5" key={field.name}>
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
                case 'progress':
                    return (
                        <div className="mb-5" key={field.name}>
                            <label htmlFor={field.name} className="scaleformlabel">
                                {field.label}
                            </label>
                            <InputSlider handleTrackProgress={handleTrackProgress} progress={progress} />
                        </div>
                    );
                default:
                    return null;
            }
        }
    };

    const deleteRecord = () => {
        // console.log('deleteRecord ', rows?._id);
        updateIsWorkitemDrawer(false);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this Work item?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteRow()
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const deleteRow = () => {
        let config = {
            method: 'delete',
            url: baseURL + `backlog?slug=${slug}`,
            data: [rows?._id]
        };

        axios.request(config)
            .then(response => {
                toast.success('Work item deleted successfully!', {
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
                // console.log('deleted response ', response);
                updateBacklogList(response?.data);
                updatedIsKanbanRefresh(true);
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

    return (
        <>
            <LabelForm type="bookmark" showLabel={showLabel} handleShowLabel={handleShowLabel} />
            <div className="rounded overflow-hidden">
                <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="sticky top-0 bg-slate-100 z-10">
                            <div>
                                <IconButton onClick={() => { updateIsWorkitemDrawer(false) }} edge="start" color="inherit" aria-label="close">
                                    <CloseRoundedIcon className="ml-4" />
                                </IconButton>
                            </div>
                            <div className="flex justify-center text-lg font-semibold -mt-5">
                                {isClone ? 'Clone Work Item' : (
                                    <span>
                                        {rows ? 'Edit Work Item' : 'Add Work Item'}
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
                                <div className="flex justify-between">
                                    <div>
                                        {rows && !isClone && (
                                            <div
                                                onClick={() => deleteRecord()}
                                                className="pulsebuttonwhite min-w-[140px] ml-3"
                                            >
                                                Delete
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end mr-4">
                                        <div>
                                            <div className="flex">
                                                <button onClick={() => updateIsWorkitemDrawer(false)}
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
                        </div>
                    </form>
                </div >
            </div>
        </>
    );
};

export default CreateEvent;
