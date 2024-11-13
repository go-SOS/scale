"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import CloseIcon from '@mui/icons-material/Close';
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import axios from "axios";


const ConfirmBox = ({ showConfirmPopup }) => {
    const baseURL = '/api/';
    const [disabled, setDisabled] = useState(false);
    const [textEntered, setTextEntered] = useState(false);
    const [orgName, setOrgName] = useState('');
    const { data: session } = useSession();

    // console.log('Session ', session?.data);

    const deleteAccount = () => {
        if (textEntered) {
            setDisabled(true);
            let config = {
                method: 'post',
                url: baseURL + `delete-account`,
            };

            axios.request(config)
                .then(response => {
                    console.log('Acconunt Delete ', response);
                    deleteCookie("logged");
                    signOut();
                })
                .catch(err => {
                    console.log('Error ', err);

                })
        }
    }

    const handleOrgNameChange = (event) => {
        // console.log('Session ', session?.data?.email);
        setOrgName(event.target.value);
        if (session?.data?.organization === event.target.value) {
            setTextEntered(true);
        } else {
            setTextEntered(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Delete Account ?</h2>
                    <button onClick={() => showConfirmPopup(false)} className="text-red-500">
                        <CloseIcon />
                    </button>
                </div>
                <div className="mt-4">
                    <p>This will permanently delete the &nbsp;
                        <span className="font-semibold">{session?.data?.organization}</span> organization details,
                        projects, team, work items and all data related to this organization.</p>
                </div>
                <div className="mt-4">
                    <p>This action cannot be undone.</p>
                </div>
                <div className="mb-5 mx-4 mt-4">
                    <label className="text-sm mb-1">
                        Type <span className="font-semibold">{session?.data?.organization}</span> below to confirm
                    </label>
                    <input
                        type="text"
                        value={orgName}
                        onChange={handleOrgNameChange}
                        className={`scaleform border-gray-300`}
                    />
                </div>

                <div className="mt-7 flex justify-end">
                    <div className="flex">
                        <button onClick={() => showConfirmPopup(false)}
                            className="pulsebuttonwhite mr-3  min-w-[140px]"
                        >
                            <span>Cancel</span>
                        </button>
                        {disabled ? (
                            <div
                                className="pulsebuttonred px-3 py-2 mr-1"
                                style={{ opacity: 0.5, pointerEvents: 'none' }}
                            >
                                <span>  I understand, Delete this account</span>
                                <span className="mb-1 -mr-4">
                                    <svg ariaHidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                </span>

                            </div>
                        ) :
                            (
                                <button
                                    onClick={() => deleteAccount()}
                                    className={`pulsebuttonred ${textEntered ? '' : 'opacity-35'}`}
                                >
                                    I understand, Delete this account
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBox;
