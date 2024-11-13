"use client";
import React, { useEffect, useState } from "react";
import useAppStore from '@/store/appStore';
import Divider from '@mui/material/Divider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import axios from "axios";
import { format } from 'date-fns';
import { useSession } from "next-auth/react";
import Comments from "../comments";
import Attachments from "../attachments";
import useSlug from "@/app/scale/layout/hooks/useSlug";
import FolderIcon from '@mui/icons-material/Folder';

const formatKey = (key) => {
    // Replace every uppercase letter with a space followed by the lowercase version of the letter
    return key.replace(/([A-Z])/g, ' $1').trim();
};

const DetailsPage = () => {
    const baseURL = '/api/';
    const { updateIsCommonDrawer, isCommonDrawer, fromPage } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [modules, setModules] = useState(null);
    const [workitems, setWorkitems] = useState(null);
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const { slug } = useSlug();
    const [members, setMembers] = useState([]);
    const backgroundColors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-gray-200'];
    const [projectArray, setProjectArray] = useState([]);
    const [riskArray, setRiskArray] = useState([]);
    const [dependencyArray, setDependencyArray] = useState([]);
    const [issueArray, setIssueArray] = useState([]);
    const [assumptionArray, setAssumptionArray] = useState([]);
    const [workitemArray, setWorkitemArray] = useState([]);

    const getMembers = async () => {
        let posturl = baseURL + `assignee?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setMembers(res.data);
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
        getData();
        if (fromPage === "risk" || fromPage === "assumption" || fromPage === "issue" || fromPage === "dependencies" || fromPage === "backlog") {
            getriskworkitem();
        }
    }, [])

    const getriskworkitem = async () => {
        let page = fromPage;
        if (page === "dependencies") {
            page = "dependency";
        }
        let posturl = baseURL + `riskworkitem?slug=${slug}&${page}Id=${isCommonDrawer}`;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('getriskworkitem ', res.data);
                const mainArray = res?.data;

                const dependenciesArray = [];
                const issuesArray = [];
                const assumptionsArray = [];
                const risksArray = [];
                const workitemsArray = [];

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
                    if (item.backlogId) {
                        workitemsArray.push(item);
                    }
                });

                setDependencyArray(dependenciesArray);
                setIssueArray(issuesArray);
                setAssumptionArray(assumptionsArray);
                setRiskArray(risksArray);
                if (fromPage === "backlog") {
                    setWorkitemArray(null);
                } else {
                    setWorkitemArray(workitemsArray);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (rows !== null && rows !== undefined) {
            const filterData = Object.entries(rows).filter(([key, _]) => !['_id', 'stepId', 'isActive', 'expertMode', 'parent', 'isJoined', 'isInvited', 'file', 'documentLink[]', 'fileUrl', 'documentLink', 'organization', 'backlogTypeName', 'projectSlug', 'organizationId', 'organizationUrl', 'password', 'userId', 'lastModifiedBy', 'createdAt', 'createdBy', 'updatedAt', '__v'].includes(key));
            setFilteredData(filterData);
        }
    }, [rows])

    const getData = async () => {
        let page = fromPage;
        if (page === "dependencies") {
            page = "dependency";
        }
        let posturl = baseURL + page + "?id=" + isCommonDrawer;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res?.data[0]);
                // console.log('isCommonDrawer ', res?.data[0]);
                getMembers();
                if (res?.data[0]?.modules) {
                    const moduleNames = Object.keys(res?.data[0]?.modules);
                    // const moduleNames = Object.keys(res?.data[0]?.modules).join(', ');
                    setModules(moduleNames);
                }
                if (res?.data[0]?.workItems) {
                    const workItemNames = res.data[0].workItems;
                    setWorkitems(workItemNames);
                }
                if (res?.data[0]?.projects) {
                    const projectNames = res.data[0].projects;
                    // console.log('projectNames ', projectNames);
                    setProjectArray(projectNames);
                }
                // if (res?.data[0]?.impactedWorkItems) {
                //     const workItemNames = res.data[0].impactedWorkItems;
                //     setWorkitems(workItemNames);
                // }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const getFirstNameByEmail = (email) => {
        const teamMember = members.find(member => member.email === email);
        return teamMember ? teamMember.fullName : null;
    }

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

    return (
        <>
            <div className="rounded overflow-hidden">
                <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <div className="sticky top-0 bg-slate-100 z-10">
                        <div>
                            <IconButton onClick={() => { updateIsCommonDrawer(false) }} edge="start" color="inherit" aria-label="close">
                                <CloseRoundedIcon className="ml-4" />
                            </IconButton>
                        </div>
                        <div className="flex justify-center text-lg font-semibold -mt-5 capitalize">
                            {fromPage} Details
                        </div>
                        <Divider />
                    </div>
                    <div className="flex justify-left mt-4" style={(fromPage === "backlog" ? { height: '60vh', overflowY: 'auto' } : { height: '82vh', overflowY: 'auto' })}>
                        <div className="max-w-[550px] min-w-[550px]">
                            {!loading ? (
                                <>
                                    {
                                        filteredData !== null && filteredData !== undefined ? (
                                            <div className="bg-white min-h-3 mb-4 ">
                                                <div className="p-2">
                                                    <div className="p-4">
                                                        {filteredData
                                                            .filter(([key, _]) =>
                                                                key.toLowerCase() !== 'modules' && key.toLowerCase() !== 'workitems'
                                                            )
                                                            .map(([key, value]) => {
                                                                const isDateKey = /date$/i.test(key);
                                                                const formattedValue = isDateKey ? format(value, dateFormat) : value;
                                                                return (
                                                                    <div key={key} className="flex mb-2">
                                                                        <p className="text-right min-w-[200px] capitalize text-[16px]">{formatKey(key)}</p>
                                                                        <p className="ml-16 scaleformlabel">
                                                                            {(key === "startTime" || key === "endTime") ?
                                                                                (<span>
                                                                                    {format(new Date(value), 'HH:mm:ss')}
                                                                                </span>) : (
                                                                                    <span>

                                                                                        {(
                                                                                            key !== "expertMode") &&
                                                                                            (key !== "assignee") &&
                                                                                            (key !== "impactedWorkItems") &&
                                                                                            (key !== "labels") &&
                                                                                            (key !== "risk") &&
                                                                                            (key !== "assumption") &&
                                                                                            (key !== "issue") &&
                                                                                            (key !== "projects") &&
                                                                                            (key !== "dependency") &&
                                                                                            (
                                                                                                <div dangerouslySetInnerHTML={{ __html: formattedValue }} />

                                                                                            )}
                                                                                        {(key === "expertMode") &&
                                                                                            (<span>
                                                                                                <span>{value.toString()}</span>
                                                                                            </span>
                                                                                            )}
                                                                                        {(key === "assignee") &&
                                                                                            (<span>
                                                                                                {getFirstNameByEmail(value)}
                                                                                            </span>
                                                                                            )}
                                                                                        {(key === "risk") && (
                                                                                            <span className="my-3">
                                                                                                <ul>
                                                                                                    {riskArray?.length > 0 && riskArray.map((label, index) => (
                                                                                                        <li key={index}>
                                                                                                            - {label?.riskSummary}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </span>
                                                                                        )}
                                                                                        {(key === "assumption") && (
                                                                                            <span className="my-3">
                                                                                                <ul>
                                                                                                    {dependencyArray?.length > 0 && dependencyArray.map((label, index) => (
                                                                                                        <li key={index}>
                                                                                                            - {label?.dependencySummary}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </span>
                                                                                        )}
                                                                                        {(key === "projects") && (
                                                                                            <span className="my-3">
                                                                                                <ul>
                                                                                                    {projectArray?.length > 0 && projectArray.map((label, index) => (
                                                                                                        <li key={index}>
                                                                                                            - {label?.name}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </span>
                                                                                        )}
                                                                                        {(key === "dependency") && (
                                                                                            <span className="my-3">
                                                                                                <ul>
                                                                                                    {issueArray?.length > 0 && issueArray.map((label, index) => (
                                                                                                        <li key={index}>
                                                                                                            - {label?.issueSummary}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </span>
                                                                                        )}
                                                                                        {(key === "issue") && (
                                                                                            <span className="my-3">
                                                                                                <ul>
                                                                                                    {assumptionArray?.length > 0 && assumptionArray.map((label, index) => (
                                                                                                        <li key={index}>
                                                                                                            - {label?.assumptionSummary}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </span>
                                                                                        )}
                                                                                        {(key === "labels") &&
                                                                                            (<span>
                                                                                                {value && value.map((label, index) => (
                                                                                                    <span
                                                                                                        key={index}
                                                                                                        className={`inline-block px-3 py-1 m-1 rounded text-[13px] ${backgroundColors[index % backgroundColors.length]}`}
                                                                                                    >
                                                                                                        {label}
                                                                                                    </span>
                                                                                                ))}
                                                                                            </span>
                                                                                            )}
                                                                                    </span>
                                                                                )}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                    {modules && (
                                                        <div className="p-4 ml-16">
                                                            <p className="min-w-[200px] capitalize mt-4 font-medium">Project Modules: </p>
                                                            <ul className="mb-2 mt-3 ml-16">
                                                                {modules && modules.map((item, index) => (
                                                                    <span className="flex mb-2">
                                                                        <FolderIcon fontSize="small" className="text-yellow-500" />
                                                                        <li key={index} className="ml-3 -mt-1">{item}</li>
                                                                    </span>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {workitems && workitems.length > 0 && (
                                                        <div className="p-4 ml-3">
                                                            <p className="min-w-[200px] capitalize mt-4 font-medium">Work Items: </p>
                                                            <table className="mb-2 mt-3 ml-16 table-auto border border-collapse border-gray-300 rounded-lg">
                                                                <thead>
                                                                    <tr className="bg-gray-100 text-sm">
                                                                        <th className="border border-gray-300 px-4 py-2 min-w-[10vw]">Summary</th>
                                                                        <th className="border border-gray-300 px-4 py-2 min-w-[7vw]">Status</th>
                                                                        <th className="border border-gray-300 px-4 py-2">Priority</th>
                                                                        <th className="border border-gray-300 px-4 py-2 min-w-[8vw]">Assignee</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {workitems && workitems.map((item, index) => (
                                                                        <tr key={index} className="mb-2">
                                                                            <td className="border border-gray-300 px-4 py-2 text-[13px]">{item?.summary}</td>
                                                                            <td className="border border-gray-300 px-4 py-2">
                                                                                <span className={`text-[13px] px-2 py-[2px] border rounded-sm ${getStatusTypeColor(item?.status)}`}>
                                                                                    {item?.status}
                                                                                </span>
                                                                            </td>
                                                                            <td className="border border-gray-300 px-4 py-2">
                                                                                <span className={`text-[13px] px-1 py-[2px] rounded-sm ${getPriorityColor(item?.priority)}`}>
                                                                                    {item?.priority}
                                                                                </span>
                                                                            </td>
                                                                            <td className="border border-gray-300 px-4 py-2 text-[13px]">
                                                                                {getFirstNameByEmail(item?.assignee)}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                    {workitemArray && workitemArray.length > 0 && (
                                                        <div className="p-4 ml-3">
                                                            <p className="min-w-[200px] capitalize mt-4 font-medium">Work Items: </p>
                                                            <table className="mb-2 mt-3 ml-16 table-auto border border-collapse border-gray-300 rounded-lg">
                                                                <thead>
                                                                    <tr className="bg-gray-100 text-sm">
                                                                        <th className="border border-gray-300 px-4 py-2 min-w-[10vw]">Summary</th>
                                                                        <th className="border border-gray-300 px-4 py-2 min-w-[7vw]">Status</th>
                                                                        <th className="border border-gray-300 px-4 py-2">Priority</th>
                                                                        <th className="border border-gray-300 px-4 py-2 min-w-[8vw]">Assignee</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {workitemArray && workitemArray.map((item, index) => (
                                                                        <tr key={index} className="mb-2">
                                                                            <td className="border border-gray-300 px-4 py-2 text-[13px]">{item?.backlogSummary}</td>
                                                                            <td className="border border-gray-300 px-4 py-2">
                                                                                <span className={`text-[13px] px-2 py-[2px] border rounded-sm ${getStatusTypeColor(item?.backlogStatus)}`}>
                                                                                    {item?.backlogStatus}
                                                                                </span>
                                                                            </td>
                                                                            <td className="border border-gray-300 px-4 py-2">
                                                                                <span className={`text-[13px] px-1 py-[2px] rounded-sm ${getPriorityColor(item?.backlogPriority)}`}>
                                                                                    {item?.backlogPriority}
                                                                                </span>
                                                                            </td>
                                                                            <td className="border border-gray-300 px-4 py-2 text-[13px]">
                                                                                {getFirstNameByEmail(item?.backlogAssignee)}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center p-4 min-h-[40vh]">
                                                <div className="mt-7 flex justify-center">
                                                    <div className="mt-16 flex justify-center">
                                                        <div>
                                                            <div className="text-md text-center mt-4 underline">
                                                                No record to display
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </>
                            ) : (
                                <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                                    <svg ariaHidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        {!loading && fromPage === "backlog" && (
                            <div>
                                <Attachments rows={rows} />
                                <Comments rows={rows} />
                            </div>
                        )}
                    </div>
                    <div className="sticky bottom-0 bg-slate-100 z-10 min-h-[60px]">
                        <Divider />
                        <div className="mt-3 mb-3">
                            <div className="flex justify-end mr-4">
                                <div>
                                    <div className="flex">
                                        <button onClick={() => { updateIsCommonDrawer(false) }}
                                            className="pulsebuttonwhite mr-3  min-w-[140px]"
                                        >
                                            <span>Close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailsPage;
