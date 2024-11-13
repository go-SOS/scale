"use client";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import SendIcon from '@mui/icons-material/Send';
import 'react-toastify/dist/ReactToastify.css';
import useAppStore from "@/store/appStore";
import { toast } from 'react-toastify';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Divider from '@mui/material/Divider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import SendTo from "./sendTo";
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


const SendMail = () => {
  const [to, setTo] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const disabledClassName = isDisabled ? "pulsebuttonblueDisabled" : "pulsebuttonblue";
  const { updateIsMailDrawer, selectedEmailList, updateSelectedEmailList } = useAppStore();
  const [disabled, setDisabled] = useState(false);
  const baseURL = '/api/';
  const [content, setContent] = useState("");

  const handleSetTo = (newEmail) => {
    setTo(newEmail);
  }

  useEffect(() => {
    if (selectedEmailList.length > 0) {
      setTo(selectedEmailList);
    } else {
      setTo('');
    }
  }, [selectedEmailList])


  const contentconfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter Content",
      minHeight: 350,
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
        // 'image',
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
    (newContent, name) => {
      setContent(prevContent => ({
        ...prevContent,
        newContent // Update the content for the specific textarea field
      }));
      setMessage(newContent);
    },
    [content]
  );

  useEffect(() => {
    if (to && subject && message) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [to, subject, message])


  const handleSendEmail = async (e) => {
    setDisabled(true);
    let emailData = {
      to: to,
      subject: subject,
      message: message,
    };

    e.preventDefault();
    try {
      const response = await axios.post("/api/sendEmail", emailData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      console.log('mail data ', data);
      updateSelectedEmailList([]);
      toast.success('Email sent successfully!', {
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
      updateIsMailDrawer(false);
      setDisabled(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error('Email sending failed!', {
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
      setDisabled(false);
    }
  };



  const handleMailDelete = () => {
    setTo("");
    setSubject("");
    setMessage("");
    updateSelectedEmailList([]);
    updateIsMailDrawer(false);
  }

  return (
    <>
      <div className="sticky top-0 bg-slate-100 z-10">
        <div>
          <IconButton onClick={() => { updateIsMailDrawer(false) }} edge="start" color="inherit" aria-label="close">
            <CloseRoundedIcon className="ml-4" />
          </IconButton>
        </div>
        <div className="flex justify-center text-lg font-semibold -mt-5">
          New Mail
        </div>
        <Divider className="mt-1" />
      </div>
      <div className="min-w-[100%] mx-auto mt-8 p-6">
        <div className="flex">
          <div className="mb-4 flex items-center min-w-[790px] mr-4">
            <label className="block min-w-[60px] mr-4 font-medium">To</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={`scaleform border-gray-30`}
            />
          </div>
          <SendTo handleSetTo={handleSetTo} />
        </div>
        <div className="mb-4 flex items-center">
          <label className="block min-w-[60px] mr-4 font-medium">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`scaleform border-gray-30`}
          />
        </div>
        <div className="mb-4">
          <JoditEditor
            value={message}
            config={contentconfig}
            tabIndex={1}
            onBlur={(newContent) => { onContentBlur(newContent) }}
            className={`scaleform border-gray-30`}
          />
          {/* <textarea
            rows={12}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`scaleform border-gray-30`}
            placeholder="Your email..."
          /> */}
        </div>

        <div className="bottom-4 left-6 right-0 mb-6 flex justify-between">
          <div className="flex justify-start">
            {disabled ? (
              <div
                className="pulsebuttonblue px-3 py-2 mr-1"
                style={{ opacity: 0.5, pointerEvents: 'none' }}
              >
                <span>Send</span>
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
                  className={`${disabledClassName} px-3 py-1 mr-1`}
                  onClick={handleSendEmail}
                  disabled={isDisabled}
                >
                  <SendIcon className="w-5 h-5" />
                  <span>Send</span>
                </button>
              )
            }


          </div>

          <div className="mr-10 mt-2 cursor-pointer" onClick={() => handleMailDelete()}>
            <DeleteOutlineRoundedIcon sx={{ fontSize: "20" }} />
          </div>
        </div>

      </div>
    </>

  );
};

export default SendMail;
