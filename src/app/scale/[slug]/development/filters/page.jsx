"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";
import useAppStore from '@/store/appStore';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@mui/material/Divider';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import TableView from "@/common/tableView";
import Image from 'next/image';
import nodata from "@/img/no_data.svg";
import FilterForm from '@/common/filters/filterForm';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function Page() {
    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const [loading, setLoading] = useState(true);
    const [uiloading, seUiLoading] = useState(true);
    const [selectedModule, setSelectedModule] = useState("Select Module");
    const baseURL = '/api/';
    const [anchorSettingEl, setAnchorSettingEl] = useState(null);
    const anchorListopen = Boolean(anchorSettingEl);
    const { projectName, slug, key } = useSlug();
    const refMore = useRef(null);
    const ref = useRef(null);
    const [mtype, setType] = useState("");
    const { updateSavedFilters, updateControlledFilter, filterList } = useAppStore();
    const [anchorEls, setAnchorEls] = useState(null);
    const { updateRiskMaster, updateAssumptionMaster, updateIssueMaster, updateRetrospectivemaster, updateBookmarkmaster, updateTimermaster, updateReleaseMaster } = useAppStore();
    const { updateDependencyMaster, updateStakeholderMaster, updateBacklogMaster } = useAppStore();

    const getiForm = async (mastertype) => {
        let posturl = baseURL + mastertype;
        try {
            const response = await axios.get(posturl);
            if (mastertype === "backlogmaster") {
                updateBacklogMaster(response?.data[0]?.backlogs);
            }
            if (mastertype === "riskmaster") {
                updateRiskMaster(response?.data[0]?.risks);
            }
            if (mastertype === "assumptionmaster") {
                updateAssumptionMaster(response?.data[0]?.assumptions);
            }
            if (mastertype === "issuemaster") {
                updateIssueMaster(response?.data[0]?.issues);
            }
            if (mastertype === "dependencymaster") {
                updateDependencyMaster(response?.data[0]?.dependencies);
            }
            if (mastertype === "stakeholdermaster") {
                updateStakeholderMaster(response?.data[0]?.stakeholders);
            }
            if (mastertype === "retrospectivemaster") {
                updateRetrospectivemaster(response?.data[0]?.retrospectives);
            }
            if (mastertype === "bookmarkemaster") {
                updateBookmarkmaster(response?.data[0]?.bookmarks);
            }
            if (mastertype === "releasemaster") {
                updateReleaseMaster(response?.data[0]?.releases);
            }
            if (mastertype === "timermaster") {
                updateTimermaster(response?.data[0]?.timers);
            }
            seUiLoading(false);
        } catch (error) {
            console.error("Error", error);
        }
    };

    const handleClick = (index) => {
        setAnchorEls(index);
    };
    const handleClose = () => {
        setAnchorEls({});
    };

    useEffect(() => {
        updateSavedFilters({});
        updateControlledFilter({});
        seUiLoading(false);
        handleOpenForm("Backlog");
    }, []);

    useEffect(() => {
        if (filterList) {
            setFilters(filterList);
        }
    }, [filterList]);

    const handleDeleteClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setAnchorEls({});
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDeleteClickOutside);
        return () => {
            document.removeEventListener('click', handleDeleteClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (refMore.current && !refMore.current.contains(event.target)) {
            setAnchorSettingEl(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSettingIconClose = () => {
        setAnchorSettingEl(null);
    };

    const handleSettingIconClick = (event) => {
        setAnchorSettingEl(event.currentTarget);
    };

    const getFilters = async (type) => {
        if (type === "Dependencies") {
            type = "Dependency"
        }
        let posturl = baseURL + `filter?slug=${slug}&type=${type}`;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('Filters ', res.data);
                setFilters(res.data);
                type = type.toLowerCase();
                setType(type);
                getData(type);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const getData = async (type) => {
        if (type === "dependencies") {
            type = "dependency"
        }
        const toastId = toast.loading("Loading...", {
            position: "top-center",
            theme: "light",
            style: {
                width: '380px',
            },
        });
        type = type.toLowerCase();
        let posturl = baseURL + `${type}?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res?.data);
                setLoading(false);
                setLoadingTable(false);
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
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const handleDelete = (id) => {
        // console.log('mtype ', selectedModule);
        handleClose();
        handleSettingIconClose();
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this record?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteRow(id)
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const deleteRow = (id) => {
        let config = {
            method: 'delete',
            url: baseURL + `filter?slug=${slug}&type=${selectedModule}`,
            data: [id]
        };

        axios.request(config)
            .then(response => {
                toast.success('Filter deleted successfully!', {
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
                // getFilters(mtype);
                setFilters(response.data);
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

    const handleOpenForm = (type) => {
        if (type === "Backlog") {
            getiForm("backlogmaster");
        }
        if (type === "Risk") {
            getiForm("riskmaster");
        }
        if (type === "Assumption") {
            getiForm("assumptionmaster");
        }
        if (type === "Issue") {
            getiForm("issuemaster");
        }
        if (type === "Dependencies") {
            getiForm("dependencymaster");
        }
        if (type === "Stakeholder") {
            getiForm("stakeholdermaster");
        }
        if (type === "Retrospective") {
            getiForm("retrospectivemaster");
        }
        if (type === "Bookmark") {
            getiForm("bookmarkmaster");
        }
        if (type === "Release") {
            getiForm("releasemaster");
        }
        if (type === "Timer") {
            getiForm("timermaster");
        }
        setLoadingTable(true);
        updateSavedFilters({});
        updateControlledFilter({});
        getFilters(type);
        setSelectedModule(type);
    }

    const handleSelectFilter = (item) => {
        // console.log('Filter ', item.filter);
        updateSavedFilters(item?.filter);
        updateControlledFilter(item?.filter);
    }


    return (
        <Layout>
            {!uiloading && (
                <>
                    <Breadcrumb page="Filters" project={projectName} section="Development" />
                    <div>
                        <div className="flex mt-20 mb-3">
                            <div className="ml-3 mr-3">
                                <button
                                    className="pulsebuttonwhite px-3 py-1 mr-1"
                                    ref={refMore}
                                    id="basic-button"
                                    aria-controls={anchorListopen ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={anchorListopen ? 'true' : undefined}
                                    onClick={handleSettingIconClick}
                                >
                                    <span className="text-sm">{selectedModule == "Backlog" ? "Work Item" : selectedModule}</span>
                                    <ArrowDropDownIcon className="w-5 h-5" sx={{ fontSize: "16px" }} />
                                </button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorSettingEl}
                                    open={anchorListopen}
                                    onClose={handleSettingIconClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                    PaperProps={{
                                        style: {
                                            width: '200px',
                                        },
                                    }}
                                >
                                    <MenuItem onClick={() => handleOpenForm("Backlog")}>
                                        <span className="text-sm mt-[3px]">Work Item</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Release")}>
                                        <span className="text-sm mt-[3px]">Release</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Risk")}>
                                        <span className="text-sm mt-[3px]">Risks</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Assumption")}>
                                        <span className="text-sm mt-[3px]">Assumptions</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Issue")}>
                                        <span className="text-sm mt-[3px]">Issues</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Dependencies")}>
                                        <span className="text-sm mt-[3px]">Dependencies</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Stakeholder")}>
                                        <span className="text-sm mt-[3px]">Stakeholder</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Retrospective")}>
                                        <span className="text-sm mt-[3px]">Retrospective</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Bookmark")}>
                                        <span className="text-sm mt-[3px]">Bookmark</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleOpenForm("Timer")}>
                                        <span className="text-sm mt-[3px]">Timer</span>
                                    </MenuItem>
                                </Menu>
                            </div>
                            <div>
                                <FilterForm type={selectedModule} from="filters" />
                            </div>
                        </div>
                        {!loading ? (
                            <div>
                                <div className="">
                                    <div className="overflow-x-auto flex space-x-1">
                                        <div className="flex-none w-[200px] h-[64vh] max-w-xs bg-white shadow rounded-md border border-gray-300">
                                            <h4 className=" text-sm font-bold mb-2 text-center py-1 bg-slate-100 min-h-[30px]">Saved Filters</h4>
                                            <div ref={ref}>
                                                {filters.map(
                                                    (item, index) => (
                                                        <div key={index} className="hover:bg-slate-100">
                                                            <div className="flex">
                                                                <p className="text-gray-700 mt-2 text-left ml-2 cursor-pointer font-semibold flex">

                                                                    <div className="relative inline-block" >
                                                                        <div className='mr-1'>
                                                                            <MoreVertIcon fontSize="small"
                                                                                data-ripple-light="true"
                                                                                data-popover-target="menu"
                                                                                onClick={(event) => handleClick(index)}
                                                                            />
                                                                        </div>
                                                                        {anchorEls === index && (
                                                                            <ul
                                                                                role="menu"
                                                                                data-popover="menu"
                                                                                data-popover-placement="bottom"
                                                                                className="absolute z-10 min-w-[180px] overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
                                                                            >
                                                                                <li
                                                                                    role="menuitem"
                                                                                    className="block w-full cursor-pointer select-none rounded-md text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                                                                                    onClick={() => handleDelete(item._id)}
                                                                                >
                                                                                    Delete
                                                                                </li>
                                                                            </ul>
                                                                        )}
                                                                    </div>
                                                                    <span className='mt-[2px]' onClick={() => { handleSelectFilter(item) }}>
                                                                        {item?.name}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ height: '64vh', width: '67vw', backgroundColor: '#f0f9ff' }}>
                                            {loadingTable ? (
                                                <div className="mt-4">
                                                    <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
                                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                </div>
                                            ) : (
                                                <div>
                                                    <TableView rows={rows} from={mtype} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <div className="flex justify-center mt-32 text-md">
                                        <Image
                                            src={nodata}
                                            alt="nodata"
                                            width={230}
                                            height={230}
                                        />
                                    </div>
                                    <div className="flex justify-center text-md mt-3">
                                        No module selected.
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
}