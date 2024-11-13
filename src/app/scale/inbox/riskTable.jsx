"use client";
import useAppStore from '@/store/appStore';


const RiskTable = ({ data, from }) => {
    const { dopen } = useAppStore();
    const { updateIsCommonDrawer, updateFromPage } = useAppStore();

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

    return (
        <div className="overflow-x-auto">
            <div style={dopen ? { width: '81vw', backgroundColor: '#f0f9ff' } : { width: '89vw', backgroundColor: '#f0f9ff' }} className="rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            {from !== "assumption" && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item._id}>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer"
                                    onClick={() => {
                                        updateIsCommonDrawer(item._id);
                                        updateFromPage(from);
                                    }}
                                >
                                    {item.key}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.summary}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer">
                                    {item?.status && (
                                        <span className={`text-[11px] px-1 py-[1px] border border-slate-300 rounded-md ${getStatusTypeColor(item?.status)}`}>
                                            {item?.status}
                                        </span>
                                    )}
                                </td>
                                {from !== "assumption" && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer">
                                        {item?.priority && (
                                            <span className={`text-[11px] px-1 py-[1px] border-2 rounded-md ${getPriorityColor(item?.priority)}`}>
                                                {item?.priority}
                                            </span>
                                        )}
                                    </td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.projectName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createdBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RiskTable;
