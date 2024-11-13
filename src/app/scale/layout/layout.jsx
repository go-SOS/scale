import * as React from 'react';
import { signOut, useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useAppStore from "@/store/appStore";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Badge from "@mui/material/Badge";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { Tooltip } from '@mui/material';
import { deleteCookie } from "cookies-next";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import RocketOutlinedIcon from '@mui/icons-material/RocketOutlined';
import { ToastContainer } from 'react-toastify';
import UseShortcut from "@/components/hotkey/hotkey";
import ProjectDrawer from "@/components/project/projectDrawer";
import TreeView from './treeView';
import MailDrawer from "@/components/mail/mailDrawer";
import WorkIcon from '@mui/icons-material/Work';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SprintDrawer from '@/components/sprint/sprintDrawer';
import WorkitemDrawer from '@/components/workitem/workitemDrawer';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AssumptionDrawer from '@/components/assumption/assumptionDrawer';
import TimesheetDrawer from '@/components/timesheet/timesheetDrawer';
import RiskDrawer from '@/components/risk/riskDrawer';
import CommentDrawer from "@/components/comment/commentDrawer";
import BookmarkDrawer from "@/components/bookmark/bookmarkDrawer";
import TeamcharterDrawer from '@/components/teamcharter/teamcharterDrawer';
import CommonViewDrawer from "@/common/view/commonViewDrawer";
import DashboardDrawer from "@/components/dashboard/dashboardDrawer";
import PunchClockIcon from '@mui/icons-material/PunchClock';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import MyStopwatch from "@/components/timer/stopwatch";
import TimerDrawer from "@/components/timer/timerDrawer";
import useSlug from "@/app/scale/layout/hooks/useSlug";

// https://mui.com/x/react-tree-view/rich-tree-view/customization/
// Using MUI customized Tree View to show menu items

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

function Layout(props) {
    const { window } = props;
    const { children } = props;
    const { dopen, updateDopen, projectList, updateSelectedMenu, selectedMenu, isTimer } = useAppStore();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorMoreEl, setAnchorMoreEl] = React.useState(null);
    const [localSessiondata, setLocalSessiondata] = React.useState("");
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const router = useRouter();
    const isMenuOpen = Boolean(anchorEl);
    const isMoreMenuOpen = Boolean(anchorMoreEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const pathname = usePathname();
    const [isCollapse, setIsCollapse] = React.useState(false);
    const refMore = React.useRef(null);
    const refProfile = React.useRef(null);
    const { updateIsProjectDrawer, updateIsSprintDrawer, updateIsWorkitemDrawer, updateSessionData } = useAppStore();
    const { updateIsDocumentDrawer, updateIsRiskDrawer, updateIsAssumptionDrawer, updateIsIssueDrawer, updateIsDependencyDrawer } = useAppStore();
    const { updateIsTimesheetDrawer, updateIsRetrospectiveDrawer, updateIsBookmarkDrawer, currentProject, updateIsTodoDrawer } = useAppStore();
    const { data: session } = useSession();
    const [isDisabled, setIsDisabled] = React.useState(true);
    const [menuLoading, setMenuLoading] = React.useState(true);
    const [showTimer, setShowTimer] = React.useState(false);
    const [isRaid, setIsRaid] = React.useState(true);
    const [isPlanning, setIsPlanning] = React.useState(true);
    const { slug } = useSlug();

    const handleClickOutside = (event) => {
        if (refMore.current && !refMore.current.contains(event.target)) {
            setAnchorMoreEl(null);
        }
    };

    const handleClickOutsideProfile = (event) => {
        if (refProfile.current && !refProfile.current.contains(event.target)) {
            setAnchorEl(null);
        }
    };

    React.useEffect(() => {
        if (isTimer) {
            setShowTimer(true);
        } else {
            setShowTimer(false);
        }
    }, [isTimer]);

    React.useEffect(() => {
        if (projectList && projectList !== null && projectList !== undefined && projectList.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [projectList]);

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutsideProfile);
        return () => {
            document.removeEventListener('click', handleClickOutsideProfile);
        };
    }, []);


    const handleCollapse = () => {
        setIsCollapse(!isCollapse);
    };

    React.useEffect(() => {
        updateDopen(true);
        const isContained = pathname.includes('/scale/projects');
        setIsCollapse(isContained);
        setMenuLoading(false);
    }, [])

    React.useEffect(() => {
        // console.log('currentProject ', currentProject?.modules);
        const moduleData = currentProject?.modules;
        if (moduleData !== undefined) {
            const containsKeys = (obj, keys) => keys.some(key => key in obj);

            const raidToCheck = ["Risk", "Assumptions", "Issues", "Dependencies"];
            const resultRaid = containsKeys(moduleData, raidToCheck);
            setIsRaid(resultRaid);

            const planningToCheck = ["TeamCharter", "Plan", "Backlog", "Sprints", "Releases", "Calendar"];
            const resultPlanning = containsKeys(moduleData, planningToCheck);
            setIsPlanning(resultPlanning)
        }

        // console.log('currentProject resultRaid', resultRaid);
        // console.log('currentProject resultPlanning', resultPlanning);

    }, [currentProject])

    // console.log('Layout Session ', session);

    React.useEffect(() => {
        const stringWithoutSlash = pathname.substring(1);
        const formattedString = stringWithoutSlash
            .toLowerCase()
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

        setLocalSessiondata(session);
        updateSessionData(session);
    }, [session])

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMoreMenuClose = () => {
        setAnchorMoreEl(null);
    };

    const handleMoreMenuOpen = (event) => {
        setAnchorMoreEl(event.currentTarget);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const menuId = "primary-search-account-menu";
    const moreMenuId = "primary-more-menu";
    const renderMoreMenu = (
        <Menu
            anchorEl={anchorMoreEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={moreMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMoreMenuOpen}
            onClose={handleMoreMenuClose}
            PaperProps={{
                style: {
                    width: '300px',
                    marginTop: '46px'
                },
            }}
        >
            {localSessiondata?.data?.role === "Administrator" && localSessiondata?.data?.isSuperAdmin && (
                <MenuItem onClick={() => updateIsProjectDrawer(true)} ><DynamicFeedIcon fontSize='small' className='mr-2 text-blue-800' />
                    <span className="text-[17px] cursor-pointer text-blue-950">
                        Add Project
                    </span>
                </MenuItem>
            )}
            <MenuItem
                onClick={() => updateIsWorkitemDrawer(true)}
                className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                disabled={isDisabled}
            >
                <WorkIcon fontSize='small' className='mr-2 text-blue-800' />
                <span className="text-[17px] text-blue-950">
                    Add WorkItem
                </span>
            </MenuItem>
            {localSessiondata?.data?.role === "Administrator" && (
                <MenuItem onClick={() => updateIsSprintDrawer(true)}
                    className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    disabled={isDisabled}
                >
                    <DirectionsRunIcon fontSize='small' className='mr-2 text-blue-800' />
                    <span className="text-[17px] cursor-pointer text-blue-950">
                        Add Sprint
                    </span>
                </MenuItem>
            )}
            <MenuItem onClick={() => updateIsRiskDrawer(true)}
                className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                disabled={isDisabled}
            >
                <DriveFileRenameOutlineIcon fontSize='small' className='mr-2 text-blue-800' />
                <span className="text-[17px] cursor-pointer text-blue-950">
                    Add Risk
                </span>
            </MenuItem>
            <MenuItem onClick={() => updateIsAssumptionDrawer(true)}
                className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                disabled={isDisabled}
            >
                <DriveFileRenameOutlineIcon fontSize='small' className='mr-2 text-blue-800' />
                <span className="text-[17px] cursor-pointer text-blue-950">
                    Add Assumption
                </span>
            </MenuItem>
            <MenuItem onClick={() => updateIsTimesheetDrawer(true)}
                className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                disabled={isDisabled}
            >
                <PunchClockIcon fontSize='small' className='mr-2 text-blue-800' />
                <span className="text-[17px] cursor-pointer text-blue-950">
                    Add Timesheet
                </span>
            </MenuItem>
            <MenuItem onClick={() => updateIsBookmarkDrawer(true)}
                className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                disabled={isDisabled}
            >
                <BookmarkAddOutlinedIcon fontSize='small' className='mr-2 text-blue-800' />
                <span className="text-[17px] cursor-pointer text-blue-950">
                    Add Bookmark
                </span>
            </MenuItem>
        </Menu >
    );

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
                style: {
                    width: '300px',
                    marginTop: '46px'
                },
            }}
        >
            <MenuItem onClick={() => router.push("/scale/admin-settings/profile")}><AccountCircleIcon fontSize='small' className='mr-2' />
                <span className="text-[17px] cursor-pointer text-blue-950">
                    {session?.data?.fullName ? (`${session?.data?.fullName}`) : localSessiondata?.data?.email}
                </span>
            </MenuItem>
            <MenuItem onClick={() => {
                router.push("/scale/admin-settings");
            }}><BusinessIcon fontSize='small' className='mr-2' />
                <span className="text-[17px] cursor-pointer text-blue-950">
                    Settings
                </span>
            </MenuItem>
            <MenuItem onClick={() => handleLogout()}><LogoutIcon fontSize='small' className='mr-2' />
                <span className="text-[17px] cursor-pointer text-blue-950">
                    Logout
                </span >
            </MenuItem>
        </Menu>
    );


    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const handleLogout = () => {
        updateSessionData(null);
        deleteCookie("logged");
        signOut();
    }

    const navigateToSelectedMenu = (menu) => {
        if (menu === "Dashboard") {
            updateSelectedMenu(menu);
            router.push("/scale/" + slug + "/dashboard");
        }
        if (menu === "Planning") {
            updateSelectedMenu(menu);
            router.push("/scale/" + slug + "/planning/backlog");
        }
        if (menu === "Development") {
            updateSelectedMenu(menu);
            router.push("/scale/" + slug + "/development/board");
        }
        if (menu === "Team") {
            updateSelectedMenu(menu);
            router.push("/scale/" + slug + "/team/member");
        }
        if (menu === "Raid") {
            updateSelectedMenu(menu);
            router.push("/scale/" + slug + "/raid/risks");
        }
        if (menu === "Utils") {
            updateSelectedMenu(menu);
            router.push("/scale/" + slug + "/pages");
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <UseShortcut />
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ backgroundColor: "#ffffff", color: "#2f2f2f" }}
                className="gradientlight z-50"
                elevation={1}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={() => {
                            updateDopen(!dopen);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        Scale
                    </Typography>
                    <Box sx={{ flexGrow: 1 / 2 }} />
                    {!menuLoading && (
                        <div className="flex">
                            <div className="mx-3 px-1 font-semibold cursor-pointer"
                                onClick={() => {
                                    updateSelectedMenu('Projects');
                                    router.push("/scale/project");
                                }}
                            >
                                {selectedMenu === "Projects" ? (
                                    <div className="px-4 py-1 mt-1 bg-blue-200 rounded-md shadow-sm">
                                        Projects
                                    </div>
                                ) :
                                    <div className="py-2">
                                        Projects
                                    </div>
                                }
                            </div>
                            <div
                                className={`mx-3 px-1 font-semibold ${isDisabled ? ' text-gray-400' : 'cursor-pointer'}`}
                                onClick={() => !isDisabled && navigateToSelectedMenu('Dashboard')}
                            >
                                {selectedMenu === "Dashboard" ? (
                                    <div className="px-4 py-1 mt-1 bg-blue-200 rounded-md shadow-sm">
                                        Dashboard
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        Dashboard
                                    </div>
                                )}
                            </div>
                            {isPlanning && (
                                <div
                                    className={`mx-3 px-1 font-semibold ${isDisabled ? ' text-gray-400' : 'cursor-pointer'}`}
                                    onClick={() => !isDisabled && navigateToSelectedMenu('Planning')}
                                >
                                    {selectedMenu === "Planning" ? (
                                        <div className="px-4 py-1 mt-1 bg-blue-200 rounded-md shadow-sm">
                                            Planning
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            Planning
                                        </div>
                                    )}
                                </div>
                            )}
                            <div
                                className={`mx-3 px-1 font-semibold ${isDisabled ? ' text-gray-400' : 'cursor-pointer'}`}
                                onClick={() => !isDisabled && navigateToSelectedMenu('Development')}
                            >
                                {selectedMenu === "Development" ? (
                                    <div className="px-4 py-1 mt-1 bg-blue-200 rounded-md shadow-sm">
                                        Development
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        Development
                                    </div>
                                )}
                            </div>
                            <div
                                className={`mx-3 px-1 font-semibold ${isDisabled ? ' text-gray-400' : 'cursor-pointer'}`}
                                onClick={() => !isDisabled && navigateToSelectedMenu('Team')}
                            >
                                {selectedMenu === "Team" ? (
                                    <div className="px-4 py-1 mt-1 bg-blue-200 rounded-md shadow-sm">
                                        Team
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        Team
                                    </div>
                                )}
                            </div>
                            {isRaid && (
                                <div
                                    className={`mx-3 px-1 font-semibold ${isDisabled ? ' text-gray-400' : 'cursor-pointer'}`}
                                    onClick={() => !isDisabled && navigateToSelectedMenu('Raid')}
                                >
                                    {selectedMenu === "Raid" ? (
                                        <div className="px-4 py-1 mt-1 bg-blue-200 rounded-md shadow-sm">
                                            Registers
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            Registers
                                        </div>
                                    )}
                                </div>
                            )}
                            <div
                                className={`mx-3 px-1 font-semibold ${isDisabled ? ' text-gray-400' : 'cursor-pointer'}`}
                                onClick={() => !isDisabled && navigateToSelectedMenu('Utils')}
                            >
                                {selectedMenu === "Utils" ? (
                                    <div className="px-4 py-1 mt-1 bg-blue-200 rounded-md shadow-sm">
                                        Utils
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        Utils
                                    </div>
                                )}
                            </div>
                            <div
                                className={`mx-3 px-1 font-semibold ${isDisabled ? ' text-gray-400' : 'cursor-pointer'}`}

                            >
                                {isDisabled ? (
                                    <div className="px-4 py-1 mt-1 bg-blue-600 opacity-45 text-slate-100 rounded-md">
                                        Board
                                    </div>
                                ) : (
                                    <div className="px-4 py-1 mt-1 bg-blue-600 text-slate-100 rounded-md"
                                        onClick={() => {
                                            router.push("/scale/" + slug + "/development/board");
                                            updateSelectedMenu("Board");
                                        }}
                                    >
                                        Board
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <Box sx={{ flexGrow: 1 }} />


                    <div className="flex justify-center mr-2" ref={refMore}>
                        <div className="text-xl font-semibold cursor-pointer" onClick={handleMoreMenuOpen}>
                            <AddCircleIcon sx={{ fontSize: "33px" }} />
                        </div>
                    </div>
                    <div className="flex justify-center mr-2">
                        <Tooltip title="New Features" arrow placement="bottom">
                            <div className="flex items-center justify-center w-8 h-8 border border-slate-700 rounded-full cursor-pointer">
                                <RocketOutlinedIcon sx={{ fontSize: "20px" }} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className="flex justify-center mr-2">
                        <Tooltip title="Notifications" arrow placement="bottom">
                            <div
                                className="flex items-center justify-center w-8 h-8 border border-slate-700 rounded-full cursor-pointer"
                            >
                                <NotificationsNoneOutlinedIcon sx={{ fontSize: "20px" }} />
                            </div>
                        </Tooltip>
                    </div>
                    <Divider orientation="vertical" flexItem style={{ marginLeft: '10px', marginRight: '10px' }} variant="middle" />
                    <Box sx={{ display: { xs: "none", md: "flex" } }} onClick={handleProfileMenuOpen} className="cursor-pointer" ref={refProfile}>
                        <span className="text-sm mt-[3px]">
                            {session?.data?.fullName ? (`${session?.data?.fullName}`) : localSessiondata?.data?.email}
                        </span>
                        <ArrowDropDownIcon
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <MoreIcon />
                        </ArrowDropDownIcon>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            {renderMoreMenu}
            <Drawer variant="permanent" open={dopen} className="z-40">
                <DrawerHeader>
                    <IconButton onClick={() => updateDopen(false)}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <TreeView />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <main>
                    {children}
                    {showTimer && (
                        <MyStopwatch />
                    )}
                    <TimerDrawer />
                    <ToastContainer />
                    <ProjectDrawer />
                    <MailDrawer />
                    <CommonViewDrawer />
                    <WorkitemDrawer />
                    <SprintDrawer />
                    <AssumptionDrawer />
                    <TimesheetDrawer />
                    <RiskDrawer />
                    <BookmarkDrawer />
                    <TeamcharterDrawer />
                    <DashboardDrawer />
                    <CommentDrawer />
                </main>
            </Box>
        </Box >
    );
}
Layout.propTypes = {
    window: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.object,
    ]).isRequired,
};

export default Layout;