"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import useAppStore from '@/store/appStore';
import gmail from "@/img/gmail.png";


export default function GoogleBtn({ user }) {
    const SCOPES = 'https://mail.google.com/';
    const [contacts, setContacts] = useState(null);
    const { updateGoogleAccessToken } = useAppStore();

    useEffect(() => {
        console.log('contacts ', contacts);
    }, [contacts])


    const handleLogin = useGoogleLogin({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Use environment variable for security
        onSuccess: (tokenResponse) => {
            console.log(tokenResponse);
            console.log(tokenResponse.access_token);
            updateGoogleAccessToken(tokenResponse.access_token)
        },
        onError: (error) => {
            console.error("Login Error:", error);
        },
        scope: SCOPES, // Request read/write calendar event scope
    });

    return (
        <>
            <div className="flex justify-center" onClick={() => handleLogin()}>
                <Image
                    src={gmail}
                    alt="Gmail"
                    width={24}
                    className="mr-2"
                />
                <div className="text-sm">
                    Gmail
                </div>
            </div>
        </>
    )
}
