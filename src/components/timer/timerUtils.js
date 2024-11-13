import { useEffect, useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
import useAppStore from '@/store/appStore';

export default function useMyStopwatch() {
    const { totalTime, updateTotalTime } = useAppStore();
    const [timerReset, setTimerReset] = useState(false);
    const stopwatchOffset = new Date();
    stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + totalTime);

    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ offsetTimestamp: stopwatchOffset });

    // useEffect(() => {
    //     console.log('isRunning totalTime ', totalTime);
    // }, [totalTime]);

    useEffect(() => {
        // console.log('isRunning timerReset ', timerReset);
        if (timerReset) {
            reset();
            pause();
        }
    }, [timerReset]);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                updateTotalTime(totalSeconds);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, totalSeconds]);

    const handleReset = () => {
        setTimerReset(true);
        reset();
        updateTotalTime(0);
        pause();
    };

    const handleStart = () => {
        setTimerReset(false);
        start();
    };

    return {
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        handleStart,
        handleReset,
    };
}
