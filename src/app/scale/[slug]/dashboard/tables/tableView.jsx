"use client";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { generateDynamicColumns } from '@/common/columnUtils';
import { useSession } from "next-auth/react";


export default function TableView({ risks, master }) {
    const { data: session } = useSession();
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getColumns();
    }, []);

    const getColumns = async () => {
        let dateFormat = session?.data?.dateFormat;
        // console.log('master dynamicColumn ', master);
        const dynamicColumn = await generateDynamicColumns(master, 'key', dateFormat);
        setColumns(dynamicColumn);
        // console.log('master dynamicColumn ', dynamicColumn);
        setLoading(false);
    }

    return (
        <Box sx={{ height: 340, width: '100%' }}>
            {!loading && (
                <DataGrid
                    rows={risks}
                    rowHeight={35}
                    columns={columns}
                    getRowId={(risks) => risks._id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                        columns: {
                            columnVisibilityModel: {
                                password: false,
                                projectName: false,
                                projectSlug: false,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    hideFooterPagination={true}
                    disableRowSelectionOnClick
                />
            )}
        </Box>
    );
}