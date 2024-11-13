import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";
import useAppStore from '@/store/appStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const schema = yup.object().shape({
    teamMembers: yup.array().of(
        yup.object().shape({
            fullName: yup.string().required('Please enter name.'),
            email: yup.string().email('Invalid email').required('Please enter email'),
            role: yup.string().required('Please select role.'),
        })
    )
});

const InviteCard = ({ projectName, projectSlug, handleinvited }) => {
    const baseURL = '/api/';
    const { sessionData, userId } = useAppStore();
    const { control, handleSubmit, setError, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            teamMembers: [{ fullName: '', email: '', role: 'Member' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'teamMembers'
    });

    const [disabled, setDisabled] = useState(false);
    const { updateBacklogList } = useAppStore();
    const { data: session } = useSession();

    const onSubmit = async (data) => {
        setDisabled(true);

        // Prepare the team members with the necessary metadata
        const teamMembersWithMetadata = data.teamMembers.map(member => ({
            ...member,
            userId: session?.data?._id,
            updatedAt: Date.now(),
            projectSlug,
            projectName,
            isInvited: true,
            isJoined: false,
            createdBy: session.data.fullName,
            lastModifiedBy: session.data.email,
            organization: session.data.organization,
            organizationId: session.data.organizationId,
            projects: [{
                name: projectName,
                slug: projectSlug,
                active: true
            }]
        }));

        const endpoint = `${baseURL}member`;
        const method = "post";
        let allSuccessful = true;

        // Iterate over the team members and send the requests
        for (const record of teamMembersWithMetadata) {
            try {
                await axios[method](endpoint, record);
                handleinvited(true);
            } catch (error) {
                if (error.response?.data?.error) {
                    setError('email', { type: 'custom', message: error.response.data.error });
                }
                toast.error(error.response?.data?.error, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: { width: '380px' },
                });
                allSuccessful = false;
                handleApiError(error);
                // If you want to stop on the first error, uncomment the next line
                // break;
            }
        }

        // Handle the final state based on the success of the operations
        if (allSuccessful) {
            toast.success('Member invited successfully!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: 'success',
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: '380px' },
            });
        }

        setDisabled(false);
    };

    const handleApiError = (error) => {
        const errorMessage =
            error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 500
                ? error.response?.data?.error || "An error occurred"
                : "Sorry....the backend server is down!! Please try again later";

        if (error.response?.data?.error) {
            setError('email', { type: 'custom', message: error.response.data.error });
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
                style: { width: '380px' },
            });
        }

        console.log(error);
    };


    return (
        <>
            <div className="rounded overflow-hidden -mb-2 -mt-2">
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex justify-between mb-4">
                                <div className="ml-3">
                                    <label htmlFor={`teamMembers[${index}].fullName`} className="block text-sm text-gray-600 font-semibold">
                                        Name
                                    </label>
                                    <Controller
                                        control={control}
                                        name={`teamMembers[${index}].fullName`}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                {...field}
                                                className={`scaleform min-w-[23vw] ${errors.teamMembers?.[index]?.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        )}
                                    />
                                    {errors.teamMembers?.[index]?.fullName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.teamMembers[index].fullName.message}</p>
                                    )}
                                </div>

                                <div className="ml-3">
                                    <label htmlFor={`teamMembers[${index}].email`} className="block text-sm text-gray-600 font-semibold">
                                        Email
                                    </label>
                                    <Controller
                                        control={control}
                                        name={`teamMembers[${index}].email`}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                {...field}
                                                className={`scaleform min-w-[23vw] ${errors.teamMembers?.[index]?.email ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        )}
                                    />
                                    {errors.teamMembers?.[index]?.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.teamMembers[index].email.message}</p>
                                    )}
                                </div>

                                <div className="-mt-1">
                                    <label htmlFor={`teamMembers[${index}].role`} className="scaleformlabel">
                                        Role
                                    </label>
                                    <Controller
                                        control={control}
                                        name={`teamMembers[${index}].role`}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className={`scaleform min-w-[23vw] ${errors.teamMembers?.[index]?.role ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="Member">Member</option>
                                                <option value="Administrator">Administrator</option>
                                            </select>
                                        )}
                                    />
                                    {errors.teamMembers?.[index]?.role && (
                                        <p className="text-red-500 max-w-[16vw] min-w-[16vw] text-xs">{errors.teamMembers[index].role.message}</p>
                                    )}
                                </div>

                                <div className="mt-6 cursor-pointer" onClick={() => remove(index)}>
                                    <CancelOutlinedIcon sx={{ fontSize: 30 }} />
                                </div>
                            </div>
                        ))}

                        <div className="flex text-sm text-blue-600 mt-2 ml-2 cursor-pointer" onClick={() => append({ fullName: '', email: '', role: 'Member' })}>
                            <AddOutlinedIcon />
                            Add member
                        </div>

                        <div className="min-h-[60px] mt-9">
                            <div className="mt-4">
                                <div className="flex justify-center mr-4">
                                    <div>
                                        {disabled ? (
                                            <div
                                                className="pulsebuttonblue min-w-[140px]"
                                                style={{ opacity: 0.5, pointerEvents: 'none', minWidth: "300px" }}
                                            >
                                                <span>Invite</span>
                                                <span className="mb-1 -mr-4">
                                                    <svg ariaHidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.744 1.0518C51.9937 0.367119 47.1728 0.446341 42.4562 1.27873C39.9793 1.7195 38.514 4.18785 39.1511 6.61331C39.7882 9.03877 42.2565 10.5041 44.7334 10.0633C48.4986 9.40399 52.349 9.35041 56.1235 9.9114C61.3048 10.6457 66.2552 12.5087 70.6331 15.3925C74.386 17.888 77.5873 21.1926 80.0915 25.1028C82.2562 28.5144 83.908 32.2587 85.0002 36.1732C85.693 38.5286 87.5422 39.6781 89.9676 39.0409Z" fill="currentColor" />
                                                    </svg>
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                className="pulsebuttonblue min-w-[140px]"
                                                style={{ minWidth: "300px" }}
                                                type="submit">
                                                Invite
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default InviteCard;
