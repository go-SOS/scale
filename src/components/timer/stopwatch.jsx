"use client";
import { useEffect } from 'react';
import React from 'react';
import useMyStopwatch from '@/components/timer/timerUtils';
import { useRouter } from 'next-nprogress-bar';
import useAppStore from '@/store/appStore';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function MyStopwatch() {
    const { timerRunning } = useAppStore();
    const router = useRouter();
    const { slug } = useSlug();
    const {
        seconds,
        minutes,
        hours,
        start,
        pause,
    } = useMyStopwatch();

    useEffect(() => {
        // console.log('isRunning ', timerRunning);
        if (timerRunning) {
            start();
        } else {
            pause();
        }
    }, [timerRunning])

    return (
        <div
            className="cursor-pointer"
            onClick={() => {
                router.push("/scale/" + slug + "/timer/new");
            }}>
            <div className="border-slate-300 rounded-md border p-1 max-w-[150px] text-center fixed top-1 right-[400px] z-50 px-4 mt-3">
                <NotificationsActiveIcon color="success" />
                {/* <div className="font-semibold text-green-600 text-md">
                    <span>{String(hours).padStart(2, '0')}</span>:
                    <span>{String(minutes).padStart(2, '0')}</span>:
                    <span>{String(seconds).padStart(2, '0')}</span>
                </div> */}
            </div>
        </div>
    );
}
