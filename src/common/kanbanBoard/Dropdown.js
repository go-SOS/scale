import { useState, useRef, useEffect } from 'react';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LabelIcon from '@mui/icons-material/Label';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Tooltip } from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { useSession } from "next-auth/react";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const Dropdown = ({ items, onSelect, type, id, storyPoints, tShirtSize, assignee, priority, workItemType, status, members, startDates, dueDates, sprint }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const [startDate, setStartDate] = useState(dayjs());
    const [dueDate, setDueDate] = useState(dayjs());
    const today = dayjs();

    useEffect(() => {
        // console.log('startDates ', startDates);
        if (startDates !== undefined) {
            setStartDate(dayjs(startDates));
        }
    }, [startDates])

    useEffect(() => {
        // console.log('dueDates ', dueDates);
        if (dueDates !== undefined) {
            setDueDate(dayjs(dueDates));
        }
    }, [dueDates])


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

    const handleStartDateChange = (newDate) => {
        setStartDate(newDate);
        console.log('newDate ', JSON.stringify(newDate));
        handleSelect(JSON.stringify(newDate));
    };

    const handleEndDateChange = (newDate) => {
        setDueDate(newDate);
        handleSelect(JSON.stringify(newDate));
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const getStatusTypeColor = (status) => {
        switch (status) {
            case 'Backlog':
                return 'bg-blue-100';
            case 'To Do':
                return 'bg-teal-100';
            case 'In Progress':
                return 'bg-yellow-100';
            case 'Done':
                return 'bg-green-100';
            case 'Cancelled':
                return 'bg-red-100';
            case 'Duplicate':
                return 'bg-purple-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical':
                return 'bg-red-100';
            case 'High':
                return 'bg-orange-100';
            case 'Medium':
                return 'bg-yellow-100';
            case 'Low':
                return 'bg-green-100';
            default:
                return 'bg-gray-100';
        }
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

    const handleSelect = (item) => {
        onSelect({
            id: id,
            name: type,
            value: item
        });
        setIsOpen(false);
    };

    const handleMemberSelect = (item) => {
        onSelect({
            id: id,
            name: type,
            value: item
        });
        setIsOpen(false);
    };

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        // console.log('localForm ', members);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getFullNameByEmail = (email) => {
        const user = members.find(user => user.email === email);
        return user ? user.fullName : 'User not found';
    }

    const selectedDateFormatIndex = dateFormats.findIndex(format => format.key === dateFormat);

    return (
        <div>
            {type === "startDate" && (
                <div className="flex">
                    {startDates ? (
                        <Tooltip title="Start Date" arrow placement="top">
                            <div className="mr-2">
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
                        </Tooltip>
                    ) : (
                        <Tooltip title="Start Date" arrow placement="top">
                            <div className="px-1 pb-1 border border-slate-300 rounded-md">
                                <EditCalendarIcon sx={{ fontSize: 15 }} />
                            </div>
                        </Tooltip>
                    )}

                </div>
            )}
            {type === "dueDate" && (
                <div className="flex">
                    {dueDates ? (
                        <Tooltip title="Due Date" arrow placement="top">
                            <div>
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
                        </Tooltip>
                    ) :
                        (
                            <Tooltip title="Due Date" arrow placement="top">
                                <div>
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
                                {/* <div className="px-1 pb-1 border border-slate-300 rounded-md" onClick={handleIconClick}>
                                    <EventAvailableIcon sx={{ fontSize: 15 }} />
                                </div> */}
                            </Tooltip>
                        )}

                </div>
            )}
            {type !== "startDate" && type !== "dueDate" && (
                <div className="relative inline-block" ref={dropdownRef}>
                    {type === "status" && (
                        <div onClick={toggleDropdown}>
                            <Tooltip title="Status" arrow placement="top">
                                <span className={`text-[13px] px-2 py-[2px] border rounded-sm ${getStatusTypeColor(status)}`}>
                                    {status ? status : 'Status'}
                                </span>
                            </Tooltip>
                        </div>
                    )}
                    {type === "sprintName" && (
                        <div onClick={toggleDropdown}>
                            <Tooltip title="Sprint" arrow placement="top">
                                <span className={`text-[11px] px-1 py-[1px] border border-slate-300 rounded-md`}>
                                    {sprint ? sprint : 'Select sprint'}
                                </span>
                            </Tooltip>
                        </div>
                    )}
                    {type === "workItemType" && (
                        <div onClick={toggleDropdown}>
                            <Tooltip title="Work Item Type" arrow placement="top">
                                <span className={`text-[13px] px-1 py-[2px] rounded-sm ${getWorkItemTypeColor(workItemType)}`}>
                                    {workItemType ? workItemType : 'Type'}
                                </span>
                            </Tooltip>
                        </div>
                    )}
                    {type === "priority" && (
                        <div onClick={toggleDropdown}>
                            <Tooltip title="Priority" arrow placement="top">
                                <span className={`text-[13px] px-1 py-[2px] rounded-sm ${getPriorityColor(priority)}`}>
                                    {priority ? priority : 'Priority'}
                                </span>
                            </Tooltip>
                        </div>
                    )}
                    {type === "assignee" && (
                        <div onClick={toggleDropdown}>
                            <Tooltip title="Assignee" arrow placement="top">
                                {assignee ?
                                    <span className="text-[11px] px-1 py-[1px] border border-slate-300 rounded-md">
                                        {getFullNameByEmail(assignee)}
                                    </span>
                                    : (
                                        <PeopleAltIcon sx={{ fontSize: 15 }} />
                                    )}
                            </Tooltip>
                        </div>
                    )}
                    {type === "label" && (
                        <div onClick={toggleDropdown} className="px-1 pb-1 border border-slate-300 rounded-md">
                            <Tooltip title="Label" arrow placement="top">
                                <LabelIcon sx={{ fontSize: 15 }} />
                            </Tooltip>
                        </div>
                    )}
                    {type === "storyPoints" && (
                        <div onClick={toggleDropdown}>
                            <Tooltip title="Story Points" arrow placement="top">
                                {storyPoints ?
                                    <span className="text-[11px] px-1 py-[1px] border border-slate-300 rounded-md">
                                        {storyPoints}
                                    </span>
                                    : (
                                        <NoteAltIcon sx={{ fontSize: 15 }} />
                                    )}
                            </Tooltip>
                        </div>
                    )}
                    {type === "tShirtSize" && (
                        <div onClick={toggleDropdown}>
                            <Tooltip title="T Shirt Size" arrow placement="top">
                                {tShirtSize ?
                                    <span className="text-[11px] px-1 py-[1px] border border-slate-300 rounded-md">
                                        {tShirtSize}
                                    </span>
                                    : (
                                        <FormatSizeIcon sx={{ fontSize: 15 }} />
                                    )}
                            </Tooltip>
                        </div>
                    )}

                    {
                        isOpen && (
                            <ul style={{ zIndex: 2147483647 }} className="absolute left-0 w-32 py-2 mt-2 bg-white border rounded shadow-xl">
                                <div>
                                    {type === "assignee" ? (
                                        <div>
                                            {items.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="px-1 py-1 hover:bg-gray-100 cursor-pointer text-[11px]"
                                                    onClick={() => handleMemberSelect(item?.email)}
                                                >
                                                    {item?.fullName}
                                                </li>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            {items.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="px-1 py-1 hover:bg-gray-100 cursor-pointer text-[11px]"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ul>
                        )
                    }
                </div >

            )}
        </div >

    );
};

export default Dropdown;
