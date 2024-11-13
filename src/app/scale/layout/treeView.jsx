"use client";
import { useEffect, useState, forwardRef } from "react";
import clsx from 'clsx';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
    TreeItem2Content,
    TreeItem2IconContainer,
    TreeItem2Root,
    TreeItem2GroupTransition,
} from '@mui/x-tree-view/TreeItem2';
import { unstable_useTreeItem2 as useTreeItem } from '@mui/x-tree-view/useTreeItem2';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FilterListIcon from '@mui/icons-material/FilterList';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import GroupsIcon from '@mui/icons-material/Groups';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { useRouter } from 'next-nprogress-bar';
import axios from 'axios';
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import useAppStore from '@/store/appStore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TimelineIcon from '@mui/icons-material/Timeline';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { useSession } from "next-auth/react";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import { Tooltip } from '@mui/material';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import InboxIcon from '@mui/icons-material/Inbox';
import DrawIcon from '@mui/icons-material/Draw';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import WorkIcon from '@mui/icons-material/Work';
import ChecklistIcon from '@mui/icons-material/Checklist';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import { usePathname } from 'next/navigation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MapIcon from '@mui/icons-material/Map';
import FeedbackIcon from '@mui/icons-material/Feedback';
import VideoChatIcon from '@mui/icons-material/VideoChat';
import ChatIcon from '@mui/icons-material/Chat';

const CustomTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
    color: theme.palette.text.secondary,
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    marginBottom: theme.spacing(0.3),
    color: theme.palette.text.secondary,
    borderRadius: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.expanded': {
        fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&.focused, &.selected, &.selected.focused': {
        backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
        color: 'var(--tree-view-color)',
    },
}));

const CustomTreeItemIconContainer = styled(TreeItem2IconContainer)(({ theme }) => ({
    marginRight: theme.spacing(0),
}));

const CustomTreeItemGroupTransition = styled(TreeItem2GroupTransition)(
    ({ theme }) => ({
        marginLeft: 0,
        [`& .content`]: {
            paddingLeft: theme.spacing(0.5),
        },
    }),
);

const CustomTreeItem = forwardRef(function CustomTreeItem(props, ref) {
    const theme = useTheme();
    const {
        id,
        itemId,
        label,
        disabled,
        children,
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        colorForDarkMode,
        bgColorForDarkMode,
        ...other
    } = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getLabelProps,
        getGroupTransitionProps,
        status,
    } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

    const style = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
        '--tree-view-bg-color':
            theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };
    // const style = {
    //     '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
    //     '--tree-view-bg-color':
    //         theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    // };

    return (
        <TreeItem2Provider itemId={itemId}>
            <CustomTreeItemRoot {...getRootProps({ ...other, style })}>
                <CustomTreeItemContent
                    {...getContentProps({
                        className: clsx('content', {
                            expanded: status.expanded,
                            selected: status.selected,
                            focused: status.focused,
                        }),
                    })}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            alignItems: 'center',
                            p: 0.5,
                            pr: 0,
                        }}
                    >
                        <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                        <Typography
                            {...getLabelProps({
                                variant: 'body2',
                                sx: { display: 'flex', fontWeight: 'inherit', flexGrow: 1 },
                            })}
                        />
                        <Typography variant="caption" color="inherit">
                            {labelInfo}
                        </Typography>
                    </Box>
                    <CustomTreeItemIconContainer {...getIconContainerProps()}>
                        <TreeItem2Icon status={status} />
                    </CustomTreeItemIconContainer>
                </CustomTreeItemContent>
                {children && (
                    <CustomTreeItemGroupTransition {...getGroupTransitionProps()} />
                )}
            </CustomTreeItemRoot>
        </TreeItem2Provider>
    );
});

function EndIcon() {
    return <div style={{ width: 24 }} />;
}

