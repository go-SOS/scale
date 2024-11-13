"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import useAppStore from '@/store/appStore';
import { format } from 'date-fns';
import { useSession } from "next-auth/react";
import EmojiPicker from 'emoji-picker-react';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { confirmAlert } from 'react-confirm-alert';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const schema = yup.object().shape({
    comment: yup.string().required('Please enter comment.'),
});

export default function Comments({ rows }) {
    const [content, setContent] = useState("");
    const [econtent, setEContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [conversation, setConversation] = useState([]);
    const { projectName, slug, key } = useSlug();
    const { userId, sessionData, updateIsWorkitemDrawer } = useAppStore();
    const baseURL = '/api/';
    const { data: session } = useSession();
    let dateFormat = session?.data?.dateFormat;
    const [showPicker, setShowPicker] = useState(null);
    const [isEdit, setIsEdit] = useState(null);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const togglePicker = (index) => {
        if (index === showPicker) {
            setShowPicker(null);
        } else {
            setShowPicker(index);
        }
    };

    const handleEmojiSelect = (id, emoji) => {
        // console.log('emoji', emoji);
        handleEdit(id, emoji?.emoji, '');
        setShowPicker(null);
    };
    const onEdit = async (index, comment) => {
        setIsEdit(index);
        setEContent(comment);
    }

    const handleEdit = async (id, emoji, comment) => {
        setLoading(true);
        try {
            let endpoint = baseURL + "comment?slug=" + slug + "&summaryId=" + rows?._id;
            let method;
            let data = {};

            method = "put";
            if (emoji) {
                Object.assign(data, { emoji: emoji });
            }
            if (comment) {
                Object.assign(data, { comment: comment });
            }
            Object.assign(data, { _id: id });
            Object.assign(data, { summaryId: rows?._id });

            const { data: responseData } = await axios[method](endpoint, data);
            // console.log('conversation ', responseData);
            setIsEdit(null);
            setConversation(responseData);
            setContent("");
            setValue("comment", "");
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    // const handleDelete = (id) => {
    //     updateIsWorkitemDrawer(false);
    //     setLoading(true);
    //     confirmAlert({
    //         title: 'Confirm to submit',
    //         message: 'are you sure to delete this comment?',
    //         buttons: [
    //             {
    //                 label: 'Yes',
    //                 onClick: () => deleteRow(id)
    //             },
    //             {
    //                 label: 'No',
    //             }
    //         ]
    //     });
    // };

    const deleteRow = (id) => {
        setLoading(true);
        let config = {
            method: 'delete',
            url: baseURL + "comment?slug=" + slug + "&summaryId=" + rows?._id,
            data: [id]
        };

        axios.request(config)
            .then(response => {
                console.log('conversation ', response.data);
                setConversation(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.log('Error ', err);

            })
    }

    useEffect(() => {
        // console.log('rows ', rows);
        if (rows?._id) {
            getData();
        }
    }, [rows])

    const getData = async () => {
        const id = rows?._id;

        let posturl = baseURL + "comment?slug=" + slug + "&summaryId=" + id;
        await axios
            .get(posturl)
            .then((res) => {
                // console.log('conversation ', res?.data);
                setConversation(res?.data);
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


    const contentconfig = useMemo(
        () => ({
            readonly: false,
            placeholder: "Add a comment",
            minHeight: 150,
            showCharsCounter: true,
            showWordsCounter: true,
            buttons: [
                'source',
                'bold',
                'italic',
                'underline',
                'font',
                'fontsize',
                'image',
                'table',
                'align',
                'undo',
                'redo',
                'fullsize',
                // 'strikethrough',
                // 'eraser',
                // 'superscript',
                // 'subscript',
                // 'ul',
                // 'ol',
                // 'outdent',
                // 'indent',
                // 'brush',
                // 'paragraph',
                // 'file',
                // 'video',
                // 'link',
                // 'copyformat',
                // 'hr',
                // 'symbol',
                // 'print',
                // 'about'
            ],
            toolbar: true,
            toolbarAdaptive: false,
            toolbarSticky: false,
            showCharsCounter: true,
            showWordsCounter: true,
            showXPathInStatusbar: false,
        }),
        []
    );

    const onContentBlur = useCallback(
        (newContent) => {
            setContent(newContent);
            setValue("comment", newContent);
        },
        [content]
    );

    const onEContentBlur = useCallback(
        (newContent) => {
            setEContent(newContent);
            // setValue("comment", newContent);
        },
        [econtent]
    );

    const onSubmit = async (data) => {
        Object.assign(data, { userId: userId });
        Object.assign(data, { summary: rows?.summary });
        Object.assign(data, { summaryId: rows?._id });
        Object.assign(data, { projectSlug: slug });
        Object.assign(data, { projectName: projectName });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });
        Object.assign(data, { fullName: sessionData.data.fullName });

        try {
            const id = rows?._id;
            const endpoint = baseURL + "comment?slug=" + slug + "&summaryId=" + id;
            let method;

            Object.assign(data, { createdBy: sessionData.data.fullName });
            method = "post";
            const { _id, ...newData } = data;
            const { data: responseData } = await axios[method](endpoint, newData);
            // console.log('conversation ', responseData);
            setConversation(responseData);
            setContent("");
            setValue("comment", "");

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <div className="flex justify-center mx-4 mb-10">
                <div>
                    <div className="text-semibold">
                        Comments
                    </div>
                    {!loading && conversation.length > 0 ? (
                        <div className="min-w-[550px] mt-4">
                            {conversation.map((comment, index) => (
                                <div key={index} className="mb-4">
                                    {isEdit === index ?
                                        (
                                            <div>
                                                <JoditEditor
                                                    value={econtent}
                                                    config={contentconfig}
                                                    tabIndex={1}
                                                    onBlur={(newContent) => { onEContentBlur(newContent) }}
                                                    name="comment"
                                                    rows="10"
                                                    className={`scaleform ${errors["content"] ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                <div className="flex">
                                                    <div
                                                        className="pulsebuttonblue px-3 py-1 mr-1 mt-2"
                                                        onClick={() => handleEdit(comment._id, '', econtent)}
                                                    >
                                                        <span>Update</span>
                                                    </div>
                                                    <div
                                                        className="pulsebuttonwhite px-3 py-1 mr-1 mt-2"
                                                        onClick={() => setIsEdit(null)}
                                                    >
                                                        <span>Cancel</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <div>
                                                <div className="bg-gray-100 p-4 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-semibold">{comment.fullName}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {format(new Date(comment.updatedAt), dateFormat)}
                                                        </div>
                                                    </div>
                                                    <div dangerouslySetInnerHTML={{ __html: comment.comment }} />
                                                </div>
                                                <div className="flex justify-between">
                                                    {/* <div className="relative mt-2 ml-2 cursor-pointer mb-2" onClick={() => togglePicker(index)}>
                                                        {comment.emoji ? (
                                                            <>
                                                                {comment.emoji}
                                                            </>
                                                        ) : (
                                                            <AddReactionOutlinedIcon fontSize="small" />
                                                        )}
                                                        {showPicker === index && (
                                                            <>
                                                                <EmojiPicker onEmojiClick={(emoji) => handleEmojiSelect(comment._id, emoji)} />
                                                            </>
                                                        )}
                                                    </div> */}
                                                    {session?.data.email === comment.commentedBy && (
                                                        <div className="flex justify-end space-x-4 mx-2">
                                                            {showPicker !== index && (
                                                                <div>
                                                                    <button
                                                                        className="text-sm hover:underline mr-3"
                                                                        onClick={() => onEdit(index, comment.comment)}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="hover:underline text-sm"
                                                                        onClick={() => deleteRow(comment._id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            ))
                            }
                        </div >
                    ) : (
                        <div className="min-w-[550px]">
                            <div className="mt-16 flex justify-center">
                                <div>
                                    <div className="text-md text-center mt-4 underline">
                                        No comments yet.
                                    </div>
                                </div>
                            </div>
                        </div >
                    )}
                    <div className="min-w-[550px]">
                        <div className="mt-16 flex justify-center">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <JoditEditor
                                    value={content}
                                    config={contentconfig}
                                    tabIndex={1}
                                    onBlur={(newContent) => { onContentBlur(newContent) }}
                                    name="comment"
                                    rows="10"
                                    className={`scaleform ${errors["content"] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <div className="flex">
                                    {/* <button onClick={() => setIsEditing(false)}
                            className="pulsebuttonwhite mr-3  min-w-[140px]"
                        >
                            <span>Cancel</span>
                        </button> */}
                                    <button
                                        className="pulsebuttonblue px-3 py-1 mr-1 mt-2"
                                        type="submit"
                                    >
                                        <span>Add</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}
