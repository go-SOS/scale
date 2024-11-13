"use client";
import { useEffect, useState, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from "axios";
import useSlug from "@/app/scale/layout/hooks/useSlug";
import { FormGroup } from '@mui/material';
import useAppStore from '@/store/appStore';


const FilterDropdown = ({ stages, from }) => {
    const baseURL = '/api/';
    const [isOpen, setIsOpen] = useState(false);
    const [priorityCheckboxes, setPriorityCheckboxes] = useState({
        critical: false,
        high: false,
        medium: false,
        low: false,
    });
    const [dueDateCheckboxes, setDueDateCheckboxes] = useState({
        overdue: false,
        dueInTheNextDay: false,
        dueInTheNextWeek: false,
        dueInTheNextMonth: false,
    });
    const [typeCheckboxes, setTypeCheckboxes] = useState({
        epic: false,
        feature: false,
        story: false,
        bug: false,
        technicalDebt: false,
        proofofConcept: false,
        spike: false,
        enabler: false,
        technicalImprovement: false,
        processImprovement: false,
    });

    const [memberSwitches, setMemberSwitches] = useState({});
    const [stageSwitches, setStageSwitches] = useState({});
    const [isPriorityOpen, setIsPriorityOpen] = useState(true);
    const [isDueDateOpen, setIsDueDateOpen] = useState(true);
    const [isTypeOpen, setIsTypeOpen] = useState(true);
    const [isStageOpen, setIsStageOpen] = useState(true);
    const [isMemberOpen, setIsMemberOpen] = useState(true);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { slug } = useSlug();
    const refView = useRef(null);
    const { backlogList, updateBacklogList, intialBacklogList, updatedTodoList, todoList, intialTodoList } = useAppStore();
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        if (from === "backlog") {
            setDataList(intialBacklogList);
        }
        if (from === "todo") {
            setDataList(intialTodoList);
        }
    }, [backlogList, todoList]);

    useEffect(() => {
        // console.log('dataList ', dataList);
        if (from === "backlog") {
            setDataList(intialBacklogList);
        }
        if (from === "todo") {
            setDataList(intialTodoList);
        }
        const hasPriorityTrueValue = Object.values(priorityCheckboxes).some(value => value === true);
        const hasDueDateTrueValue = Object.values(dueDateCheckboxes).some(value => value === true);
        const hasTypeTrueValue = Object.values(typeCheckboxes).some(value => value === true);
        const hasStageTrueValue = Object.values(stageSwitches).some(value => value === true);
        const hasMemberTrueValue = Object.values(memberSwitches).some(value => value === true);
        // console.log("hasStageTrueValue ", hasStageTrueValue);

        const filteredItems = dataList.filter(item => {
            let isMemberValid = true;
            let isTypeValid = true;
            let isStageValid = true;
            let isPriorityValid = true;
            let isDueDateValid = true;

            if (hasMemberTrueValue) {
                isMemberValid = memberSwitches[item.assignee] === true;
            }
            if (hasTypeTrueValue) {
                isTypeValid = typeCheckboxes[item?.workItemType?.toLowerCase()] === true;
            }
            if (hasStageTrueValue) {
                isStageValid = stageSwitches[item.status] === true;
            }
            if (hasPriorityTrueValue) {
                isPriorityValid = priorityCheckboxes[item?.priority?.toLowerCase()] === true;
            }
            if (hasDueDateTrueValue) {
                const dueDate = new Date(item.dueDate);
                const today = new Date();
                const tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);
                const nextWeek = new Date();
                nextWeek.setDate(today.getDate() + 7);
                const nextMonth = new Date();
                nextMonth.setMonth(today.getMonth() + 1);

                if (dueDateCheckboxes.overdue) {
                    isDueDateValid = dueDate < today;
                }
                if (dueDateCheckboxes.dueInTheNextDay) {
                    isDueDateValid = dueDate >= today && dueDate <= tomorrow;
                }
                if (dueDateCheckboxes.dueInTheNextWeek) {
                    isDueDateValid = dueDate > tomorrow && dueDate <= nextWeek;
                }
                if (dueDateCheckboxes.dueInTheNextMonth) {
                    isDueDateValid = dueDate > nextWeek && dueDate <= nextMonth;
                }
            }

            return isMemberValid && isPriorityValid && isTypeValid && isStageValid && isDueDateValid;
        });

        // console.log('filteredItems ', filteredItems);
        // setFilteredList(filteredItems);
        if (from === "backlog") {
            updateBacklogList(filteredItems);
        }
        if (from === "todo") {
            updatedTodoList(filteredItems);
        }

    }, [priorityCheckboxes, typeCheckboxes, stageSwitches, memberSwitches, dueDateCheckboxes]);



    useEffect(() => {
        document.addEventListener('click', handleClickOutsideProfile);
        return () => {
            document.removeEventListener('click', handleClickOutsideProfile);
        };
    }, []);

    const handleClickOutsideProfile = (event) => {
        if (refView.current && !refView.current.contains(event.target)) {
            // setIsOpen(false);
        }
    };

    useEffect(() => {
        getMembers()
    }, [])

    const getMembers = async () => {
        let posturl = baseURL + `member?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('Members ', res.data);
                setMembers(res.data);
                const initialMemberSwitches = res.data.reduce((acc, member) => {
                    acc[member?.email] = false;
                    return acc;
                }, {});
                setMemberSwitches(initialMemberSwitches);
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

    const handleCheckboxChange = (event, category) => {
        const { name, checked } = event.target;
        if (category === 'priority') {
            setPriorityCheckboxes(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        } else if (category === 'type') {
            setTypeCheckboxes(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        } else if (category === 'dueDate') {
            setDueDateCheckboxes(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        }
    };

    const handleSwitchChange = (event) => {
        const { name, checked } = event.target;
        setMemberSwitches(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleStageSwitchChange = (event) => {
        const { name, checked } = event.target;
        setStageSwitches(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const renderCheckboxes = (category, checkboxes) => (
        Object.keys(checkboxes).map(key => (
            <div className="flex items-center" key={key}>
                <label className="inline-flex items-center mb-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name={key}
                        checked={checkboxes[key]}
                        onChange={(e) => handleCheckboxChange(e, category)}
                        className="sr-only peer"
                    />
                    <div className="relative w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-[13px] font-medium text-gray-900 dark:text-gray-300">{formatLabel(key)}</span>
                </label>
            </div>
        ))
    );

    const formatLabel = (key) => {
        const words = key.replace(/([A-Z])/g, ' $1').split(' ');
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderSwitches = () => (
        members.map(member => (
            <div className="flex items-center" key={member._id}>
                <label className="inline-flex items-center mb-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name={member?.email}
                        checked={memberSwitches[member?.email]}
                        onChange={handleSwitchChange}
                        className="sr-only peer"
                    />
                    <div className="relative w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-[13px] font-medium text-gray-900 dark:text-gray-300">{member.fullName}</span>
                </label>
            </div>
        ))
    );

    const renderStageSwitches = () => (
        stages.map(member => (
            <div className="flex items-center" key={member.stageName}>
                <label className="inline-flex items-center mb-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name={member?.stageName}
                        checked={stageSwitches[member?.stageName]}
                        onChange={handleStageSwitchChange}
                        className="sr-only peer"
                    />
                    <div className="relative w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-[13px] font-medium text-gray-900 dark:text-gray-300">{formatLabel(member.stageName)}</span>
                </label>
            </div>
        ))
    );

    return (
        <div className="relative inline-block text-left" ref={refView}>
            <div>
                <button
                    type="button"
                    className="inline-flex py-[3px] justify-center w-full rounded-md border border-gray-300 px-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-300"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Filters
                    <KeyboardArrowDownIcon
                        className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    />
                </button>
            </div>

            {isOpen && (
                <div
                    className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                >
                    <div className="py-4 px-4" role="none">
                        <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setIsMemberOpen(!isMemberOpen)}>
                            <div className="font-semibold text-sm">Members</div>
                            {isMemberOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </div>
                        {isMemberOpen && (
                            <FormGroup>
                                {loading ? <div>Loading...</div> : renderSwitches()}
                            </FormGroup>
                        )}
                        <hr />
                        <div className="flex items-center justify-between mt-4 mb-2 cursor-pointer" onClick={() => setIsPriorityOpen(!isPriorityOpen)}>
                            <div className="font-semibold text-sm">Priority</div>
                            {isPriorityOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </div>
                        {isPriorityOpen && renderCheckboxes('priority', priorityCheckboxes)}
                        <hr />
                        <div className="flex items-center justify-between mt-4 mb-2 cursor-pointer" onClick={() => setIsDueDateOpen(!isDueDateOpen)}>
                            <div className="font-semibold text-sm">Due Date</div>
                            {isDueDateOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </div>
                        {isDueDateOpen && renderCheckboxes('dueDate', dueDateCheckboxes)}
                        <hr />
                        {from === "backlog" && (
                            <div>
                                <div className="flex items-center justify-between mt-4 mb-2 cursor-pointer" onClick={() => setIsTypeOpen(!isTypeOpen)}>
                                    <div className="font-semibold text-sm">Type</div>
                                    {isTypeOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </div>
                                {isTypeOpen && renderCheckboxes('type', typeCheckboxes)}
                                <hr />
                            </div>
                        )}
                        <div className="flex items-center justify-between mt-4 mb-2 cursor-pointer" onClick={() => setIsStageOpen(!isStageOpen)}>
                            <div className="font-semibold text-sm">Stage</div>
                            {isStageOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </div>
                        {isStageOpen && (
                            <FormGroup>
                                {loading ? <div>Loading...</div> : renderStageSwitches()}
                            </FormGroup>
                        )}
                        {/* {isStageOpen && renderCheckboxes('stage', stageCheckboxes)} */}

                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