export default function TreeView() {
    const baseURL = '/api/';
    const router = useRouter();
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const { projectList, updateProjectList, dopen } = useAppStore();
    const { updateExpandedItems, expandedItems, selectedMenu, currentProject, updateCurrentProject } = useAppStore();
    const apiRef = useTreeViewApiRef();
    const handleExpandedItemsChange = (event, itemIds) => {
        updateExpandedItems(itemIds);
    };
    const { data: session } = useSession();
    const [localSessiondata, setLocalSessiondata] = useState("");
    const [loadMenu, setLoadMenu] = useState(false);
    const currentPath = usePathname();
    const slug = currentPath.split("/")[4];
    const preslug = currentPath.split("/")[3];
    const rootslug = currentPath.split("/")[2];

    useEffect(() => {
        setLocalSessiondata(session);
    }, [session])

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (projectList?.length > 0) {
            const activeProject = projectList.find(proj => proj.isActive === true);
            // console.log('activeProject ', activeProject);
            setSelectedProject(activeProject);
            updateCurrentProject(activeProject);
        }
        else {
            updateCurrentProject(null);
            setSelectedProject(null);
        }
    }, [projectList]);

    useEffect(() => {
        setSelectedProject(currentProject);
    }, [currentProject]);

    useEffect(() => {
        // console.log('projectList ', projectList);
        setLoadMenu(false);
        setProjects(projectList);
        setLoadMenu(true);
    }, [projectList]);


    const getData = async () => {
        const toastId = toast.loading("Loading...", {
            position: "top-center",
            theme: "light",
            style: {
                width: '380px',
            },
        });

        let posturl = baseURL + "project";
        try {
            const response = await axios.get(posturl);
            // console.log('Project Data ', response.data);
            setProjects(response?.data);
            updateProjectList(response?.data);
            setLoading(false);
            toast.update(toastId, {
                render: "Done",
                type: "success",
                position: "top-center",
                isLoading: false,
                progress: undefined,
                autoClose: 200,
                hideProgressBar: true,
                theme: "light",
                style: {
                    width: '380px',
                },
            });
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                deleteCookie("logged");
                signOut();
            }
        }
    };

    const homeIcon = () => {
        return <HomeIcon className="text-blue-800 mr-2" />;
    }
    const summarizeIcon = () => {
        return <SummarizeIcon className="text-blue-800 mr-2" />;
    }
    const dashboardIcon = () => {
        return <DashboardIcon className="text-teal-500 mr-2" />;
    }
    const settingsIcon = () => {
        return <SettingsIcon className="text-blue-800 mr-2" />;
    }
    const calendarMonthIcon = () => {
        return <CalendarMonthIcon className="text-blue-800 mr-2" />;
    }
    const textSnippetIcon = () => {
        return <TextSnippetIcon className="text-blue-800 mr-2" />;
    }
    const webStoriesIcon = () => {
        return <WebStoriesIcon className="text-blue-800 mr-2" />;
    }
    const directionsRunIcon = () => {
        return <DirectionsRunIcon className="text-emerald-500 mr-2" />;
    }
    const filterListIcon = () => {
        return <FilterListIcon className="text-blue-800 mr-2" />;
    }
    const tipsAndUpdatesIcon = () => {
        return <TipsAndUpdatesIcon className="text-yellow-400 mr-2" />;
    }
    const groupsIconLight = () => {
        return <GroupsIcon className="text-purple-500 mr-2" />;
    }
    const beachAccessIcon = () => {
        return <BeachAccessIcon className="text-blue-800 mr-2" />;
    };
    const dataThresholdingIcon = () => {
        return <DataThresholdingIcon className="text-blue-800 mr-2" />;
    }
    const deviceHubIcon = () => {
        return <DeviceHubIcon className="text-purple-500 mr-2" />;
    }
    const driveFileRenameOutlineIcon = () => {
        return <DriveFileRenameOutlineIcon className="text-blue-800 mr-2" />;
    }
    const openInNewIcon = () => {
        return <OpenInNewIcon className="text-purple-800 mr-2" />;
    }
    const timelineIcon = () => {
        return <TimelineIcon className="text-green-500 mr-2" />;
    }
    const findInPageIcon = () => {
        return <FindInPageIcon className="text-purple-400 mr-2" />;
    }
    const autoStoriesIcon = () => {
        return <AutoStoriesIcon className="text-blue-800 mr-2" />;
    }
    const accountTreeIcon = () => {
        return <AccountTreeIcon className="text-purple-400 mr-2" />;
    }
    const punchClockIcon = () => {
        return <PunchClockIcon className="text-amber-500 mr-2" />;
    };
    const importContactsIcon = () => {
        return <ImportContactsIcon className="text-green-800 mr-2" />;
    }
    const inboxIcon = () => {
        return <InboxIcon className="text-blue-800 mr-2" />;
    }
    const drawIcon = () => {
        return <DrawIcon className="text-teal-600 mr-2" />;
    }
    const videoChatIcon = () => {
        return <VideoChatIcon className="text-blue-600 mr-2" />;
    }
    const chatIcon = () => {
        return <ChatIcon className="text-green-600 mr-2" />;
    }
    const viewKanbanIcon = () => {
        return <ViewKanbanIcon className="text-teal-600 mr-2" />;
    }
    const checklistIcon = () => {
        return <ChecklistIcon className="text-teal-600 mr-2" />;
    }
    const workIcon = () => {
        return <WorkIcon className="text-blue-800 mr-2" />;
    }
    const bookmarkIcon = () => {
        return <BookmarkIcon className="text-yellow-500 mr-2" />;
    }
    const avTimerIcon = () => {
        return <AvTimerIcon className="text-red-400 mr-2" />;
    }
    const notificationsActiveIcon = () => {
        return <NotificationsActiveIcon className="text-red-500 mr-2" />;
    }
    const mapIcon = () => {
        return <MapIcon className="text-slate-700 mr-2" />;
    }
    const feedbackIcon = () => {
        return <FeedbackIcon className="text-slate-700 mr-2" />;
    }


    const getProjectName = () => {
        if (selectedProject?.projectName) {
            return (
                <div>
                    <div className="text-[11px]">Project</div>
                    <div className="font-semibold">{selectedProject?.projectName}</div>
                </div>
            )
            // return selectedProject?.projectName;
        } else {
            return 'Home';
        }
    }

    return (
        <>
            {!loading ? (
                <div className="mt-2 ml-2">
                    <SimpleTreeView
                        aria-label="gmail"
                        // defaultExpandedItems={['3']}
                        // defaultSelectedItems="5"
                        slots={{
                            expandIcon: ArrowRightIcon,
                            collapseIcon: ArrowDropDownIcon,
                            endIcon: EndIcon,
                        }}
                        sx={{ flexGrow: 1, maxWidth: 220 }}
                        apiRef={apiRef}
                        expandedItems={expandedItems}
                        onExpandedItemsChange={handleExpandedItemsChange}
                    >
                        <Tooltip title="Home" arrow placement="right">
                            <CustomTreeItem
                                className={`${rootslug === "home" && "bg-blue-100 shadow-sm"}`}
                                itemId="1" label={dopen && getProjectName()} labelIcon={homeIcon}
                                onClick={() => {
                                    router.push("/scale/home/");
                                }}
                            />
                        </Tooltip>
                        <hr className="border-t-2 border-gray-300 my-4" />
                        <Tooltip title="Inbox" arrow placement="right">
                            <CustomTreeItem
                                className={`${rootslug === "inbox" && "bg-blue-100 shadow-sm"}`}
                                itemId="3" label={dopen && `Inbox`} labelIcon={inboxIcon}
                                onClick={() => {
                                    router.push("/scale/inbox/");
                                }}
                            />
                        </Tooltip>
                        {projects?.length !== 0 && loadMenu && selectedProject?.projectSlug !== undefined && (
                            <div>

                                {selectedMenu === "Dashboard" && (
                                    <Tooltip title="Dashboard" arrow placement="right">
                                        <hr className="border-t-2 border-gray-300 my-4" />
                                        <CustomTreeItem
                                            className={`${preslug === "dashboard" && "bg-blue-100 shadow-sm"}`}
                                            itemId={selectedProject?.projectSlug + "dashboard"} label={dopen && `Dashboard`} labelIcon={dashboardIcon}
                                            onClick={() => {
                                                router.push("/scale/" + selectedProject?.projectSlug + "/dashboard");
                                            }}
                                        />
                                    </Tooltip>
                                )}
                                {selectedMenu === "Planning" && (
                                    <div>
                                        <hr className="border-t-2 border-gray-300 my-4" />
                                        {currentProject?.modules?.TeamCharter && (
                                            <Tooltip title="Team Charter" arrow placement="right">
                                                <CustomTreeItem
                                                    className={`${slug === "teamcharter" && "bg-blue-100 shadow-sm"}`}
                                                    itemId={selectedProject.projectSlug + "teamcharter"} label={dopen && `Team Charter`} labelIcon={findInPageIcon}
                                                    onClick={() => {
                                                        router.push("/scale/" + selectedProject.projectSlug + "/planning/teamcharter");
                                                    }}
                                                />
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Timeline" arrow placement="right">
                                            <CustomTreeItem
                                                className={`${slug === "timeline" && "bg-blue-100 shadow-sm"}`}
                                                itemId={selectedProject.projectSlug + "timeline"} label={dopen && `Timeline`} labelIcon={timelineIcon}
                                                onClick={() => {
                                                    router.push("/scale/" + selectedProject.projectSlug + "/planning/timeline");
                                                }} />
                                        </Tooltip>
                                        {currentProject?.modules?.Backlog && (
                                            <Tooltip title="Backlog" arrow placement="right">
                                                <CustomTreeItem
                                                    className={`${slug === "backlog" && "bg-blue-100 shadow-sm"}`}
                                                    itemId={selectedProject._id + "backlog"} label={dopen && `Backlog`} labelIcon={webStoriesIcon}
                                                    onClick={() => {
                                                        router.push("/scale/" + selectedProject.projectSlug + "/planning/backlog");
                                                    }}
                                                />
                                            </Tooltip>
                                        )}
                                        {localSessiondata?.data?.role === "Administrator" && (
                                            <div>
                                                {currentProject?.modules?.Sprints && (
                                                    <Tooltip title="Sprints" arrow placement="right">
                                                        <CustomTreeItem
                                                            className={`${slug === "sprints" && "bg-blue-100 shadow-sm"}`}
                                                            itemId={selectedProject._id + "sprints"} label={dopen && `Sprints`} labelIcon={directionsRunIcon}
                                                            onClick={() => {
                                                                router.push("/scale/" + selectedProject.projectSlug + "/planning/sprints");
                                                            }}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        )}
                                    </ div>
                                )}
                                {selectedMenu === "Development" && (
                                    <div>
                                        <hr className="border-t-2 border-gray-300 my-4" />
                                        <Tooltip title="Board" arrow placement="right">
                                            <CustomTreeItem
                                                className={`${slug === "board" && "bg-blue-100 shadow-sm"}`}
                                                itemId={selectedProject._id + "kanbanBoard"} label={dopen && `Board`} labelIcon={viewKanbanIcon}
                                                onClick={() => {
                                                    router.push("/scale/" + selectedProject.projectSlug + "/development/board");
                                                }}
                                            />
                                        </Tooltip>
                                        {currentProject?.modules?.Filters && (
                                            <Tooltip title="Filters" arrow placement="right">
                                                <CustomTreeItem
                                                    className={`${slug === "filters" && "bg-blue-100 shadow-sm"}`}
                                                    itemId={selectedProject._id + "filters"} label={dopen && `Filters`} labelIcon={filterListIcon}
                                                    onClick={() => {
                                                        router.push("/scale/" + selectedProject.projectSlug + "/development/filters");
                                                    }}
                                                />
                                            </Tooltip>
                                        )}
                                    </ div>
                                )}
                                {selectedMenu === "Team" && (
                                    <div>
                                        <hr className="border-t-2 border-gray-300 my-4" />
                                        <Tooltip title="Team" arrow placement="right">
                                            <CustomTreeItem
                                                className={`${slug === "member" && "bg-blue-100 shadow-sm"}`}
                                                itemId={selectedProject._id + "team"} label={dopen && `Team`} labelIcon={groupsIconLight}
                                                onClick={() => {
                                                    router.push("/scale/" + selectedProject.projectSlug + "/team/member");
                                                }}
                                            />
                                        </Tooltip>
                                    </ div>
                                )}
                                {selectedMenu === "Raid" && (
                                    <div>
                                        <hr className="border-t-2 border-gray-300 my-4" />
                                        {currentProject?.modules?.Risk && (
                                            <Tooltip title="Risk Log" arrow placement="right">
                                                <CustomTreeItem
                                                    className={`${slug === "risks" && "bg-blue-100 shadow-sm"}`}
                                                    itemId={selectedProject._id + "risklog"} label={dopen && `Risk Log`} labelIcon={driveFileRenameOutlineIcon}
                                                    onClick={() => {
                                                        router.push("/scale/" + selectedProject.projectSlug + "/raid/risks");
                                                    }}
                                                />
                                            </Tooltip>
                                        )}
                                        {currentProject?.modules?.Assumptions && (
                                            <Tooltip title="Assumptions Log" arrow placement="right">
                                                <CustomTreeItem
                                                    className={`${slug === "assumptions" && "bg-blue-100 shadow-sm"}`}
                                                    itemId={selectedProject._id + "assumptionslog"} label={dopen && `Assumptions Log`} labelIcon={driveFileRenameOutlineIcon}
                                                    onClick={() => {
                                                        router.push("/scale/" + selectedProject.projectSlug + "/raid/assumptions");
                                                    }}
                                                />
                                            </Tooltip>
                                        )}
                                    </ div>
                                )}
                                {selectedMenu === "Utils" && (
                                    <div>
                                        <hr className="border-t-2 border-gray-300 my-4" />
                                        <Tooltip title="Pages" arrow placement="right">
                                            <CustomTreeItem
                                                className={`${preslug === "pages" && "bg-blue-100 shadow-sm"}`}
                                                itemId={selectedProject.projectSlug + "pages"} label={dopen && `Pages`} labelIcon={autoStoriesIcon}
                                                onClick={() => {
                                                    router.push("/scale/" + selectedProject.projectSlug + "/pages");
                                                }}
                                            >
                                            </ CustomTreeItem>
                                        </Tooltip>
                                        <Tooltip title="Timer" arrow placement="right">
                                            <CustomTreeItem
                                                className={`${preslug === "timer" && "bg-blue-100 shadow-sm"}`}
                                                itemId="timer" label={dopen && `Timer`} labelIcon={avTimerIcon}
                                                onClick={() => {
                                                    router.push("/scale/" + selectedProject.projectSlug + "/timer");
                                                }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Bookmarks" arrow placement="right">
                                            <CustomTreeItem
                                                className={`${preslug === "bookmarks" && "bg-blue-100 shadow-sm"}`}
                                                itemId="Bookmarks" label={dopen && `Bookmarks`} labelIcon={bookmarkIcon}
                                                onClick={() => {
                                                    router.push("/scale/" + selectedProject.projectSlug + "/bookmarks");
                                                }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Whiteboard" arrow placement="right">
                                            <CustomTreeItem
                                                className={`${rootslug === "whiteboard" && "bg-blue-100 shadow-sm"}`}
                                                itemId="4" label={dopen && `Whiteboard`} labelIcon={drawIcon}
                                                onClick={() => {
                                                    router.push("/scale/whiteboard/");
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                )}
                                <hr className="border-t-2 border-gray-300 my-4" />
                                <Tooltip title="Admin Settings" arrow placement="right">
                                    <CustomTreeItem
                                        className={`${rootslug === "admin-settings" && "bg-blue-100 shadow-sm"}`}
                                        itemId="6" label={dopen && `Admin Settings`} labelIcon={settingsIcon}
                                        onClick={() => {
                                            router.push("/scale/admin-settings/");
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        )}
                    </SimpleTreeView>
                </div >
            ) : (
                <div className="mt-2 ml-2">
                    <SimpleTreeView
                        aria-label="gmail"
                        // defaultExpandedItems={['3']}
                        // defaultSelectedItems="5"
                        slots={{
                            expandIcon: ArrowRightIcon,
                            collapseIcon: ArrowDropDownIcon,
                            endIcon: EndIcon,
                        }}
                        sx={{ flexGrow: 1, maxWidth: 220 }}
                        apiRef={apiRef}
                        expandedItems={expandedItems}
                        onExpandedItemsChange={handleExpandedItemsChange}
                    >
                        <Tooltip title="Home" arrow placement="right">
                            <CustomTreeItem itemId="1" label={dopen && getProjectName()} labelIcon={homeIcon}
                                onClick={() => {
                                    router.push("/scale/home/");
                                }}
                            />
                        </Tooltip>
                    </SimpleTreeView>
                </div>
            )
            }
        </>
    );
}
