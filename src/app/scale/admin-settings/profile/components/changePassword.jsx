import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";
import useAppStore from '@/store/appStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@mui/material/Divider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';


const schema = yup.object().shape({
    password: yup.string().min(2).max(20).required('Please enter password'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], "password is not same")
});

const ChangePassword = () => {
    const baseURL = '/api/';
    const { updateIsPasswordDrawer, sessionData, userId, updateUser } = useAppStore();
    const [loading, setLoading] = useState(true);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [disabled, setDisabled] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConformPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConformPasswordVisible(!confirmPasswordVisible);
    };

    useEffect(() => {
        setLoading(false);
    }, [])



    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            const endpoint = baseURL + `password`;
            let method = "put";
            const { data: responseData } = await axios[method](endpoint, data);
            console.log('responseData ', responseData[0]);
            updateUser(responseData[0]);
            const successMessage = 'Password updated successfully!';
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
            updateIsPasswordDrawer(false);
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


    return (
        <>
            <div className="rounded overflow-hidden">
                <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="sticky top-0 bg-slate-100 z-10">
                            <div>
                                <IconButton onClick={() => { updateIsPasswordDrawer(false) }} edge="start" color="inherit" aria-label="close">
                                    <CloseRoundedIcon className="ml-4" />
                                </IconButton>
                            </div>
                            <div className="flex justify-center text-lg font-semibold -mt-5">
                                Update Password
                            </div>
                            <Divider />
                        </div>
                      <div className="flex justify-center mt-4 min-h-[86vh]">
                            <div className="max-w-[550px] min-w-[550px]">
                                {!loading ? (
                                    <div>
                                        <div className="mb-4 mt-10">
                                            <label htmlFor="password" className="scaleformlabel">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="hs-toggle-password"
                                                    type={passwordVisible ? 'text' : 'password'}
                                                    className={`scaleform ${errors?.password ? 'border-red-500' : 'border-gray-300'}`}
                                                    {...register("password")}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute top-0 end-0 p-3.5 rounded-e-md"
                                                >
                                                    <svg
                                                        className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        {!passwordVisible ? (
                                                            <>
                                                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                                                <line x1="2" x2="22" y1="2" y2="22"></line>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                                                <circle cx="12" cy="12" r="3"></circle>
                                                            </>
                                                        )}
                                                    </svg>
                                                </button>
                                            </div>
                                            {errors?.password && (
                                                <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="scaleformlabel">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="hs-toggle-password"
                                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                                    className={`scaleform ${errors?.password ? 'border-red-500' : 'border-gray-300'}`}
                                                    {...register("confirmPassword")}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={toggleConfirmPasswordVisibility}
                                                    className="absolute top-0 end-0 p-3.5 rounded-e-md"
                                                >
                                                    <svg
                                                        className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        {!confirmPasswordVisible ? (
                                                            <>
                                                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                                                <line x1="2" x2="22" y1="2" y2="22"></line>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                                                <circle cx="12" cy="12" r="3"></circle>
                                                            </>
                                                        )}
                                                    </svg>
                                                </button>
                                            </div>
                                            {errors?.confirmPassword && (
                                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                                        <svg ariaHidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-slate-100 z-10 min-h-[60px]">
                            <Divider />
                            <div className="mt-3 mb-3">
                                <div className="flex justify-end mr-4">
                                    <div>
                                        <div className="flex">
                                            <div onClick={() => updateIsPasswordDrawer(false)}
                                                className="pulsebuttonwhite mr-3  min-w-[140px]"
                                            >
                                                <span>Cancel</span>
                                            </div>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div >
            </div>
        </>
    );
};

export default ChangePassword;
