"use client";
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import useAppStore from "@/store/appStore";
import { toast } from 'react-toastify';
import axios from "axios";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Divider from '@mui/material/Divider';

const SetupMail = () => {
    const baseURL = '/api/';
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [imapServer, setImapServer] = useState('');
    const [smtpServer, setSmtpServer] = useState('');
    const [imapPort, setImapPort] = useState('993');
    const [smtpPortLocal, setSmtpPort] = useState('465');
    const [securityMode, setSecurityMode] = useState('SSL');
    const [isDisabled, setIsDisabled] = useState(true);
    const [isAvailable, setIsAvailable] = useState(false);
    const disabledClassName = isDisabled ? "pulsebuttonblueDisabled" : "pulsebuttonblue";
    const { updateMailSetupDrawer, userId } = useAppStore();
    const { updateMailEmail, updateMailPassword, updateMailUser, updateSmtpPort } = useAppStore();
    const { updateSmtpHost, updateImapHost, updateImapPort, updateMailSecurityMode } = useAppStore();
    const { smtpHost, smtpPort, mailUser, mailPassword, mailEmail, mailSecurityMode } = useAppStore();


    useEffect(() => {
        if (smtpHost && smtpPort && mailUser && mailPassword && mailEmail) {
            setUsername(mailUser);
            setEmail(mailEmail);
            setPassword(mailPassword);
            setSmtpServer(smtpHost);
            setSmtpPort(smtpPort);
            setSecurityMode(mailSecurityMode);
            setIsAvailable(true);
        } else {
            setIsAvailable(false);
        }
    }, [])

    useEffect(() => {
        if (username && password && smtpServer) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [username, password, smtpServer])

    const handleSave = async () => {
        let data = {
            _id: userId,
            mailEmail: email,
            mailUsername: username,
            mailPassword: password,
            imapServer: imapServer,
            imapPort: imapPort,
            smtpServer: smtpServer,
            smtpPort: smtpPortLocal,
            securityMode: securityMode,
        };

        const method = "put";
        console.log('data ', data);

        try {
            const endpoint = baseURL + "users";
            const { data: responseData } = await axios[method](endpoint, data);
            const successMessage = 'Email setup updated successfully!';
            toast.success(successMessage, {
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
            updateMailEmail(email);
            updateMailPassword(password);
            updateMailUser(username);
            updateSmtpPort(smtpPortLocal);
            updateSmtpHost(smtpServer);
            updateImapHost(imapServer);
            updateImapPort(imapPort);
            updateMailSecurityMode(securityMode);
            updateMailSetupDrawer(false);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleApiError = (error) => {
        const errorMessage =
            error.status === 401 || error.status === 403 || error.status === 500
                ? error
                : "Sorry....the backend server is down!! Please try again later";

        toast.error(errorMessage, {
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

        console.log(error);
    };


    return (
        <>
            <div className="min-w-[100%] mx-auto mt-4 p-6">
                {isAvailable ? (<>
                    <div className="shadow-md rounded-lg bg-white my-2 py-2">
                        <div className="flex my-1 ml-10">
                            <div className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                Email:
                            </div>
                            <div className="min-w-[110px] mr-4 block text-sm text-gray-600 text-left">
                                {email}
                            </div>
                        </div>
                        <div className="flex my-1 ml-10">
                            <div className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                Username:
                            </div>
                            <div className="min-w-[110px] mr-4 block text-sm text-gray-600 text-left">
                                {username}
                            </div>
                        </div>
                        <div className="flex my-1 ml-10">
                            <div className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                Password:
                            </div>
                            <div className="min-w-[110px] mr-4 block text-sm text-gray-600 text-left">
                                {password}
                            </div>
                        </div>
                    </div>
                    <div className="shadow-md rounded-lg bg-white my-2 py-2">
                        <div className="mt-10 mb-5 text-center">
                            INCOMING MAIL SERVER
                            <Divider variant="middle" component="div" className="mt-1" />
                        </div>
                        <div className="flex my-1 ml-10">
                            <div className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                IMAP Server:
                            </div>
                            <div className="min-w-[110px] mr-4 block text-sm text-gray-600 text-left">
                                {imapServer}
                            </div>
                        </div>
                        <div className="flex my-1 ml-10">
                            <div className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                IMAP Port:
                            </div>
                            <div className="min-w-[110px] mr-4 block text-sm text-gray-600 text-left">
                                {imapPort}
                            </div>
                        </div>
                    </div>
                    <div className="shadow-md rounded-lg bg-white my-2 py-2">
                        <div className="mt-10 mb-5 text-center">
                            OUTGOING MAIL SERVER
                            <Divider variant="middle" component="div" className="mt-1" />
                        </div>
                        <div className="flex my-1 ml-10">
                            <div className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                SMTP Server:
                            </div>
                            <div className="min-w-[110px] mr-4 block text-sm text-gray-600 text-left">
                                {smtpServer}
                            </div>
                        </div>
                        <div className="flex my-1 ml-10">
                            <div className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                SMTP Port:
                            </div>
                            <div className="min-w-[110px] mr-4 block text-sm text-gray-600 text-left">
                                {smtpPortLocal}
                            </div>
                        </div>
                        <div className="flex my-1 ml-10">
                            <div className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                Security Mode:
                            </div>
                            <div className="min-w-[110px] mr-4 block text-sm text-gray-600 text-left">
                                {securityMode}
                            </div>
                        </div>
                    </div>
                </>) : (
                    <div>
                        <div className="mb-2 flex items-center">
                            <label className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">Email<span className="text-red-500 ml-1 text-md">*</span></label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-2 flex items-center">
                            <label className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">Username<span className="text-red-500 ml-1 text-md">*</span></label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4 flex items-center text-right">
                            <label className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">Password<span className="text-red-500 ml-1 text-md">*</span></label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>

                        <div className="mt-10 mb-5">
                            INCOMING MAIL SERVER
                        </div>
                        <div>
                            <div className="mb-2 flex items-center">
                                <label className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                    IMAP Server
                                    {/* <span className="text-red-500 ml-1 text-md">*</span> */}
                                </label>
                                <input
                                    type="text"
                                    value={imapServer}
                                    onChange={(e) => setImapServer(e.target.value)}
                                    className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div className="mb-2 flex items-center">
                                <label className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                    IMAP Port
                                    {/* <span className="text-red-500 ml-1 text-md">*</span> */}
                                </label>
                                <input
                                    type="number"
                                    value={imapPort}
                                    onChange={(e) => setImapPort(e.target.value)}
                                    className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                        </div>

                        <div className="mt-10 mb-5">
                            OUTGOING MAIL SERVER
                        </div>
                        <div>
                            <div className="mb-2 flex items-center">
                                <label className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">SMTP Server<span className="text-red-500 ml-1 text-md">*</span></label>
                                {isAvailable ? (
                                    <div>
                                        <span>
                                            {smtpServer}
                                        </span>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={smtpServer}
                                        onChange={(e) => setSmtpServer(e.target.value)}
                                        className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                    />
                                )}
                            </div>
                            <div className="mb-2 flex items-center">
                                <label className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">SMTP Port<span className="text-red-500 ml-1 text-md">*</span></label>
                                <input
                                    type="number"
                                    value={smtpPortLocal}
                                    onChange={(e) => setSmtpPort(e.target.value)}
                                    className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div className="mb-2 flex items-center">
                                <label htmlFor="Security Mode" className="min-w-[110px] mr-4 block text-sm font-semibold text-gray-600 text-right">
                                    Security Mode
                                    <span className="text-red-500 ml-1 text-md">*</span>
                                </label>
                                <select
                                    id={securityMode}
                                    name={securityMode}
                                    onChange={(e) => setSecurityMode(e.target.value)}
                                    className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    <option value="None">None</option>
                                    <option value="SSL">SSL</option>
                                    <option value="TSL">TSL</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}



                <div className="absolute bottom-4 left-6 right-0 mb-6 flex justify-between">
                    <div className="flex justify-start">
                        {isAvailable ? (
                            <>
                                <button
                                    className="pulsebuttonblue px-3 py-1 mr-1"
                                    onClick={() => setIsAvailable(false)}
                                    disabled={isDisabled}
                                >
                                    <span>Edit</span>
                                </button>
                                <button
                                    className="pulsebuttonwhite px-3 py-1 mr-1"
                                    onClick={() => { updateMailSetupDrawer(false) }}
                                >
                                    <span>Close</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className={`${disabledClassName} px-3 py-1 mr-1`}
                                    onClick={handleSave}
                                    disabled={isDisabled}
                                >
                                    <span>Save</span>
                                </button>
                                <button
                                    className="pulsebuttonwhite px-3 py-1 mr-1"
                                    onClick={() => { updateMailSetupDrawer(false) }}
                                >
                                    <span>Cancel</span>
                                </button>
                            </>
                        )}

                    </div>
                </div >
            </div >
        </>

    );
};

export default SetupMail;
