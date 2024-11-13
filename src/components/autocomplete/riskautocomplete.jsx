import React, { useEffect, useRef, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import axios from "axios";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function RiskAutocomplete({ handleSeletedRecord }) {
    const baseURL = '/api/';
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { slug } = useSlug();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let posturl = baseURL + `risk?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setMembers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleRecordChange = (event, value) => {
        handleSeletedRecord(value)
        // handleSeletedRecord(value.map((option) => option.summary))
    };

    return (
        <div>
            {!loading && (
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={members}
                    disableCloseOnSelect
                    onChange={handleRecordChange}
                    size="small"
                    getOptionLabel={(option) => option.summary}
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
                                {option.summary}
                            </li>
                        );
                    }}
                    style={{ minWidth: 550 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Risk" placeholder="Risk" fontSize="small" size="small" />
                    )}
                />
            )}
        </div>
    );
}

