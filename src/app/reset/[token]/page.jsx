'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import useAppStore from '@/store/appStore';
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const baseURL = '/api/';

const Register = () => {
    const { data: session } = useSession();
    const buttonStyle = { margin: '28px 0' }
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(true);
    const router = useRouter();
    const { updateUserRole, updateOrganizationName } = useAppStore();
    const { updateUserId, updateUserEmail } = useAppStore();
    const currentPath = usePathname();
    const token = currentPath.split("/")[2];
    const [open, setOpen] = useState(false);
    const [state] = useState({
        vertical: 'top',
        horizontal: 'center',
        Transition: Fade,
    });
    const { vertical, horizontal } = state;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConformPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConformPasswordVisible(!confirmPasswordVisible);
    };
    const currentYear = new Date().getFullYear();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    useEffect(() => {
        if (session) {
            let user = session;
            updateUserId(user?.data?._id);
            updateUserEmail(user?.data?.email);
            updateUserRole(user?.data?.role);
            updateOrganizationName(user?.data?.organization);
            // console.log('User ', user);
            if (user?.data?.isOnboarded) {
                router.push('/scale/home');
            } else {
                router.push('/onboard');
            }
        }
    }, [session])


    const schema = yup.object().shape({
        password: yup.string().min(2).max(20).required('Please enter password'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], "password is not same")
    })

    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmitNew = (data) => {
        setIsLoading(true);
        // console.log(data);
        submitHandler(data);

    };

    const submitHandler = async (data) => {
        let posturl;
        posturl = baseURL + "auth/reset-password";

        const requestBody = {
            token: token,
            password: data.password,
        }

        await axios
            .post(posturl, requestBody)
            .then(function (res) {
                console.log('Forgot password ', res);
                setIsError(false);
                setMessage(res.data.message);
                setOpen(true);
                router.push('/')
            })
            .catch(function (error) {
                setIsLoading(false);
                setIsError(true);
                handleApiError(error);
            });

    }

    const handleApiError = (error) => {
        const errorMessage =
            error.status === 401 || error.status === 403 || error.status === 500
                ? error
                : "Sorry....the backend server is down!! Please try again later";

        if (error?.response?.data?.error) {
            setError('email', { type: 'custom', message: error.response.data.error });
        } else {
            setMessage(errorMessage);
            setOpen(true);
        }
        if (error?.response?.data?.message) {
            setMessage(error?.response?.data?.message);
            setOpen(true);
        }
        console.log(error);
    };

    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }} TransitionComponent={state.Transition}>
                    {isError === true ?
                        (
                            <Alert
                                onClose={handleClose}
                                severity="error"
                                sx={{
                                    width: "100%",
                                    minWidth: "400px",
                                    backgroundColor: "#fb7185",
                                    color: "black",
                                }}
                            >
                                {message}
                            </Alert>
                        )
                        :
                        (
                            <Alert
                                onClose={handleClose}
                                severity="success"
                                sx={{
                                    width: "100%",
                                    minWidth: "400px",
                                    backgroundColor: "#86efac",
                                    color: "black",
                                }}
                            >
                                {message}
                            </Alert>
                        )
                    }
                </Snackbar>
            </Stack >

            <Grid>
                <div className="bg-gray-50 min-h-screen">
                    <div className="flex items-center justify-center pt-[14vh]">
                        <div className="max-w-sm w-full p-6 bg-white rounded-md shadow-md">
                            <h2 className="text-2xl font-semibold text-center text-gray-800">Set new Password</h2>
                            <form onSubmit={handleSubmit(onSubmitNew)}>

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

                                <button
                                    type="submit"
                                    className={`w-full mb-4 mt-4 ${buttonStyle} ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'} text-white font-bold py-2 px-4 rounded`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="flex justify-center">
                                                Updating...
                                                <span className="ml-2">
                                                    <div role="status">
                                                        <svg ariaHidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                        </svg>
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </span>
                                            </div>
                                        </>
                                    ) : "Update password"}
                                </button>
                                <div className="mb-6">

                                </div>
                            </form>

                            <div>
                                <p className="text-[15px]">Back to
                                    <span className="text-blue-500 cursor-pointer" onClick={() => { router.push('/login'); }}> Sign in</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center items-center fixed bottom-0 w-full p-4">
                            <span className="text-slate-700 text-sm cursor-pointer">
                                &copy; Scale {currentYear}. All rights reserved.
                            </span>
                        </div>
                        <div className="flex justify-end fixed bottom-0 right-0 p-4 items-end space-y-3">
                            <div>
                                <span className="text-slate-700 text-sm cursor-pointer mr-3" onClick={() => {
                                    openInNewTab('/terms-of-service')
                                }}>
                                    Terms of Service
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-700 text-sm cursor-pointer mr-3" onClick={() => {
                                    openInNewTab('/privacy-policy')
                                }}>
                                    Privacy Policy
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-700 text-sm cursor-pointer mr-6" onClick={() => {
                                    openInNewTab('/cookie-policy')
                                }}>
                                    Cookie Policy
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Grid>
        </>

    ); // End of return block

}
export default Register;