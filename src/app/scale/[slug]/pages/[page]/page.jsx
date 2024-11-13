"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";
import useAppStore from '@/store/appStore';
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { usePathname } from 'next/navigation';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import domtoimage from 'dom-to-image';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import { Tooltip } from '@mui/material';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const schema = yup.object().shape({
    name: yup.string().required('Please enter page name.'),
});

export default function Page() {
    const currentPath = usePathname();
    const searchParams = useSearchParams();
    const edit = searchParams.get('edit');
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uiloading, seUiLoading] = useState(true);
    const baseURL = '/api/';
    const { projectName, slug, key } = useSlug();
    const [isEditing, setIsEditing] = useState(edit === "true");
    const { updatePageList, userId, sessionData } = useAppStore();
    const [content, setContent] = useState("");
    const router = useRouter();
    const captureRef = useRef();
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

    const contentconfig = useMemo(
        () => ({
            readonly: false,
            placeholder: "Enter Content",
            minHeight: 370,
            showCharsCounter: true,
            showWordsCounter: true,
            buttons: [
                'paragraph',
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
                'ul',
                'ol',
                'fullsize',
                'brush',
                // 'outdent',
                // 'indent',
                // 'link',
                // 'hr',
                // 'print',
                // 'copyformat',
                // 'strikethrough',
                // 'eraser',
                // 'superscript',
                // 'subscript',
                // 'file',
                // 'video',
                // 'symbol',
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
            setValue("content", newContent);
        },
        [content]
    );


    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        seUiLoading(false);
    }, [uiloading]);


    const getData = async () => {
        const pageId = currentPath.split("/")[4];

        // console.log('pageId ', pageId);

        let posturl = baseURL + `page?id=${pageId}`;
        await axios
            .get(posturl)
            .then((res) => {
                setRows(res.data[0]);
                setContent(res?.data[0]?.content);
                setValue("name", res?.data[0]?.name);
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

    const onSubmit = async (data) => {
        Object.assign(data, { userId: userId });
        Object.assign(data, { projectSlug: slug });
        Object.assign(data, { projectName: projectName });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });

        try {
            const endpoint = baseURL + `page?id=${rows._id}`;
            let method;

            if (rows) {
                Object.assign(data, { _id: rows._id });
                Object.assign(data, { createdBy: sessionData.data.fullName });
                Object.assign(data, { slug: rows.slug });
                method = "put";
                const { data: responseData } = await axios[method](endpoint, data);
                // console.log('responseData ', responseData);
                // updatePageList(responseData);
                setRows(responseData[0]);
                setContent(responseData[0]?.content);
            } else {
                Object.assign(data, { createdBy: sessionData.data.fullName });
                method = "post";
                const { _id, ...newData } = data;
                const { data: responseData } = await axios[method](endpoint, newData);
                updatePageList(responseData);
                setRows(responseData[0]);
                setContent(responseData[0].content);
            }

            setIsEditing(false);

            const successMessage = rows ? 'Page updated successfully!' : 'Page added successfully!';
            toast.success(successMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: 'success',
                draggable: true,
                progress: undefined,
                theme: "light",
                style: {
                    width: '380px',
                },
            });
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleApiError = (error) => {
        const errorMessage =
            error.status === 401 || error.status === 403 || error.status === 500
                ? error
                : "Sorry....the backend server is down!! Please try again later";

        if (error?.response?.data?.error) {
            setError('summary', { type: 'custom', message: error.response.data.error });
        } else {
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
        }

        console.log(error);
    };

    const handleCaptureClick = () => {
        domtoimage.toPng(captureRef.current)
            .then(dataUrl => {
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = dataUrl;
                link.click();
            })
            .catch(error => {
                console.error('oops, something went wrong!', error);
                toast.error('An error occurred while generating the image. Please ensure all images are from the same URL and try again.', {
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
            });
    };

    const handleDownloadPDF = () => {
        const pdf = new jsPDF('p', 'pt', 'a2');
        pdf.html(captureRef.current, {
            callback: (doc) => {
                doc.save('document.pdf');
            },
            margin: [5, 5, 5, 5],
            x: 0,
            y: 0,
            html2canvas: {
                scale: 0.78, // Adjust the scale to fit content better
            },
            width: pdf.internal.pageSize.getWidth() - 4, // Adjust for margins
            windowWidth: captureRef.current.scrollWidth,
        });
    };

    const handleDownloadDOC = () => {
        const contentHtml = captureRef.current.innerHTML;

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph(contentHtml.replace(/<[^>]+>/g, '')),
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, "document.docx");
        });
    };

    return (
        <Layout>
            {!uiloading && (
                <>
                    <div className="overflow-x-hidden">
                        {rows === undefined ? (
                            <div className="flex justify-center p-4 min-h-[50vh] mt-32">
                                <div className="border-2 border-dashed border-gray-500 p-10 min-w-[66vw] rounded-lg">
                                    <div className="mt-24 flex justify-center">
                                        <div>
                                            <div className="text-md text-center mt-4 underline">
                                                No page found.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div>
                                <Breadcrumb page={rows.name} section="Pages" project={projectName} slug={slug} />
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex justify-between mt-20 -mb-10 max-w-[72vw] mx-14">
                                        <div>
                                            <div
                                                className="px-3 py-1 mr-1 text-blue-600 cursor-pointer"
                                                onClick={() => {
                                                    router.push("/scale/" + slug + "/pages");
                                                }}
                                            >
                                                <KeyboardBackspaceIcon className="w-5 h-5" />
                                                <span className="ml-2 mt-1">Go to pages directory</span>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div>
                                                {!isEditing && (
                                                    <div className="flex">
                                                        <Tooltip title="Download as PNG" arrow placement="bottom">
                                                            <div
                                                                className="hover:bg-slate-50 cursor-pointer bg-white mr-2 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2"
                                                                onClick={() => handleCaptureClick()}
                                                            >
                                                                <CameraAltIcon className="w-5 h-5" color="action" />

                                                            </div>
                                                        </Tooltip>
                                                        <Tooltip title="Download as PDF" arrow placement="bottom">
                                                            <div
                                                                className="hover:bg-slate-50 cursor-pointer bg-white mr-2 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2"
                                                                onClick={() => handleDownloadPDF()}
                                                            >
                                                                <PictureAsPdfIcon className="w-5 h-5" color="action" />
                                                            </div>
                                                        </Tooltip>
                                                        <Tooltip title="Download as DOC" arrow placement="bottom">
                                                            <div
                                                                className="hover:bg-slate-50 cursor-pointer bg-white mr-2 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2"
                                                                onClick={() => handleDownloadDOC()}
                                                            >
                                                                <ArticleIcon className="w-5 h-5" color="action" />
                                                            </div>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {isEditing ? (
                                                    <div className="flex">
                                                        <button onClick={() => setIsEditing(false)}
                                                            className="pulsebuttonwhite mr-3  min-w-[140px]"
                                                        >
                                                            <span>Cancel</span>
                                                        </button>
                                                        <button
                                                            className="pulsebuttonblue px-3 py-1 mr-1"
                                                            type="submit"
                                                        >
                                                            <SaveIcon className="w-5 h-5" />
                                                            <span>Save Page</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="pulsebuttonblue px-3 py-1 mr-1"
                                                        onClick={() => {
                                                            reset(rows ? rows : {})
                                                            setIsEditing(true)
                                                        }}
                                                    >
                                                        <EditIcon className="w-5 h-5" />
                                                        <span>Edit Page</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {!loading ? (
                                            <div className="mt-14">
                                                {isEditing ? (
                                                    <div>
                                                        <div className="rounded overflow-hidden max-w-[72vw] min-w-[72vw] mx-14">
                                                            <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                                                                <div className="sticky top-0 bg-slate-100 z-10">
                                                                    <div className="mb-4">
                                                                        <label htmlFor="Name" className="block text-sm text-gray-600 font-semibold">
                                                                            Page Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="name"
                                                                            name="name"
                                                                            {...register("name")}
                                                                            className={`scaleform ${errors["name"] ? 'border-red-500' : 'border-gray-300'}`}
                                                                        />
                                                                        {errors["name"] && (
                                                                            <p className="text-red-500 text-xs mt-1">{errors["name"].message}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="mb-4">
                                                                        <JoditEditor
                                                                            value={content}
                                                                            config={contentconfig}
                                                                            tabIndex={1}
                                                                            onBlur={(newContent) => { onContentBlur(newContent) }}
                                                                            name="content"
                                                                            rows="10"
                                                                            className={`scaleform ${errors["content"] ? 'border-red-500' : 'border-gray-300'}`}
                                                                        />
                                                                        {errors["content"] && (
                                                                            <p className="text-red-500 text-xs mt-1">{errors["content"].message}</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div ref={captureRef}>
                                                        {rows !== undefined && rows.name && (
                                                            <>
                                                                <div className="mt-10">
                                                                    <div className="p-4 mx-10 mb-10">
                                                                        <div className="mb-4">
                                                                            <label className="block text-[20px] font-medium text-gray-700 shadow-sm rounded-lg p-4 mb-3 bg-blue-100 max-w-[72vw]">
                                                                                {rows.name}
                                                                            </label>
                                                                            <div className="mt-1 text-justify shadow-sm rounded-lg p-4 bg-white max-w-[72vw] min-w-[72vw] overflow-hidden">
                                                                                {rows?.content ? (
                                                                                    <div className="p-1 min-h-[40vh]" dangerouslySetInnerHTML={{ __html: rows.content }} />
                                                                                ) : (
                                                                                    <div className="flex justify-center p-4 min-h-[50vh]">
                                                                                        <div className="border-2 border-dashed border-gray-500 p-10 min-w-[66vw] rounded-lg">
                                                                                            <div className="mt-24 flex justify-center">
                                                                                                <div>
                                                                                                    <div className="text-md text-center mt-4">
                                                                                                        No content available.
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="text-md text-center mt-1">
                                                                                                    Please click 'Edit Page' to add content.
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mt-10 max-w-[72vw] mx-14">
                                                <Skeleton className="mt-4" variant="rounded" width="100%" height={90} />
                                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                                <Skeleton className="mt-1" variant="rounded" width="100%" height={50} />
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                </>
            )
            }
        </Layout >
    );
}