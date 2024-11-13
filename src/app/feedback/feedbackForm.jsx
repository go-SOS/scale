'use client'
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from 'next-nprogress-bar';

const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

// Define validation schema with Yup
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    feedback: yup.string().min(3, 'Feedback must be at least 10 characters').required('Feedback is required'),
});

const FeedbackForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const baseURL = '/api/';
    const [value, setValue] = useState(5);
    const [loading, setLoading] = useState(true);
    const [hover, setHover] = useState(-1);
    const [disabled, setDisabled] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log('session ', session);
        setLoading(false);
    }, []);

    const onSubmit = async (data) => {
        // if (session && session.data) {
        console.log('data ', data);
        // if (!data.feedback) {
        //     setError('feedback', { type: 'custom', message: 'Feedback is required' });
        //     return;
        // }
        setDisabled(true);
        try {
            const endpoint = baseURL + `feedback`;
            let method;

            Object.assign(data, { rating: value });
            method = "post";
            const { data: responseData } = await axios[method](endpoint, data);

            setDisabled(false);
            const successMessage = 'Thanks for your feedback!';
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
            setTimeout(() => {
                router.back();
            }, 2000);
        } catch (error) {
            setDisabled(false);
            handleApiError(error);
        }
        // } else {
        //     toast.info('Please login to submit your feedback', {
        //         position: "top-center",
        //         autoClose: 3000,
        //         hideProgressBar: true,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         toastId: 'success',
        //         progress: undefined,
        //         theme: "light",
        //         style: {
        //             width: '380px',
        //         },
        //     });
        // }

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
        <div>
            <ToastContainer />
            {!loading && (
                <div className="md:max-w-[40vw] max-w-[80vw] mx-auto p-8 bg-white shadow-md rounded-md">
                    <h2 className="text-2xl font-semibold text-center mb-6">General Feedback</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4 flex justify-center">
                            <div>
                                <label htmlFor="feedback" className="scaleformlabel mb-4">
                                    How would you rate your experience
                                </label>
                                <Box
                                    sx={{
                                        width: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Rating
                                        name="hover-feedback"
                                        size="large"
                                        value={value}
                                        precision={0.5}
                                        getLabelText={getLabelText}
                                        onChange={(event, newValue) => {
                                            setValue(newValue);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                            setHover(newHover);
                                        }}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {value !== null && (
                                        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
                                    )}
                                </Box>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="feedback" className="scaleformlabel">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                {...register('name')}
                                className={`scaleform ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="mb-2">
                            <label htmlFor="email" className="scaleformlabel">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                {...register('email')}
                                className={`scaleform ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="feedback" className="scaleformlabel">
                                Leave us your comment
                            </label>
                            <textarea
                                name="feedback"
                                {...register('feedback')}
                                rows="3"
                                className={`scaleform ${errors.feedback ? 'border-red-500' : 'border-gray-300'}`}
                            ></textarea>
                            {errors.feedback && (
                                <p className="text-red-500 text-xs mt-1">{errors.feedback.message}</p>
                            )}
                        </div>
                        <div className="mt-10 flex justify-center">
                            {disabled ? (
                                <div
                                    className="pulsebuttonblue px-3 py-2 mr-1"
                                    style={{ opacity: 0.5, pointerEvents: 'none' }}
                                >
                                    <span>Submit Feedback</span>
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
                                        className="pulsebuttonblue min-w-[140px] px-3"
                                    >
                                        Submit Feedback
                                    </button>
                                )
                            }
                        </div>
                    </form>
                </div>
            )}

        </div>

    );
};

export default FeedbackForm;
