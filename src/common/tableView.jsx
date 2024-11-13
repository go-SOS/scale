"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { DataGrid, GridToolbar, GridRowModes, } from '@mui/x-data-grid';
import useAppStore from '@/store/appStore';
import axios from "axios";
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { generateDynamicColumns } from '@/common/columnUtils';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import { useRouter } from 'next-nprogress-bar';
import { useSession } from "next-auth/react";
import Popover from '@mui/material/Popover';
import { Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';


export default function TableView({ rows, from, parent }) {
    const ref = useRef(null);
    const baseURL = '/api/';
    const { updateRowSelection, rowSelection, updateFormData } = useAppStore();
    const { riskmaster, assumptionmaster, issuemaster, dependencymaster, projectmaster, timermaster, releasemaster, todomaster, roadmapmaster } = useAppStore();
    const { sprintmaster, stakeholdermaster, documentmaster, teammaster, membermaster, usermaster, pagemaster, backlogmaster, bookmarkmaster } = useAppStore();
    const { updateIsRiskDrawer, updateIsAssumptionDrawer, updateIsIssueDrawer, updateIsDependencyDrawer, updateIsProjectDrawer, updateIsSprintDrawer, updateIsReleaseDrawer, updateIsTodoDrawer } = useAppStore();
    const { updateIsStakeholderDrawer, updateIsDocumentDrawer, updateIsTeamDrawer, updateIsMemberDrawer, updateIsBookmarkDrawer, updateIsTimerDrawer, updateIsWorkitemDrawer, updateIsRoadmapDrawer } = useAppStore();
    const { updateRiskList, updateAssumptionList, updateIssueList, updateDependencyList, updateReleaseList, updatedTodoList, updateRoadmapList } = useAppStore();
    const { updateProjectList, updateSprintList, updateStakeholderList, updateTeamList, updateTimerList, updateBacklogList } = useAppStore();
    const { updateMemberList, updateDocumentList, updateUsersList, dopen, updateIsCommonDrawer, updateFromPage, updateIsCommentDrawer } = useAppStore();
    const { retrospectivemaster, timesheetmaster, holidaymaster } = useAppStore();
    const { updateIsHolidayDrawer, updateIsTimesheetDrawer, updateIsRetrospectiveDrawer, updateCurrentProject } = useAppStore();
    const { updateHolidayList, updateTimesheetList, updateRetrospectiveList, updateIsClone, updateBookmarkList } = useAppStore();
    const [rowModesModel, setRowModesModel] = useState({});
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const [coloumnVisibilityValue, setColumnVisibilityValue] = useState({
        password: false,
        projectName: false,
        projectSlug: false,
    });
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const { slug } = useSlug();
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setAnchorEl(null);
        }
    };
    const { data: session } = useSession();
    const { controlledFilter } = useAppStore();
    const { updateSavedFilters } = useAppStore();
    const [queryOptions, setQueryOptions] = useState({});
    const onFilterChange = useCallback((filterModel) => {
        setQueryOptions({ filterModel: { ...filterModel } });
        updateSavedFilters({ filterModel: { ...filterModel } });
    }, []);
    const [isPointerEvent, setIsPointerEvent] = useState('none');
    const [pointerId, setPointerId] = useState(null);
    const [value, setValue] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (controlledFilter?.filterModel?.items !== undefined && controlledFilter?.filterModel?.items.length !== 0) {
            setLoading(true);
            setTimeout(() => {
                setQueryOptions(controlledFilter);
                setLoading(false);
            }, 200);
        } else {
            setQueryOptions({});
        }
    }, [controlledFilter]);

    const getMembers = async () => {
        let posturl = `${baseURL}assignee?slug=${slug}`;
        try {
            const res = await axios.get(posturl);
            return res.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let dateFormat = session?.data?.dateFormat;
            let dynamicColumn = '';
            const members = await getMembers();
            switch (from) {
                case "risk":
                    dynamicColumn = generateDynamicColumns(riskmaster, 'key', dateFormat, members);
                    setColumnVisibilityValue({
                        projectName: false,
                        projectSlug: false,
                        content: false,
                        slug: false,
                        workItems: false,
                    });
                    break;
                case "timer":
                    dynamicColumn = generateDynamicColumns(timermaster, 'summary', dateFormat);
                    break;
                case "assumption":
                    dynamicColumn = generateDynamicColumns(assumptionmaster, 'key', dateFormat, members);
                    setColumnVisibilityValue({
                        projectName: false,
                        projectSlug: false,
                        content: false,
                        slug: false,
                        workItems: false,
                    });
                    break;
                case "issue":
                    dynamicColumn = generateDynamicColumns(issuemaster, 'key', dateFormat, members);
                    setColumnVisibilityValue({
                        projectName: false,
                        projectSlug: false,
                        content: false,
                        slug: false,
                        workItems: false,
                    });
                    break;
                case "dependencies":
                case "dependency":
                    dynamicColumn = generateDynamicColumns(dependencymaster, 'key', dateFormat, members);
                    setColumnVisibilityValue({
                        projectName: false,
                        projectSlug: false,
                        content: false,
                        slug: false,
                        workItems: false,
                    });
                    break;
                case "sprint":
                    dynamicColumn = generateDynamicColumns(sprintmaster, 'name', dateFormat, members);
                    break;
                case "stakeholder":
                    dynamicColumn = generateDynamicColumns(stakeholdermaster, 'fullName', dateFormat, members);
                    break;
                case "document":
                    dynamicColumn = generateDynamicColumns(documentmaster, 'documentName', dateFormat, members);
                    setColumnVisibilityValue({
                        projectName: false,
                        projectSlug: false,
                        documentLink: false,
                        owner: false,
                        labels: false,
                    });
                    break;
                case "team":
                    dynamicColumn = generateDynamicColumns(teammaster, 'teamName', dateFormat, members);
                    break;
                case "member":
                    dynamicColumn = generateDynamicColumns(membermaster, 'fullName', dateFormat, members, session?.data?.email);
                    break;
                case "backlog":
                    if (members) {
                        dynamicColumn = generateDynamicColumns(backlogmaster, 'backlogKey', dateFormat, members);
                        setColumnVisibilityValue({
                            projectName: false,
                            projectSlug: false,
                            documentLink: false,
                            parent: false,
                            owner: false,
                            labels: false,
                            backlogType: false,
                            backlogTypeName: false,
                            risk: false,
                            issue: false,
                            assumption: false,
                            dependency: false,
                        });
                    }
                    break;
                case "holiday":
                    dynamicColumn = generateDynamicColumns(holidaymaster, 'email', dateFormat);
                    break;
                case "timesheet":
                    if (members) {
                        dynamicColumn = generateDynamicColumns(timesheetmaster, 'assignee', dateFormat, members);
                        setColumnVisibilityValue({
                            projectName: false,
                            projectSlug: false,
                            fullName: false,
                        });
                    }
                    break;
                case "retrospective":
                    dynamicColumn = generateDynamicColumns(retrospectivemaster, 'sprintName', dateFormat, members);
                    break;
                case "bookmark":
                    dynamicColumn = generateDynamicColumns(bookmarkmaster, 'bookmarkName', dateFormat);
                    break;
                case "release":
                    dynamicColumn = generateDynamicColumns(releasemaster, 'releaseName', dateFormat, members);
                    setColumnVisibilityValue({
                        projectName: false,
                        projectSlug: false,
                        content: false,
                        slug: false,
                        workItems: false,
                        labels: false,
                    });
                    break;
                case "roadmap":
                    dynamicColumn = generateDynamicColumns(roadmapmaster, 'objective', dateFormat, members);
                    setColumnVisibilityValue({
                        projectName: false,
                        projectSlug: false,
                        content: false,
                        slug: false,
                        workItems: false,
                        labels: false,
                    });
                    break;
                case "todo":
                    if (members) {
                        dynamicColumn = generateDynamicColumns(todomaster, 'summary', dateFormat, members);
                    }
                    break;
                case "page":
                    dynamicColumn = generateDynamicColumns(pagemaster, 'name', dateFormat);
                    setColumnVisibilityValue({
                        projectName: false,
                        projectSlug: false,
                        favourite: false,
                        content: false,
                        slug: false,
                        first: false,
                    });
                    break;
                case "users":
                    dynamicColumn = generateDynamicColumns(usermaster, 'email', dateFormat);
                    break;
                case "project":
                    dynamicColumn = generateDynamicColumns(projectmaster, 'projectKey', dateFormat);
                    setColumnVisibilityValue({
                        projectSlug: false,
                        projectDescription: false,
                        goals: false,
                    });
                    break;
                default:
                    break;
            }

            setColumns(dynamicColumn);
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const processRowUpdate = useCallback(
        (newRow, oldRow) =>
            new Promise((resolve, reject) => {
                const result = areObjectsEqual(newRow, oldRow);
                if (result) {
                    resolve(oldRow);
                    handleCancelClick(oldRow._id);
                } else {
                    handleUpdateConfirm(newRow);
                    resolve(newRow);
                    handleSaveClick(newRow._id);
                }
            }),
        [],
    );

    const handleUpdateConfirm = (data) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to update record?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handleUpdate(data)
                },
                {
                    label: 'No',
                }
            ]
        });
    };


    function areObjectsEqual(obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleUpdate = (data) => {

        const endpoints = {
            risk: "risk",
            assumption: "assumption",
            issue: "issue",
            dependencies: "dependency",
            project: "project",
            sprint: "sprint",
            stakeholder: "stakeholder",
            team: "team",
            member: "member",
            document: "document",
            timesheet: "timesheet",
            holiday: "holiday",
            retrospective: "retrospective",
            bookmark: "bookmark",
            release: "release",
            roadmap: "roadmap",
            todo: "todo",
            timer: "timer",
            backlog: "backlog",
            users: "users"
        };

        const updateFunctions = {
            risk: updateRiskList,
            assumption: updateAssumptionList,
            issue: updateIssueList,
            dependencies: updateDependencyList,
            project: updateProjectList,
            sprint: updateSprintList,
            stakeholder: updateStakeholderList,
            team: updateTeamList,
            member: updateMemberList,
            document: updateDocumentList,
            timesheet: updateTimesheetList,
            holiday: updateHolidayList,
            retrospective: updateRetrospectiveList,
            bookmark: updateBookmarkList,
            release: updateReleaseList,
            roadmap: updateRoadmapList,
            todo: updatedTodoList,
            users: updateUsersList,
            backlog: updateBacklogList,
            timer: updateTimerList,
        };

        const url = `${baseURL}${endpoints[from]}?slug=${slug}`;

        const config = {
            method: 'put',
            url: url,
            data: data
        };

        axios.request(config)
            .then(response => {
                if (updateFunctions[from]) {
                    updateFunctions[from](response?.data);
                }
                toast.success('Data updated!', {
                    toastId: "status",
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: {
                        width: '380px',
                    },
                });
            })
            .catch(err => {
                console.log('Error ', err);
                toast.error(err, {
                    toastId: "status",
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: {
                        width: '380px',
                    },
                });
            });
    };

    const handleImportLink = () => {
        router.push(`/scale/${slug}/import`);
    };


    const handleOnCellClick = (params) => {
        setAnchorEl(null);
        // if ((from === "risk" || from === "assumption" || from === "issue" || from === "dependency") && params.field == "key") {
        //     updateRowSelection([]);
        //     updateFormData(params?.row);
        // }
        if (params.field == "projectKey" ||
            params.field == "stakeholderName" ||
            params.field == "name" ||
            params.field == "documentName" ||
            params.field == "fullName" ||
            params.field == "key" ||
            params.field == "sprintName" ||
            params.field == "bookmarkName" ||
            params.field == "summary" ||
            params.field == "releaseName" ||
            params.field == "objective" ||
            params.field == "backlogKey" ||
            params.field == "assignee" ||
            params.field == "email"
        ) {
            const fieldMap = {
                project: "projectKey",
                stakeholder: "stakeholderName",
                sprint: "name",
                document: "documentName",
                member: "fullName",
                users: "email",
                holiday: "assignee",
                timesheet: "assignee",
                sprint: "name",
                bookmark: "bookmarkName",
                release: "releaseName",
                roadmap: "objective",
                timer: "summary",
                retrospective: "sprintName",
                backlog: "backlogKey",
                todo: "summary",
                default: "key"
            };

            if (parent === undefined) {
                const field = fieldMap[from] || fieldMap.default;
                if (params.field === field) {
                    updateRowSelection([]);
                    updateFormData(params?.row);
                }
            }
        }
        if (from === "page" && params.field == "name") {
            // console.log('params ', params.row.slug);
            router.push('/scale/' + slug + '/pages/' + params.row.slug + '?edit=false');
        }
        // else {
        //     if (parent !== undefined) {
        //         updateIsCommonDrawer(params?.row?._id);
        //     }
        // }
    };


    const handleDelete = () => {
        setAnchorEl(null);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this record?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteRow()
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const deleteRow = () => {
        const updateFunctions = {
            risk: updateRiskList,
            assumption: updateAssumptionList,
            issue: updateIssueList,
            dependencies: updateDependencyList,
            project: updateProjectList,
            sprint: updateSprintList,
            stakeholder: updateStakeholderList,
            team: updateTeamList,
            member: updateMemberList,
            document: updateDocumentList,
            timesheet: updateTimesheetList,
            holiday: updateHolidayList,
            retrospective: updateRetrospectiveList,
            bookmark: updateBookmarkList,
            release: updateReleaseList,
            roadmap: updateRoadmapList,
            todo: updatedTodoList,
            users: updateUsersList,
            timer: updateTimerList,
            backlog: updateBacklogList,
        };

        let config = {
            method: 'delete',
            url: baseURL + from + `?slug=${slug}`,
            data: [value]
        };

        axios.request(config)
            .then(response => {
                if (from === "project") {
                    updateCurrentProject({});
                }
                toast.success('Record deleted successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: {
                        width: '380px',
                    },
                });
                if (updateFunctions[from]) {
                    updateFunctions[from](response?.data);
                }
            })
            .catch(error => {
                console.log('Error ', error);
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        style: {
                            width: '380px',
                        },
                    });
                } else {
                    toast.error(error, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        style: {
                            width: '380px',
                        },
                    });
                }
            })
    }

    const handlePopoverOpen = (event) => {
        updateIsClone(false);
        updateFromPage(from);
        const field = event.currentTarget.dataset.field;
        const id = event.currentTarget.parentElement.dataset.id;
        setPointerId(id);
        if (field === 'key' ||
            field === 'projectName' ||
            field === 'email' ||
            field === 'backlogKey' ||
            field === 'stakeholderName' ||
            field === 'name' ||
            field === 'fullName' ||
            field === 'documentName' ||
            field === 'documentLink' ||
            field === 'sprintName' ||
            field === 'bookmarkName' ||
            field === 'summary' ||
            field === 'releaseName' ||
            field === 'objective' ||
            field === 'duration' ||
            field === 'assignee' ||
            field === 'projectKey') {
            const row = rows.find((r) => r._id === id);
            // console.log('handlePopoverOpen ', row);
            setValue(id);
            setUrl(row?.bookmark);
            setAnchorEl(event.currentTarget);
        }
    };

    const handlePopoverClose = (event) => {
        // setAnchorEl(null);
        const field = event.currentTarget.dataset.field;
        const id = event.currentTarget.parentElement.dataset.id;
        // console.log('handlePopoverClose ', field);
        // handlePopoverClose and both contains the field for proper working of popover
        if (field === 'key' ||
            field === 'summary' ||
            field === 'assignee' ||
            field === 'email' ||
            field === 'projectName' ||
            field === 'projectKey' ||
            field === 'backlogKey' ||
            field === 'stakeholderName' ||
            field === 'name' ||
            field === 'sprintName' ||
            field === 'retrospectiveCategory' ||
            field === 'documentName' ||
            field === 'documentType' ||
            field === 'description' ||
            field === 'createdBy' ||
            field === 'role' ||
            field === 'bookmarkName' ||
            field === 'bookmark' ||
            field === 'releaseName' ||
            field === 'objective' ||
            field === 'releaseDate' ||
            field === 'startTime' ||
            field === 'startDate' ||
            field === 'duration' ||
            field === 'status' ||
            field === 'expectedStartDate' ||
            field === 'fullName') {
            if (pointerId == id) {
                setIsPointerEvent('auto');
            } else {
                setIsPointerEvent('none');
                setAnchorEl(null);
            }
        } else {
            setAnchorEl(null);
            setIsPointerEvent('none');
        }
    };

    const handleEvent = (type) => {
        const drawerMap = {
            risk: updateIsRiskDrawer,
            assumption: updateIsAssumptionDrawer,
            issue: updateIsIssueDrawer,
            dependencies: updateIsDependencyDrawer,
            project: updateIsProjectDrawer,
            sprint: updateIsSprintDrawer,
            stakeholder: updateIsStakeholderDrawer,
            team: updateIsTeamDrawer,
            member: updateIsMemberDrawer,
            holiday: updateIsHolidayDrawer,
            timesheet: updateIsTimesheetDrawer,
            retrospective: updateIsRetrospectiveDrawer,
            bookmark: updateIsBookmarkDrawer,
            release: updateIsReleaseDrawer,
            roadmap: updateIsRoadmapDrawer,
            todo: updateIsTodoDrawer,
            document: updateIsDocumentDrawer,
            timer: updateIsTimerDrawer,
            backlog: updateIsWorkitemDrawer
        };
        const updateDrawer = drawerMap[from];
        updateRowSelection([]);
        switch (type) {
            case 'view':
                setAnchorEl(null);
                setIsPointerEvent('none');
                updateIsCommonDrawer(value);
                break;
            case 'add':
                setAnchorEl(null);
                setIsPointerEvent('none');
                if (updateDrawer) {
                    updateDrawer(true);
                }
                break;
            case 'edit':
                setAnchorEl(null);
                setIsPointerEvent('none');
                if (updateDrawer) {
                    updateDrawer(value);
                }
                break;
            case 'comment':
                setAnchorEl(null);
                setIsPointerEvent('none');
                if (updateDrawer) {
                    updateIsCommentDrawer(value);
                }
                break;
            case 'delete':
                setAnchorEl(null);
                setIsPointerEvent('none');
                handleDelete();
                break;
            case 'download':
                setAnchorEl(null);
                setIsPointerEvent('none');
                const downloadLink = rows.filter(doc => doc._id === value);
                if (downloadLink.length > 0) {
                    const documentLink = downloadLink[0].documentLink;
                    const fileName = downloadLink[0].fileName;
                    // const fileType = fileName.split('.').pop();
                    // if (fileType === 'txt') {
                    //     downloadTxtFile(documentLink, fileName);
                    // } else {
                    //     downloadFile(documentLink, fileName);
                    // }
                    downloadTxtFile(documentLink, fileName);
                }
                break;
            case 'clone':
                setAnchorEl(null);
                setIsPointerEvent('none');
                if (updateDrawer) {
                    updateIsClone(true);
                    updateDrawer(value);
                }
                break;
            case 'bookmark':
                setAnchorEl(null);
                setIsPointerEvent('none');
                window.open(url, '_blank');
                break;
            default:
                // console.log('Invalid event type');
                break;
        }
    }

    // const downloadFile = (url, filename) => {
    //     // window.location.assign(url);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.target = '_blank';
    //     link.download = filename;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // }

    const downloadTxtFile = (url, filename) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.download = filename || "downloaded-file.txt";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error fetching the file:", error);
            });
    }

    return (
        <div>
            {rows.length > 0 ? (
                <div style={parent !== undefined ? (dopen ? { minHeight: '57vh', height: '57vh', maxHeight: '57vh', width: '81vw', backgroundColor: '#f0f9ff' } : { minHeight: '57vh', height: '57vh', maxHeight: '57vh', width: '89vw', backgroundColor: '#f0f9ff' }) : { minHeight: '57vh', height: '57vh', maxHeight: '57vh', width: '100%', backgroundColor: '#f0f9ff' }} className="rounded-lg mt-4" ref={ref}>
                    {!loading && (
                        <div>
                            <DataGrid
                                onFilterModelChange={onFilterChange}
                                // filterModel={controlledFilter}
                                initialState={{
                                    columns: {
                                        columnVisibilityModel: coloumnVisibilityValue,
                                    },
                                    filter: queryOptions,
                                }}
                                getRowId={(row) => row._id}
                                slots={{ toolbar: GridToolbar }}
                                style={parent !== undefined ? (dopen ? { minHeight: '57vh', height: '57vh', maxHeight: '57vh', width: '81vw', backgroundColor: '#f0f9ff' } : { minHeight: '57vh', height: '57vh', maxHeight: '57vh', width: '89vw', backgroundColor: '#f0f9ff' }) : { minHeight: '57vh', height: '57vh', maxHeight: '57vh', width: '100%', backgroundColor: '#f0f9ff' }}
                                rowReordering
                                rowHeight={45}
                                rows={rows}
                                columns={columns}
                                pagination
                                autoPageSize
                                checkboxSelection
                                disableRowSelectionOnClick
                                // autoHeight={true}
                                editMode="row"
                                getRowClassName={(params) => {
                                    return 'bg-white';
                                }}
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                    updateRowSelection(newRowSelectionModel);
                                }}
                                rowSelectionModel={rowSelection}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                        setRowModesModel
                                    },
                                    cell: {
                                        onMouseEnter: handlePopoverOpen,
                                        onMouseLeave: handlePopoverClose
                                    },
                                }}
                                onCellClick={handleOnCellClick}
                                onRowModesModelChange={handleRowModesModelChange}
                                processRowUpdate={processRowUpdate}
                            />
                            {from !== "page" && (
                                <div>
                                    {parent !== undefined && (
                                        <Popover
                                            sx={{
                                                pointerEvents: isPointerEvent,
                                            }}
                                            id={id}
                                            open={open}
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            onClose={handlePopoverClose}
                                            disableRestoreFocus
                                            className="-ml-14"
                                        >
                                            <div className="flex p-3">
                                                <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('view')}>
                                                    <Tooltip title="View" arrow placement="bottom">
                                                        <VisibilityIcon />
                                                    </Tooltip>
                                                </div>
                                                {from !== "document" && (
                                                    <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('edit')}>
                                                        <Tooltip title="Change" arrow placement="bottom">
                                                            <EditIcon />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                                {from === "backlog" && (
                                                    <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('comment')}>
                                                        <Tooltip title="Comment" arrow placement="bottom">
                                                            <MessageRoundedIcon />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                                {from !== "project" && from !== "sprint" && from !== "document" && from !== "page" && from !== "timer" && (
                                                    <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('clone')}>
                                                        <Tooltip title="Clone" arrow placement="bottom">
                                                            <FileCopyIcon />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                                {from === "document" && (
                                                    <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('download')}>
                                                        <Tooltip title="Clone" arrow placement="bottom">
                                                            <DownloadIcon />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                                {from === "bookmark" && (
                                                    <div className="mr-3 ml-3 cursor-pointer text-blue-500 hover:text-blue-700 hover:rounded-full" onClick={() => handleEvent('bookmark')}>
                                                        <Tooltip title="Visit Bookmark URL" arrow placement="bottom">
                                                            <LinkIcon />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                                <div className="mr-3 cursor-pointer text-orange-500 hover:text-orange-700 hover:rounded-full" onClick={() => handleEvent('delete')}>
                                                    <Tooltip title="Remove" arrow placement="bottom">
                                                        <DeleteOutlineIcon />
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </Popover>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-500 p-4 min-w-[76vw] rounded-lg mt-16">
                    <div className="flex justify-center p-4 min-h-[22vh]">
                        <div className="text-md text-left mt-4 ml-10">
                            {(from === "risk" || from === "assumption" || from === "issue" || from === "dependencies") ? (
                                <div>
                                    <h2 className="text-md font-semibold mb-1">Add the {from} log</h2>
                                    <p className="text-gray-700">
                                        Add the {from} by clicking - Add {from} log
                                        <br />
                                        or Import the {from} log from the{" "}
                                        <span onClick={handleImportLink} className="text-blue-500 cursor-pointer">
                                            Import module
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {from === "sprint" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start creating sprint</h2>
                                            <p className="text-gray-700">
                                                A sprint is a defined period within Agile methodology where specific tasks are completed and reviewed,
                                                <br />
                                                enabling incremental progress and regular feedback.
                                            </p>
                                        </div>
                                    )}
                                    {from === "project" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start adding project</h2>
                                            <p className="text-gray-700">
                                                A project in project management is to achieve specific objectives and deliverables within defined constraints
                                                <br />
                                                of scope, time, cost, and quality, by organizing and managing resources and tasks effectively.
                                            </p>
                                        </div>
                                    )}
                                    {from === "release" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start adding releases</h2>
                                            <p className="text-gray-700">
                                                Releases in project management serve as milestones that deliver specific features or improvements,
                                                <br />
                                                enabling teams to track progress, manage deliverables, and ensure timely delivery to stakeholders.
                                            </p>
                                        </div>
                                    )}
                                    {from === "roadmap" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start adding roadmap</h2>
                                            <p className="text-gray-700">
                                                A roadmap in a project management app serves as a strategic blueprint that outlines the long-term vision, goals, and milestones of a project.
                                                <br />
                                                It provides a high-level overview of the project's direction, helping teams and stakeholders align their efforts towards common objectives.
                                            </p>
                                        </div>
                                    )}
                                    {from === "retrospective" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start adding retrospective</h2>
                                            <p className="text-gray-700">
                                                A retrospective in project management is a meeting where the team reviews and
                                                <br />
                                                reflects on a completed iteration or project phase to identify successes,
                                                <br />
                                                challenges, and areas for improvement to enhance future performance.
                                            </p>
                                        </div>
                                    )}
                                    {from === "bookmark" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start adding bookmark</h2>
                                            <p className="text-gray-700">
                                                A bookmark serves as a quick reference point, allowing team members to easily access and revisit important information,
                                                <br />
                                                documents, or stages of the project for efficient tracking and collaboration.
                                            </p>
                                        </div>
                                    )}
                                    {from === "page" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start creating page</h2>
                                            <p className="text-gray-700">
                                                A page serves as a central document or digital space for organizing, tracking,
                                                <br />
                                                and communicating project details, progress, and updates to team members and stakeholders.
                                            </p>
                                        </div>
                                    )}
                                    {from === "stakeholder" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start adding stakeholder</h2>
                                            <p className="text-gray-700">
                                                stakeholders are individuals or groups with an interest or influence in the project&apos;s
                                                <br />
                                                outcome, contributing to its planning, execution, and success by providing input, resources, and support.
                                            </p>
                                        </div>
                                    )}
                                    {from === "timesheet" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start adding timesheet</h2>
                                            <p className="text-gray-700">
                                                A timesheet in project management tracks the time spent by team members on various tasks,
                                                <br />
                                                helping to monitor progress, allocate resources effectively, and ensure accurate billing.
                                            </p>
                                        </div>
                                    )}
                                    {from === "timer" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start recording task duration</h2>
                                            <p className="text-gray-700">
                                                A timer helps track the duration of tasks to ensure
                                                <br />
                                                efficient time management and adherence to schedules.
                                            </p>
                                        </div>
                                    )}
                                    {from === "document" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Start adding documents</h2>
                                            <p className="text-gray-700">
                                                These documents stored on a cloud, serve as a centralized repository for project-related information,
                                                <br />
                                                facilitating easy access, collaboration, and version control among team members.
                                            </p>
                                        </div>
                                    )}
                                    {from === "backlog" && (
                                        <div>
                                            <h2 className="text-md font-semibold mb-1">Project Work Items</h2>
                                            <p className="text-gray-700">
                                                A prioritized list of tasks and features that guide the team's development efforts,
                                                <br />
                                                ensuring alignment with project goals and efficient resource allocation.
                                                <br />
                                                These documents stored on a cloud, serve as a centralized repository for project-related information,
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )
            }
        </div >

    )
}
