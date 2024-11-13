"use client";
import useAppStore from '@/store/appStore';
import { format } from 'date-fns';
import { useSession } from "next-auth/react";


const WorkItemTable = ({ data }) => {
    const { dopen } = useAppStore();
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const { updateIsCommonDrawer, updateFromPage } = useAppStore();

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
        <div className="overflow-x-auto">
            <div style={dopen ? { width: '81vw', backgroundColor: '#f0f9ff' } : { width: '89vw', backgroundColor: '#f0f9ff' }} className="rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Backlog Key</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item._id}>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer"
                                    onClick={() => {
                                        updateIsCommonDrawer(item._id);
                                        updateFromPage('backlog');
                                    }}
                                >
                                    {item.backlogKey}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer">{item.summary}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer">
                                    {item?.status && (
                                        <span className={`text-[13px] px-2 py-[2px] border rounded-sm ${getStatusTypeColor(item?.status)}`}>
                                            {item?.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer">
                                    {item?.priority && (
                                        <span className={`text-[13px] px-1 py-[2px] rounded-sm ${getPriorityColor(item?.priority)}`}>
                                            {item?.priority}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.projectName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createdBy}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(item.dueDate, dateFormat)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkItemTable;
