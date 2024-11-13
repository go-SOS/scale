"use client";
import { useEffect, useState, useRef } from "react";
import useAppStore from '@/store/appStore';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from "axios";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DetailsPage from "@/common/splitView/detailsPage";
import useSlug from "@/app/scale/layout/hooks/useSlug";
import { useSession } from "next-auth/react";

export default function View({ from }) {
    const componentRef = useRef();
    const { formData } = useAppStore();
    const { updateIsRiskDrawer, updateRiskList } = useAppStore();
    const { updateIsAssumptionDrawer, updateAssumptionList } = useAppStore();
    const { updateIsIssueDrawer, updateIssueList } = useAppStore();
    const { updateIsDependencyDrawer, updateDependencyList } = useAppStore();
    const { updateIsProjectDrawer, updateProjectList } = useAppStore();
    const { updateIsSprintDrawer, updateSprintList } = useAppStore();
    const { updateIsStakeholderDrawer, updateStakeholderList } = useAppStore();
    const { updateIsRetrospectiveDrawer, updateIsBookmarkDrawer, updateIsReleaseDrawer, updateIsWorkitemDrawer, updateIsTimerDrawer, updateTimerList, updateTimesheetList } = useAppStore();
    const { updateIsTeamDrawer, updateTeamList } = useAppStore();
    const { updateIsMemberDrawer, memberList, updateIsTodoDrawer, updateIsTimesheetDrawer, updateRoadmapList, updateIsRoadmapDrawer } = useAppStore();
    const { updateIsDocumentDrawer, updateDocumentList, updateUsersList, updateRetrospectiveList, updateBookmarkList, updateReleaseList, updateBacklogList, updatedTodoList } = useAppStore();
    const [selectedRowData, setSelectedRowData] = useState(null);
    const baseURL = '/api/';
    const [loading, setLoading] = useState(true);
    const { projectName, slug, key } = useSlug();
    const { data: session } = useSession();
    const [workitems, setWorkitems] = useState(null);
    const [labels, setLabels] = useState(null);
    const [risks, setRisk] = useState(null);
    const [assumptions, setAssumption] = useState(null);
    const [issues, setIssue] = useState(null);
    const [dependencys, setDependency] = useState(null);

    const handleOpenForm = () => {
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
            document: updateIsDocumentDrawer,
            bookmark: updateIsBookmarkDrawer,
            release: updateIsReleaseDrawer,
            roadmap: updateIsRoadmapDrawer,
            backlog: updateIsWorkitemDrawer,
            retrospective: updateIsRetrospectiveDrawer,
            timer: updateIsTimerDrawer,
            timesheet: updateIsTimesheetDrawer,
            todo: updateIsTodoDrawer,
        };

        const updateDrawer = drawerMap[from];
        if (updateDrawer) {
            updateDrawer(formData?._id);
        }
    };

    const cleanFormData = (data) => {
        const cleanedData = {};
        for (const key in data) {
            if (Array.isArray(data[key]) || typeof data[key] === 'object') {
                continue; // Skip arrays and objects
            }
            cleanedData[key] = data[key];
        }
        return cleanedData;
    };

    useEffect(() => {
        // console.log('formData ', formData);
        if (formData !== null && formData !== undefined) {
            const cleanedData = cleanFormData(formData);
            setSelectedRowData(cleanedData);
            if (formData?.workItems) {
                const workItemNames = formData?.workItems;
                setWorkitems(workItemNames);
            }
            // if (formData?.impactedWorkItems) {
            //     const workItemNames = formData?.impactedWorkItems;
            //     setWorkitems(workItemNames);
            // }
            if (formData?.labels) {
                const labelList = formData?.labels;
                setLabels(labelList);
            }
            if (formData?.risk) {
                setRisk(formData?.risk);
            }
            if (formData?.assumption) {
                setAssumption(formData?.assumption);
            }
            if (formData?.issue) {
                setIssue(formData?.issue);
            }
            if (formData?.dependency) {
                setDependency(formData?.dependency);
            }
            setLoading(false);
        }
    }, [formData]);

    const handleDelete = () => {
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
        let url = '';

        if (from === "risk") {
            url = baseURL + `risk?slug=${slug}`;
        }
        if (from === "assumption") {
            url = baseURL + `assumption?slug=${slug}`;
        }
        if (from === "issue") {
            url = baseURL + `issue?slug=${slug}`;
        }
        if (from === "dependencies") {
            url = baseURL + `dependency?slug=${slug}`;
        }
        if (from === "sprint") {
            url = baseURL + `sprint?slug=${slug}`;
        }
        if (from === "stakeholder") {
            url = baseURL + `stakeholder?slug=${slug}`;
        }
        if (from === "team") {
            url = baseURL + `team?slug=${slug}`;
        }
        if (from === "member") {
            url = baseURL + `member?slug=${slug}`;
        }
        if (from === "users") {
            url = baseURL + `users?slug=${slug}`;
        }
        if (from === "holiday") {
            url = baseURL + `holiday?slug=${slug}`;
        }
        if (from === "timesheet") {
            url = baseURL + `timesheet?slug=${slug}`;
        }
        if (from === "retrospective") {
            url = baseURL + `retrospective?slug=${slug}`;
        }
        if (from === "timer") {
            url = baseURL + `timer?slug=${slug}`;
        }
        if (from === "bookmark") {
            url = baseURL + `bookmark?slug=${slug}`;
        }
        if (from === "release") {
            url = baseURL + `release?slug=${slug}`;
        }
        if (from === "roadmap") {
            url = baseURL + `roadmap?slug=${slug}`;
        }
        if (from === "backlog") {
            url = baseURL + `backlog?slug=${slug}`;
        }
        if (from === "todo") {
            url = baseURL + `todo?slug=${slug}`;
        }

        let config = {
            method: 'delete',
            url: url,
            data: [formData._id]
        };

        axios.request(config)
            .then(response => {
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
                // console.log('Delete Reponse ', response?.data);
                if (from === "risk") {
                    updateRiskList(response?.data);
                }
                if (from === "assumption") {
                    updateAssumptionList(response?.data);
                }
                if (from === "issue") {
                    updateIssueList(response?.data);
                }
                if (from === "dependencies") {
                    updateDependencyList(response?.data);
                }
                if (from === "project") {
                    updateProjectList(response?.data);
                }
                if (from === "sprint") {
                    updateSprintList(response?.data);
                }
                if (from === "stakeholder") {
                    updateStakeholderList(response?.data);
                }
                if (from === "team") {
                    updateTeamList(response?.data);
                }
                if (from === "member") {
                    memberList(response?.data);
                }
                if (from === "document") {
                    updateDocumentList(response?.data);
                }
                if (from === "users") {
                    updateUsersList(response?.data);
                }
                if (from === "retrospective") {
                    updateRetrospectiveList(response?.data);
                }
                if (from === "timer") {
                    updateTimerList(response?.data);
                }
                if (from === "timesheet") {
                    updateTimesheetList(response?.data);
                }
                if (from === "bookmark") {
                    updateBookmarkList(response?.data);
                }
                if (from === "release") {
                    updateReleaseList(response?.data);
                }
                if (from === "roadmap") {
                    updateRoadmapList(response?.data);
                }
                if (from === "backlog") {
                    updateBacklogList(response?.data);
                }
                if (from === "todo") {
                    updatedTodoList(response?.data);
                }

            })
            .catch(err => {
                console.log('Error ', err);
                toast.error(err, {
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
    }

    const ActionButtons = () => (
        <>
            <div className="flex">
                {from !== "document" && (
                    <button onClick={handleOpenForm} className="pulsebuttonwhite mr-2">
                        <span>Edit</span>
                    </button>
                )}
                <button onClick={handleDelete} className="cursor-pointer mb-2 mr-2 border border-slate-300 px-3 rounded-sm">
                    <DeleteOutlineIcon />
                </button>
            </div>
        </>
    );

    return (
        <>
            {!loading ? (
                <div>
                    {from === "member" ? (
                        <div>
                            {session?.data?.role === "Administrator" &&
                                <div className="mt-5 mr-4 flex justify-end">
                                    <ActionButtons />
                                </div>
                            }
                        </div>
                    ) : (
                        <div className="mt-5 mr-4 flex justify-end">
                            <ActionButtons />
                        </div>
                    )}
                    <div ref={componentRef}>
                        <DetailsPage
                            selectedRowData={selectedRowData}
                            workitems={workitems}
                            labels={labels}
                        // risks={risks}
                        // assumptions={assumptions}
                        // issues={issues}
                        // dependencys={dependencys}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center p-4 min-h-[40vh]">
                    <div className="p-10">
                        <div className="mt-7 flex justify-center">
                            <div>
                                <div className="text-md text-center mt-4">
                                    No record to display.
                                    <br />
                                    <br />
                                    Please click on blue highlighted text to see information.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
