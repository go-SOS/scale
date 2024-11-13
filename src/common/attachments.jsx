"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import axios from "axios";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import useAppStore from '@/store/appStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import { useSession } from "next-auth/react";
import CancelIcon from '@mui/icons-material/Cancel';

export default function Attachments({ rows }) {
    const baseURL = '/api/';
    const hiddenFileInput = useRef(null);
    const { projectName, slug, key } = useSlug();
    const [disabled, setDisabled] = useState(false);
    const { data: session } = useSession();
    const { updateAttachmentList, attachmentList, userId } = useAppStore();
    const [attachs, setAttachs] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log('attachmentList ', attachmentList);
        getData();
    }, [])

    const handleDelete = async (imgid) => {
        const id = rows?._id;
        let posturl = baseURL + "attachment?slug=" + slug + "&summaryId=" + id;
        let config = {
            method: 'delete',
            url: posturl,
            data: [imgid]
        };

        axios.request(config)
            .then(response => {
                setAttachs(response);
                console.log('response ', err);
            })
            .catch(err => {
                console.error('Error ', err);

            })
    };

    const getData = async () => {
        const id = rows?._id;
        let posturl = baseURL + "attachment?slug=" + slug + "&summaryId=" + id;
        await axios
            .get(posturl)
            .then((res) => {
                setAttachs(res?.data);
                setLoading(false);
                console.log('attachmentList ', res?.data);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };


    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleClick = (event) => {
        const msg = "Coming soon: This feature is on its way!"
        toast.info(msg, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'success',
            progress: undefined,
            theme: "light",
            style: {
                width: '380px',
            },
        });
    };

    // const handleClick = (event) => {
    //     hiddenFileInput.current.click();
    // };

    const handleFileUpload = async (file) => {
        setDisabled(true);
        let data = {};
        let method = "post";
        const id = rows?._id;
        let endpoint = baseURL + "attachment?slug=" + slug + "&summaryId=" + id;
        Object.assign(data, { summary: rows?.summary });
        Object.assign(data, { summaryId: rows?._id });
        Object.assign(data, { userId: userId });
        Object.assign(data, { projectSlug: slug });
        Object.assign(data, { projectName: projectName });
        Object.assign(data, { lastModifiedBy: session.data.email });
        Object.assign(data, { uploadedBy: session.data.email });
        if (file) {
            Object.assign(data, { file: file });
            Object.assign(data, { fileName: file.name });
            Object.assign(data, { fileType: file.type });
            method = "post";
            const { data: responseData } = await axios({
                method: method,
                url: endpoint,
                data: data,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateAttachmentList(responseData);
            setAttachs(responseData);
            setDisabled(false);
        }
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            await handleFileUpload(file);
        }
    };

    return (
        <div>
            {!loading && (
                <div>
                    <div
                        onClick={handleClick}
                        className="flex justify-center cursor-pointer mx-3 mb-1"
                    // onDragOver={handleDragOver}
                    // onDrop={handleDrop}
                    >
                        <div className="border-2 border-blue-500 border-dashed rounded-lg p-4 bg-blue-50">
                            <div>
                                <div className="flex justify-center">
                                    <CloudUploadIcon color="action" fontSize="large" />
                                    {/* <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e.target.files[0])}
                                        className="mb-6 border p-2"
                                        ref={hiddenFileInput}
                                        style={{ display: "none" }}
                                    /> */}
                                </div>
                                <p className="text-gray-500 text-md mx-10 mt-3 text-center">
                                    <span className="text-blue-700">
                                        Drag or click to upload
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center">
                        {attachs.length > 0 && attachs.map((image, index) => (
                            <div key={index} className="relative m-2">
                                <Image
                                    src={image?.documentLink}
                                    alt="Attachment"
                                    width={100}
                                    height={120}
                                    className="rounded-lg shadow-sm"
                                />
                                <button
                                    className="absolute top-0 right-0 p-1"
                                    onClick={() => handleDelete(image?._id)}
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
