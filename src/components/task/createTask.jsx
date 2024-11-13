"use client";
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import useAppStore from "@/store/appStore";
import { toast } from 'react-toastify';
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    taskTitle: yup.string().required('Please enter title'),
    taskDueDate: yup.string().required('Please enter due date'),
    description: yup.string(),
});

const CreateTask = ({ rows }) => {
    const baseURL = '/api/';
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState(null);
    const { updateIsTaskDrawer, userId, updateTaskData, sessionData, formData } = useAppStore();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        // console.log('formData ', rows);
        setId(rows ? rows._id : null);
        reset(rows ? rows : {});
    }, [rows]);


    const onSubmit = async (data) => {
        setDisabled(true);
        setIsLoading(true);
        Object.assign(data, id && { _id: id });
        Object.assign(data, { userId: userId });
        Object.assign(data, { leadId: formData._id });
        Object.assign(data, { updatedAt: Date.now() });
        Object.assign(data, { lastModifiedBy: sessionData.data.email });
        Object.assign(data, { taskOwner: sessionData.data.email });
        console.log(data);

        try {
            const endpoint = baseURL + "tasks";
            const method = rows ? "put" : "post";
            const { data: responseData } = await axios[method](endpoint, data);
            updateTaskData(responseData);
            const successMessage = rows ? 'Task modified successfully!' : 'Task added successfully!';
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
            updateIsTaskDrawer(false);
            setIsLoading(false);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleApiError = (error) => {
        setIsLoading(false);
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

    const handleDelete = () => {
        updateIsTaskDrawer(false);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'are you sure to delete this task?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteRow()
                },
                {
                    label: 'No',
                }
            ],
        });
    };

    const deleteRow = () => {
        let config = {
            method: 'delete',
            url: baseURL + 'tasks',
            data: [rows._id]
        };

        axios.request(config)
            .then(response => {
                toast.success('Task deleted successfully!', {
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
                console.log('del res ', response.data);
                let resdata = response.data;
                updateTaskData(resdata);
            })
            .catch(err => {
                console.log('Error ', err);
                toast.error(err, {
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
            })
    }


    return (
        <>
            <div className="rounded overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="mx-16 mt-8">
                    <div className="min-w-[450px] mb-4">
                        <label htmlFor="taskTitle" className="block text-sm text-gray-600 font-semibold">
                            Title <span className="text-red-500 text-md">*</span>
                        </label>
                        <input
                            type="text"
                            id="taskTitle"
                            name="taskTitle"
                            {...register("taskTitle")}
                            className={`mt-1 p-1 border ${errors?.taskTitle ? 'border-red-500' : 'border-gray-300'
                                } w-full rounded-md focus:border-blue-500 focus:outline-none`}
                        />
                        {errors?.taskTitle && (
                            <p className="text-red-500 text-xs mt-1">{errors.taskTitle?.message}</p>
                        )}
                    </div>

                    <div className="min-w-[450px] mb-4">
                        <div className="flex justify-between">
                            <div className="min-w-[48%]">
                                <label htmlFor="taskType" className="block text-sm font-semibold text-gray-600">
                                    Task Type
                                </label>
                                <select
                                    id="taskType"
                                    name="taskType"
                                    {...register("taskType")}
                                    className={`mt-1 p-2 border border-gray-300 w-full rounded-md focus:border-blue-500 focus:outline-none`}
                                >
                                    <option value=""></option>
                                    <option value="Follow up">
                                        Follow up
                                    </option>
                                    <option value="Call reminder">
                                        Call reminder
                                    </option>
                                </select>
                            </div>
                            <div className="min-w-[48%]">
                                <label htmlFor="taskOutcome" className="block text-sm font-semibold text-gray-600">
                                    Outcome
                                </label>
                                <select
                                    id="taskOutcome"
                                    name="taskOutcome"
                                    {...register("taskOutcome")}
                                    className={`mt-1 p-2 border border-gray-300 w-full rounded-md focus:border-blue-500 focus:outline-none`}
                                >
                                    <option value=""></option>
                                    <option value="Interested">
                                        Interested
                                    </option>
                                    <option value="Left message">
                                        Left message
                                    </option>
                                    <option value="No response">
                                        No response
                                    </option>
                                    <option value="Not interested">
                                        Not interested
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-[450px] mb-4">
                        <div className="flex justify-between">
                            <div className="min-w-[48%]">
                                <label htmlFor="taskDueDate" className="block text-sm text-gray-600 font-semibold">
                                    Due Date <span className="text-red-500 text-md">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="taskDueDate"
                                    name="taskDueDate"
                                    {...register("taskDueDate")}
                                    className={`mt-1 p-1 border ${errors?.taskDueDate ? 'border-red-500' : 'border-gray-300'
                                        } w-full rounded-md focus:border-blue-500 focus:outline-none`}
                                />
                                {errors?.taskDueDate && (
                                    <p className="text-red-500 text-xs mt-1">{errors.taskDueDate?.message}</p>
                                )}
                            </div>
                            <div className="min-w-[48%]">
                                <label htmlFor="taskTime" className="block text-sm text-gray-600 font-semibold">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    id="taskTime"
                                    name="taskTime"
                                    {...register("taskTime")}
                                    className={`mt-1 p-1 border ${errors?.taskTime ? 'border-red-500' : 'border-gray-300'
                                        } w-full rounded-md focus:border-blue-500 focus:outline-none`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="min-w-[450px] mb-4">
                        <label htmlFor="description" className="block text-sm text-gray-600 font-semibold">
                            Description
                        </label>

                        <textarea
                            rows={3}
                            id="description"
                            name="description"
                            {...register("description")}
                            className="w-full p-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Task description..."
                        />
                    </div>


                    <div className="min-w-[450px] mb-4">
                        <label htmlFor="taskOwner" className="block text-sm text-gray-600 font-semibold">
                            Task Owner
                        </label>
                        <select
                            id="taskOwner"
                            disabled
                            name="taskOwner"
                            {...register("taskOwner")}
                            className={`mt-1 p-2 border border-gray-300 w-full rounded-md focus:border-blue-500 focus:outline-none`}
                        >
                            <option value={sessionData.data.email}>{sessionData.data.email}</option>
                        </select>
                    </div>

                    <div className="absolute bottom-4 left-6 right-0 mb-6 flex justify-between">
                        <div className="flex justify-start">
                            {disabled ? (
                                <div
                                    className="pulsebuttonblue px-3 py-2 mr-1"
                                    style={{ opacity: 0.5, pointerEvents: 'none' }}
                                >
                                    <span>Save</span>
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
                                        className="pulsebuttonblue min-w-[140px]"
                                    >
                                        Save
                                    </button>
                                )
                            }
                            <button
                                className="pulsebuttonwhite px-3 py-1 mr-1"
                                onClick={() => updateIsTaskDrawer(false)}
                            >
                                <span>Cancel</span>
                            </button>
                        </div>
                        {rows && (
                            <div className="mr-10 mt-2 cursor-pointer" onClick={() => handleDelete()}>
                                <DeleteOutlineRoundedIcon sx={{ fontSize: "20" }} />
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>

    );
};

export default CreateTask;
