"use client";
import dynamic from 'next/dynamic';
import Skeleton from '@mui/material/Skeleton';

const TableView = dynamic(() => import('./tableView'), {
    loading: () => <Skeleton variant="rounded" width="100%" height="300px" />,
})


export default function IssueRecords({ recentIssues, issueMaster }) {
    return (
        <TableView risks={recentIssues} master={issueMaster} />
    );
}