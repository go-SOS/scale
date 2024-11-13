import { format } from 'date-fns';


export function generateDynamicColumns(data, fname, dateFormat, members, email) {
    // console.log('generateDynamicColumns ', data);
    const dynamicColumn = data?.map(field => {
        let cellClassName = '';
        let type = '';
        let filterable = true;
        let valueOptions = [];
        if (field.name === "projectName" || field.name === "projectSlug") {
            filterable = false;
        }
        if (field.name === fname) {
            cellClassName = `font-semibold text-blue-500 cursor-pointer`;
        }
        if (field.type === 'date') {
            type = 'date';
        }
        if (field.type === 'dropdown') {
            type = 'singleSelect';
            valueOptions = field.optionList;
        }
        return {
            field: field.name,
            headerName: field.label,
            width: 170,
            type: type,
            filterable: filterable,
            valueOptions: valueOptions,
            cellClassName: cellClassName,
            editable: field.editable,
            valueGetter: (value, row) => {
                if (field.type === "date") {
                    if (value) {
                        try {
                            return format(new Date(value), dateFormat);
                        } catch (error) {
                            console.error("Error formatting date:", error);
                            return ""; // or handle the error as needed
                        }
                    }
                    else {
                        console.warn("Value is undefined for date field.");
                        return ""; // or handle the undefined value case
                    }
                }
                if (field.type === "time") {
                    if (value) {
                        return format(new Date(value), 'HH:mm:ss');
                    }
                    // return new Date(value);
                }
                if (field.type === "team") {
                    if (value && members !== undefined) {
                        const teamMember = members.find(member => member.email === value);
                        return teamMember ? teamMember.fullName : null;
                    } else {
                        return value;
                    }
                }
                if (field.label === "Role") {
                    // console.log("Rows:", row);
                    return row?.email === email ? "Super Admin" : value;
                }
                return value;
            },
            valueFormatter: (value) => {
                if (field.type === "date") {
                    // valueFormatter.format(Number(value)),
                }
                if (field.type === "time") {
                    // valueFormatter.format(Number(value)),
                }

            },
            renderHeader: () => (
                <strong>
                    {field.label}
                </strong>
            ),
        };
    });
    let createdAt = {
        field: "createdAt",
        headerName: "Created On",
        width: 170,
        valueGetter: (value, row) => {
            const createdAt = row?.createdAt;
            if (!createdAt) {
                return ''; // Return an empty string or any default value if createdAt is undefined
            }

            const date = new Date(createdAt);
            if (isNaN(date)) {
                return ''; // Handle the case where the date is invalid
            }

            return format(date, dateFormat);
        },
        valueFormatter: (value) => {
        },
        renderHeader: () => (
            <strong>
                Created On
            </strong>
        ),
    };
    let createdBy = {
        field: "createdBy",
        headerName: "Created By",
        width: 170,
        renderHeader: () => (
            <strong>
                Created By
            </strong>
        ),
    };
    dynamicColumn.push(createdBy, createdAt);
    return dynamicColumn;
}
