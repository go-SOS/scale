import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useSession } from "next-auth/react";
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import InfoIcon from '@mui/icons-material/Info';


export default function MoreEvent({ taskId, handleCloseMoreClick, createdOn, updatedOn, from }) {
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;

    const handleEvent = (id, type) => {
        const event = {
            id: id,
            type: type,
        }
        handleCloseMoreClick(event);
    }

    return (
        <div className="absolute py-2 right-0 top-7 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-sm z-50">
            <div
                className="absolute top-0 right-0 p-1"
                onClick={() => handleEvent(taskId, 'random')}
            >
                <HighlightOffIcon fontSize="small" />
            </div>
            <ul>
                <li
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[13px] mt-4"
                    onClick={() => handleEvent(taskId, 'view')}
                >
                    <InfoIcon fontSize="small" className='mr-2' />
                    View
                </li>
                <li
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[13px]"
                    onClick={() => handleEvent(taskId, 'edit')}
                >
                    <EditIcon fontSize="small" className='mr-2' />
                    Edit
                </li>
                <li
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[13px]"
                    onClick={() => handleEvent(taskId, 'delete')}
                >
                    <DeleteOutlineIcon fontSize="small" className='mr-2' />
                    Delete
                </li>
                {from === "backlog" && (
                    <span>
                        <li
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[13px]"
                            onClick={() => handleEvent(taskId, 'comment')}
                        >
                            <MessageRoundedIcon fontSize="small" className='mr-2' />
                            Comments
                        </li>
                        <li
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[13px]"
                            onClick={() => handleEvent(taskId, 'copy')}
                        >
                            <ContentCopyIcon fontSize="small" className='mr-2' />
                            Make a copy
                        </li>
                        <li
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[13px]"
                            onClick={() => handleEvent(taskId, 'email')}
                        >
                            <EmailIcon fontSize="small" className='mr-2' />
                            Send email
                        </li>
                    </span>
                )}
                <hr className="border border-gray-200 my-2 mx-2" />
                {/* <li
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[13px]"
                    onClick={() => handleEvent(taskId, 'random')}
                >
                    <EditNoteIcon fontSize="small" className='mr-2' />
                    Created on
                    <div className="ml-7">
                        {format(new Date(createdOn), dateFormat)}
                    </div>
                </li> */}
                <li
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[13px]"
                    onClick={() => handleEvent(taskId, 'random')}
                >
                    <EditNoteIcon fontSize="small" className='mr-2' />
                    Updated on
                    <div className="ml-7">
                        {format(new Date(updatedOn), dateFormat)}
                    </div>
                </li>
            </ul>
        </div>
    );
}
