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
import timeZones from "@/common/util/timezones";
import dateFormats from "@/common/util/dateFormats";
import { setCookie } from "cookies-next";
import { signIn, useSession, signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const schema = yup.object().shape({
    fullName: yup.string().min(3).required('Please enter name'),
    organization: yup.string().min(3).required('Please enter organization name'),
    dateFormat: yup.string().min(3).required('Please select date format'),
    timeZone: yup.string().min(3).required('Please select time zone'),
    userRole: yup.string().required('Please select a role'),
    domainExpertise: yup.string().required('Please select domain expertise'),
    companySize: yup.string().required('Please select company size'),
})

const Register = () => {
    const baseURL = '/api/';
    const buttonStyle = { margin: '28px 0' }
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(true);
    const [isShowNext, setIsShowNext] = useState(false);
    const router = useRouter();
    const { updateOrganizationName, updateSelectedMenu } = useAppStore();
    const { userEmail, onboardData, updateOnboardData } = useAppStore();
    const { data: session } = useSession();
    const [fullName, setFullName] = useState('');
    const [organization, setOrganization] = useState('');
    const [userRole, setUserRole] = useState('');
    const [domainExpertise, setDomainExpertise] = useState('');
    const [companySize, setCompanySize] = useState('');
    // Get system's default time zone and date format
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { register, handleSubmit, setError, reset, formState: { errors }, trigger, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            organization: '',
            timeZone: defaultTimeZone
        }
    });

    if (session?.data?.isOnboarded) {
        router.push('/scale/home');
    }

    const handleLogout = () => {
        updateOnboardData(null);
        deleteCookie("logged");
        signOut();
    }

    useEffect(() => {
        reset({
            timeZone: defaultTimeZone,
        });

    }, []);

    const [open, setOpen] = useState(false);
    const [state] = useState({
        vertical: 'top',
        horizontal: 'center',
        Transition: Fade,
    });
    const { vertical, horizontal } = state;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const onSubmitNew = (data) => {
        setIsLoading(true);
        submitHandler(data);
    };

    const login = async () => {
        const resdata = await signIn("credentials", {
            email: onboardData?.email,
            password: onboardData?.password,
            hashedPassword: onboardData?.hashedPassword,
            redirect: false,
        });
        if (resdata.status === 200) {
            router.push('/scale/home');
        } else {
            const errorMessage = "Sorry....the backend server is down!! Please try again later";
            setMessage(errorMessage);
            setOpen(true);
        }
    }

    const submitHandler = async (data) => {
        let posturl = baseURL + "users";

        const requestBody = {
            email: userEmail,
            organization: data.organization,
            timeZone: data.timeZone,
            dateFormat: data.dateFormat,
            fullName: data.fullName,
            userRole: data.userRole,
            domainExpertise: data.domainExpertise,
            companySize: data.companySize,
        }

        await axios
            .post(posturl, requestBody)
            .then(function (res) {
                updateOrganizationName(data.organization);
                updateSelectedMenu('');
                setCookie("logged", "true", { maxAge: 60 * 60 * 24 * 30 });
                setIsError(false);
                setMessage('Congratulations! Account created. Redirecting...');
                setOpen(true);
                login();
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
        console.log(error);
    };

    const handleClickNext = async () => {
        const isValid = await trigger(['fullName', 'organization', 'userRole', 'domainExpertise', 'companySize']);
        setValue('fullName', fullName);
        setValue('organization', organization);
        setValue('userRole', userRole);
        setValue('domainExpertise', domainExpertise);
        setValue('companySize', companySize);

        if (isValid) {
            setIsShowNext(true);
        }
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
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-sm w-full p-6 bg-white rounded-md shadow-md">
                        {isShowNext ? (
                            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-5">Some more details</h3>
                        ) : (
                            <h3 className="text-2xl font-semibold text-center text-gray-800">Let&apos;s  get some details</h3>
                        )}
                        <form onSubmit={handleSubmit(onSubmitNew)}>
                            {!isShowNext && (
                                <div>
                                    <div className="mb-4 mt-5">
                                        <label htmlFor="fullName" className="scaleformlabel">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                                setValue("fullName", e.target.value, { shouldValidate: true });
                                            }}
                                            className={`scaleform ${errors?.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors?.fullName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.fullName?.message}</p>
                                        )}
                                    </div>
                                    <div className="mb-4 mt-4">
                                        <label htmlFor="organization" className="scaleformlabel">
                                            Organization Name
                                        </label>
                                        <input
                                            type="text"
                                            name="organization"
                                            value={organization}
                                            onChange={(e) => {
                                                setOrganization(e.target.value);
                                                setValue("organization", e.target.value, { shouldValidate: true });
                                            }}
                                            className={`scaleform ${errors?.organization ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors?.organization && (
                                            <p className="text-red-500 text-xs mt-1">{errors.organization?.message}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="scaleformlabel" htmlFor="userRole">
                                            Select Role
                                        </label>
                                        <select
                                            id="userRole"
                                            name="userRole"
                                            value={userRole}
                                            onChange={(e) => {
                                                setUserRole(e.target.value);
                                                setValue("userRole", e.target.value, { shouldValidate: true });
                                            }}
                                            className={`scaleform ${errors?.userRole ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select your role</option>
                                            <option value="Individual Contributor">Individual Contributor</option>
                                            <option value="Senior Leader">Senior Leader</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Executive">Executive</option>
                                            <option value="Freelancer">Freelancer</option>
                                            <option value="Student">Student</option>
                                        </select>
                                        {errors.userRole && <p className="text-red-500 text-xs italic">{errors.userRole.message}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="scaleformlabel" htmlFor="domainExpertise">
                                            Domain Expertise
                                        </label>
                                        <select
                                            id="domainExpertise"
                                            name="domainExpertise"
                                            onChange={(e) => {
                                                setDomainExpertise(e.target.value);
                                                setValue("domainExpertise", e.target.value, { shouldValidate: true });
                                            }}
                                            value={domainExpertise}
                                            className={`scaleform ${errors?.domainExpertise ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select your domain expertise</option>
                                            <option value="IT">IT</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Product Management">Product Management</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Operations">Operations</option>
                                            <option value="HR">HR</option>
                                        </select>
                                        {errors.domainExpertise && <p className="text-red-500 text-xs italic">{errors.domainExpertise.message}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="scaleformlabel" htmlFor="companySize">
                                            Company Size
                                        </label>
                                        <select
                                            id="companySize"
                                            name="companySize"
                                            onChange={(e) => {
                                                setCompanySize(e.target.value);
                                                setValue("companySize", e.target.value, { shouldValidate: true });
                                            }}
                                            value={companySize}
                                            className={`scaleform ${errors?.companySize ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select your company size</option>
                                            <option value="1-5">1-5</option>
                                            <option value="6-10">6-10</option>
                                            <option value="11-25">11-25</option>
                                            <option value="26-50">26-50</option>
                                            <option value="51-100">51-100</option>
                                            <option value="101-200">101-200</option>
                                            <option value="201-500">201-500</option>
                                            <option value="501-1000">501-1000</option>
                                            <option value="1001-5000">1001-5000</option>
                                            <option value="5001-10000">5001-10000</option>
                                            <option value="10001+">10001+</option>
                                        </select>
                                        {errors.companySize && <p className="text-red-500 text-xs italic">{errors.companySize.message}</p>}
                                    </div>
                                </div>
                            )}

                            {isShowNext && (
                                <div>
                                    <div className="mb-4">
                                        <label className="scaleformlabel" htmlFor="timeZone">
                                            Time Zone
                                        </label>
                                        <select
                                            id="timeZone"
                                            name="timeZone"
                                            {...register('timeZone')}
                                            className={`scaleform ${errors?.timeZone ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            {timeZones.map((tz) => (
                                                <option key={tz} value={tz}>
                                                    {tz}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.timeZone && <p className="text-red-500 text-xs italic">{errors.timeZone.message}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="scaleformlabel" htmlFor="timeZone">
                                            Date Format
                                        </label>
                                        <select
                                            id="dateFormat"
                                            name="dateFormat"
                                            {...register('dateFormat')}
                                            className={`scaleform ${errors?.dateFormat ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            {dateFormats.map((df) => (
                                                <option key={df?.key} value={df.key}>
                                                    {df.value}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.dateFormat && <p className="text-red-500 text-xs italic">{errors.dateFormat.message}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        className={`w-full mb-4 mt-4 ${buttonStyle} ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'} text-white font-bold py-2 px-4 rounded`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="flex justify-center">
                                                    Loading...
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
                                        ) : "Done"}
                                    </button>
                                </div>
                            )}
                            {!isShowNext && (
                                <div>
                                    <div
                                        className={`w-full mb-4 mt-4 cursor-pointer ${buttonStyle} ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'} text-white font-bold py-2 px-4 rounded`}
                                        onClick={() => handleClickNext()}
                                    >
                                        <div className="flex justify-center">
                                            Next
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                        <div>
                            <p>Use different account?
                                <span className="text-blue-500 cursor-pointer" onClick={() => { handleLogout() }}> Sign in</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Grid>
        </>

    ); // End of return block

}


export default Register;
