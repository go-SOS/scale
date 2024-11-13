"use client";
import { useEffect, useState } from "react";
import FolderIcon from '@mui/icons-material/Folder';
import Divider from '@mui/material/Divider';
import { useSession } from "next-auth/react";
import { format } from 'date-fns';
import axios from "axios";
import useSlug from "@/app/scale/layout/hooks/useSlug";

// Helper function to format keys with spaces between words
const formatKey = (key) => {
    // Replace every uppercase letter with a space followed by the lowercase version of the letter
    return key.replace(/([A-Z])/g, ' $1').trim();
};

export default function DetailsPage({ selectedRowData, workitems, labels, risks, assumptions, dependencys, issues }) {
    const baseURL = '/api/';
    const [filteredData, setFilteredData] = useState(null);
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { slug } = useSlug();
    const backgroundColors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-gray-200'];

    useEffect(() => {
        getMembers();
    }, [])


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
        // console.log('selectedRowData ', selectedRowData);
        if (selectedRowData !== null && selectedRowData !== undefined) {
            const filterData = Object.entries(selectedRowData).filter(([key, _]) => !['_id', 'fileUrl', 'isActive', 'expertMode', 'parent', 'stepId', 'backlogType', 'backlogTypeName', 'isJoined', 'isInvited', 'documentLink', 'projectSlug', 'organization', 'organizationId', 'organizationUrl', 'password', 'userId', 'lastModifiedBy', 'createdAt', 'createdBy', 'updatedAt', '__v'].includes(key));
            setFilteredData(filterData);
        }
    }, [selectedRowData])

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
            {
                filteredData !== null && filteredData !== undefined ? (
                    <div>
                        <div>
                            <div className="bg-white min-h-3 mb-4 ">
                                <div className="p-2">
                                    <div className="flex justify-between">
                                        <div className="flex items-center">
                                            <FolderIcon className="text-yellow-300 mr-2" />
                                            <div className="ml-1 text-sm min-w-[25vw] text-blue-600">
                                                Details
                                            </div>
                                        </div>
                                    </div>
                                    {!loading && (
                                        <div>
                                            <Divider sx={{ mx: 4, mt: 1 }} />
                                            <div className="p-4">
                                                {filteredData.map(([key, value]) => {
                                                    const isDateKey = /date$/i.test(key);
                                                    const formattedValue = isDateKey ? format(value, dateFormat) : value;
                                                    return (
                                                        <div key={key} className="flex mb-2">
                                                            <p className="text-right min-w-[200px] capitalize">{formatKey(key)}</p>
                                                            <p className="ml-8">
                                                                {(key === "startTime" || key === "endTime") ?
                                                                    (<span>
                                                                        {format(new Date(value), 'HH:mm:ss')}
                                                                    </span>) : (
                                                                        <span>

                                                                            {
                                                                                (key !== "expertMode") &&
                                                                                (key !== "assignee") &&
                                                                                (key !== "impactedWorkItems") &&
                                                                                (key !== "risk") &&
                                                                                (key !== "assumption") &&
                                                                                (key !== "issue") &&
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
                                                                        </span>
                                                                    )}
                                                            </p>
                                                        </div>
                                                    )
                                                })}

                                                {labels &&
                                                    (
                                                        <div className="flex mb-2">
                                                            <p className="text-right min-w-[200px] capitalize">Labels:</p>
                                                            <p className="ml-8">
                                                                {labels.map((label, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className={`inline-block px-3 py-1 m-1 rounded text-[13px] ${backgroundColors[index % backgroundColors.length]}`}
                                                                    >
                                                                        {label}
                                                                    </span>
                                                                ))}
                                                            </p>
                                                        </div>
                                                    )}
                                                {risks &&
                                                    (
                                                        <div className="flex mb-2">
                                                            <p className="text-right min-w-[200px] capitalize">Risks:</p>
                                                            <p className="ml-8">
                                                                <span className="my-3">
                                                                    <ul>
                                                                        {risks && risks.map((label, index) => (
                                                                            <li key={index}>
                                                                                - {label?.summary}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                {assumptions &&
                                                    (
                                                        <div className="flex mb-2">
                                                            <p className="text-right min-w-[200px] capitalize">Assumption:</p>
                                                            <p className="ml-8">
                                                                <span className="my-3">
                                                                    <ul>
                                                                        {assumptions && assumptions.map((label, index) => (
                                                                            <li key={index}>
                                                                                - {label?.summary}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                {issues &&
                                                    (
                                                        <div className="flex mb-2">
                                                            <p className="text-right min-w-[200px] capitalize">Issue:</p>
                                                            <p className="ml-8">
                                                                <span className="my-3">
                                                                    <ul>
                                                                        {issues && issues.map((label, index) => (
                                                                            <li key={index}>
                                                                                - {label?.summary}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                {dependencys &&
                                                    (
                                                        <div className="flex mb-2">
                                                            <p className="text-right min-w-[200px] capitalize">Dependency:</p>
                                                            <p className="ml-8">
                                                                <span className="my-3">
                                                                    <ul>
                                                                        {dependencys && dependencys.map((label, index) => (
                                                                            <li key={index}>
                                                                                - {label?.summary}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                {workitems && workitems.length > 0 && (
                                                    <div className="p-4">
                                                        <p className="min-w-[200px] capitalize mt-4 font-medium">Work Items: </p>
                                                        <table className="mb-2 mt-3 ml-16 table-auto border border-collapse border-gray-300 rounded-lg">
                                                            <thead>
                                                                <tr className="bg-gray-100 text-sm">
                                                                    <th className="border border-gray-300 px-4 py-2 min-w-[10vw]">Summary</th>
                                                                    <th className="border border-gray-300 px-4 py-2 min-w-[7vw]">Status</th>
                                                                    <th className="border border-gray-300 px-4 py-2">Priority</th>
                                                                    <th className="border border-gray-300 px-4 py-2">Assignee</th>
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
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center p-4 min-h-[40vh]">
                        <div className="mt-7 flex justify-center">
                            <div className="mt-16 flex justify-center">
                                <div>
                                    <div className="text-md text-center mt-4 underline">
                                        Please select a row to show details.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
