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

export default function SendTo({ handleSetTo }) {
    const baseURL = '/api/';
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const { slug } = useSlug();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let posturl = baseURL + `assignee?slug=${slug}`;
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

    const handleEmailChange = (event, value) => {
        setSelectedEmails(value.map((option) => option.email));
        handleSetTo(value.map((option) => option.email))
    };

    return (
        <div>
            {!loading && (
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={members}
                    disableCloseOnSelect
                    onChange={handleEmailChange}
                    size="small"
                    getOptionLabel={(option) => option.fullName}
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
                                {option.fullName}
                            </li>
                        );
                    }}
                    style={{ minWidth: 250 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Team" placeholder="Email" fontSize="small" size="small" />
                    )}
                />
            )}
        </div>
    );
}

