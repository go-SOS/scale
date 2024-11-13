import React, { useEffect, useRef, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import axios from "axios";
import useAppStore from '@/store/appStore';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function LabelAutocomplete({ handleSeletedRecord }) {
    const baseURL = '/api/';
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    const { slug } = useSlug();
    const { updateLabelList, labelList } = useAppStore();

    useEffect(() => {
        setLabels(labelList);
    }, [labelList]);

    useEffect(() => {
        getLabel();
    }, []);

    const getLabel = async () => {
        let posturl = baseURL + `label?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('labels ', res.data);
                setLabels(res?.data);
                updateLabelList(res?.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);

            });
    };

    const handleEmailChange = (event, value) => {
        handleSeletedRecord(value.map((option) => option.name))
    };

    return (
        <div>
            {!loading && (
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={labels}
                    disableCloseOnSelect
                    onChange={handleEmailChange}
                    size="small"
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;
                        return (
                            <li key={key} {...optionProps}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                    fontSize="small"
                                    size="small"
                                />
                                {option.name}
                            </li>
                        );
                    }}
                    style={{ minWidth: 550 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Labels" placeholder="Labels" fontSize="small" size="small" />
                    )}
                />
            )}
        </div>
    );
}

