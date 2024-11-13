"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";
import useAppStore from '@/store/appStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next-nprogress-bar';
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import useMyStopwatch from '@/components/timer/timerUtils';
import { subSeconds } from 'date-fns';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


const schema = yup.object().shape({
    summary: yup.string().required('Please enter summary.'),
    startDate: yup.date(),
    dueDate: yup
        .date()
        .min(yup.ref('startDate'), 'Due Date should be greater'),
});

const NewTimer = () => {
    const baseURL = '/api/';
    const { sessionData, userId, updateIsTimer, updateTimerList, updateTotalTime, totalTime, updateTimerRunning, timerRunning } = useAppStore();
    const { projectName, slug, key } = useSlug();
    const [uiloading, seUiLoading] = useState(true);
    const [isReadyToSave, setIsReadyToSave] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();
    const {
        seconds,
        minutes,
        hours,
        isRunning,
        pause,
        handleStart,
        handleReset,
    } = useMyStopwatch();

    useEffect(() => {
        seUiLoading(false);
    }, [uiloading]);


    const formatSeconds = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const remainingSecondsAfterHours = seconds % 3600;
        const minutes = Math.floor(remainingSecondsAfterHours / 60);
        const remainingSeconds = remainingSecondsAfterHours % 60;

        const hoursText = hours > 0 ? `${hours} Hour${hours !== 1 ? 's' : ''} ` : '';
        const minutesText = minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''} ` : '';
        const secondsText = remainingSeconds > 0 ? `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}` : '';

        return `${hoursText}${minutesText}${secondsText}`.trim();
    };

    const onSubmit = async (data) => {
        setDisabled(true);
        // console.log('totalTime ', totalTime);

        const timerStartTime = subSeconds(new Date(), totalTime);
        let startTime = new Date(timerStartTime);
        let endTime = new Date();

        Object.assign(data, { startTime: startTime });
        Object.assign(data, { endTime: endTime });
        Object.assign(data, { totalTime: formatSeconds(totalTime) });

        Object.assign(data, { userId: userId });
        Object.assign(data, { projectSlug: slug });
        // Object.assign(data, { projectName: projectName });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });

        try {
            const endpoint = baseURL + `timer?slug=${slug}`;
            let method;

            Object.assign(data, { createdBy: sessionData.data.fullName });
            method = "post";
            const { _id, ...newData } = data;
            const { data: responseData } = await axios[method](endpoint, newData);
            updateTimerList(responseData);
            updateTotalTime(0);
            const successMessage = 'Timer details added successfully!';
            toast.success(successMessage, {
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
            handleStopTimer();
            router.push("/scale/" + slug + "/timer");
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

    const handleStartTimer = () => {
        updateTimerRunning(true);
        handleStart();
        updateIsTimer(true);
    };

    const handlePauseTimer = () => {
        updateTimerRunning(false);
        pause();
    };

    const handleStopTimer = () => {
        updateTotalTime(0);
        handleReset();
        updateIsTimer(false);
        updateTimerRunning(false);
    };

    useEffect(() => {
        // console.log('isRunning ', timerRunning);
        if (timerRunning) {
            handleStart();
        } else {
            pause();
        }
    }, [timerRunning])

    useEffect(() => {
        // console.log('isRunning totalTime ', totalTime);
        if (totalTime > 1) {
            setIsReadyToSave(true);
        } else {
            setIsReadyToSave(false);
        }
    }, [totalTime])

    return (
        <Layout>
            {!uiloading && (
                <>
                    <Breadcrumb page="Timer" project={projectName} />
                    <div className="rounded overflow-hidden mt-16">
                        <div className="max-w-[72vw]">
                            <div className="hover:bg-blue-100 hover:rounded-md max-w-[50px]">
                                <div
                                    className="px-3 py-1 mr-1 text-blue-600 cursor-pointer"
                                    onClick={() => {
                                        router.push("/scale/" + slug + "/timer");
                                    }}
                                >
                                    <KeyboardBackspaceIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <div className="ml-3 flex justify-center mt-5">
                                    <label htmlFor="summary" className="block text-sm text-gray-600 font-semibold mt-2 mr-2">
                                        Summary
                                    </label>
                                    <div>
                                        <input
                                            type="text"
                                            id="summary"
                                            name="summary"
                                            {...register("summary")}
                                            className={`scaleform max-w-[32vw] min-w-[32vw] ${errors["summary"] ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors["summary"] && (
                                            <p className="text-red-500 text-xs mt-1">{errors["summary"].message}</p>
                                        )}
                                    </div>
                                    <div className="bg-slate-100 min-h-[60px] ml-7 mt-[5px]">
                                        <div>
                                            {disabled ? (
                                                <div
                                                    className="pulsebuttonblue px-3 py-2 mr-1"
                                                    style={{ opacity: 0.5, pointerEvents: 'none', minWidth: "180px" }}
                                                >
                                                    <span>Stop and Save</span>
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
                                                        type="submit"
                                                        style={{ minWidth: "180px" }}
                                                        className={`pulsebuttonblue min-w-[140px] ${isReadyToSave ? '' : 'opacity-50 pointer-events-none'}`}
                                                    >
                                                        <StopIcon className="w-5 h-5" />
                                                        Stop and Save
                                                    </button>
                                                )
                                            }

                                        </div >
                                    </div>
                                </div>

                            </div>
                        </form >
                    </div >
                    <div>
                        <div className="flex justify-center mt-10">
                            <div className="text-center p-10 rounded-lg border-slate-500 border">
                                <div className="text-6xl font-bold text-slate-700">
                                    <span>{String(hours).padStart(2, '0')}</span>:
                                    <span>{String(minutes).padStart(2, '0')}</span>:
                                    <span>{String(seconds).padStart(2, '0')}</span>
                                </div>
                                <div className="mt-5 space-x-4 flex">
                                    {isRunning ? (
                                        <button onClick={() => handlePauseTimer()}
                                            className="pulsebuttonwhite mx-3  min-w-[140px]"
                                        >
                                            <PauseIcon className="w-5 h-5" />
                                            <span>Pause</span>
                                        </button>
                                    ) : (
                                        <button onClick={() => handleStartTimer()}
                                            className="pulsebuttonwhite mx-3  min-w-[140px]"
                                        >
                                            <PlayArrowIcon className="w-5 h-5" />
                                            {totalTime ? (
                                                <span>Resume</span>
                                            ) : (
                                                <span>Start</span>
                                            )}
                                        </button>
                                    )}
                                    <button onClick={() => handleStopTimer()}
                                        className="pulseresetbutton mx-3  min-w-[140px]"
                                    >
                                        <RestartAltIcon className="w-5 h-5" />
                                        <span>Reset</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default NewTimer;
