"use client";
import { useEffect, useState, useRef, forwardRef } from "react";
import axios from "axios";
import useSlug from "@/app/scale/layout/hooks/useSlug";
import useAppStore from '@/store/appStore';
import SaveIcon from '@mui/icons-material/Save';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function FilterForm({ type, from }) {
    const [isCreating, setIsCreating] = useState(false);
    const [filterName, setFilterName] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseURL = '/api/';
    const { projectName, slug } = useSlug();
    const { userId, sessionData } = useAppStore();
    const { updateSavedFilters, savedFilters, updateFilterList } = useAppStore();
    const { updateControlledFilter } = useAppStore();
    const [anchorSettingEl, setAnchorSettingEl] = useState(null);
    const anchorListopen = Boolean(anchorSettingEl);
    const refMore = useRef(null);

    const handleClickOpen = () => {
        setIsCreating(true);
    };

    const handleClose = () => {
        setIsCreating(false);
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    const handleClickOutside = (event) => {
        if (refMore.current && !refMore.current.contains(event.target)) {
            setAnchorSettingEl(null);
        }
    };

    const handleSettingIconClick = (event) => {
        setAnchorSettingEl(event.currentTarget);
    };

    const handleSettingIconClose = () => {
        setAnchorSettingEl(null);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (isCreating) {
            handleClickOpen();
        }
    }, [isCreating]);


    const creatingFilter = () => {
        setIsCreating(true);
    }

    const getData = async () => {
        let posturl = baseURL + `filter?slug=${slug}&type=${type}`;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('Filters ', res.data);
                setRows(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const createFilter = async () => {
        // console.log('savedFilters ', savedFilters);
        if (filterName && filterName.trim() !== '') {
            setLoading(true);
            try {
                let endpoint = baseURL + `filter?slug=${slug}&type=${type}`;
                let data = {
                    userId: userId,
                    projectSlug: slug,
                    projectName: projectName,
                    name: filterName,
                    type: type,
                    filter: savedFilters,
                    lastModifiedBy: sessionData.data.email,
                    createdBy: sessionData.data.email
                }
                let method = "post";
                const { data: responseData } = await axios[method](endpoint, data);
                // console.log('responseData ', responseData);
                setRows(responseData);
                updateFilterList(responseData);
                setFilterName("");
                updateSavedFilters({});
                updateControlledFilter({});
                setIsCreating(false);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setIsCreating(false);
            }
        } else {
            setIsCreating(false);
        }
    };

    const handleOpenForm = (item) => {
        // console.log('Filter ', item.filter);
        updateSavedFilters(item?.filter);
        updateControlledFilter(item?.filter);
    }

    return (
        <div className="flex">
            {from !== "filters" && rows?.length > 0 && (
                <div className="ml-3">
                    <button
                        className="pulsebuttonwhite px-3 py-1 mr-1"
                        ref={refMore}
                        id="basic-button"
                        aria-controls={anchorListopen ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorListopen ? 'true' : undefined}
                        onClick={handleSettingIconClick}
                    >
                        {/* <FilterListIcon className="w-5 h-5" sx={{ fontSize: "16px" }} /> */}
                        <span className="text-sm">Saved Filter</span>
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
                        {rows.map((step, index) => (
                            <MenuItem key={index} onClick={() => handleOpenForm(step)}>
                                <span className="text-sm mt-[3px]">{step?.name}</span>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            )}
            <div className="ml-2">
                {savedFilters?.filterModel?.items?.length !== undefined && savedFilters?.filterModel?.items?.length !== 0 && (
                    <div className="mr-4 ml-3">
                        {isCreating ? (
                            <div className="mx-2 -mt-3">
                                <Dialog
                                    open={isCreating}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleClose}
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description">
                                            <div>
                                                <label htmlFor="filter" className="scaleformlabel mb-2">
                                                    Enter filter name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="filter"
                                                    value={filterName}
                                                    onChange={(e) => setFilterName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            createFilter();
                                                        }
                                                    }}
                                                    className={`scaleform border-gray-300`}
                                                />
                                            </div>
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <button onClick={handleClose}
                                            className="pulsebuttonwhite mr-3  min-w-[140px]"
                                        >
                                            <span>Cancel</span>
                                        </button>
                                        {filterName.length === 0 ? (
                                            <div
                                                className="pulsebuttonblue px-3 py-2 mr-1"
                                                style={{ opacity: 0.5, pointerEvents: 'none' }}
                                            >
                                                <span>Save</span>
                                            </div>
                                        ) :
                                            (
                                                <button
                                                    onClick={createFilter}
                                                    className="pulsebuttonblue min-w-[140px]"
                                                >
                                                    Save
                                                </button>
                                            )
                                        }
                                    </DialogActions>
                                </Dialog>
                            </div>
                        ) : (
                            <button
                                className="pulsebuttonwhite px-3 py-1 mr-1"
                                onClick={() => creatingFilter()}
                            >
                                <SaveIcon className="w-5 h-5" sx={{ fontSize: "16px" }} />
                                <span className="text-sm">Save Filter</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterForm;
