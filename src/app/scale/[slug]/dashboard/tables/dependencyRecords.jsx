"use client";
import dynamic from 'next/dynamic';
import Skeleton from '@mui/material/Skeleton';

const TableView = dynamic(() => import('./tableView'), {
    loading: () => <Skeleton variant="rounded" width="100%" height="300px" />,
})


export default function DependencyRecords({ recentDependencies, dependencyMaster }) {
    return (
        <TableView risks={recentDependencies} master={dependencyMaster} />
    );
}