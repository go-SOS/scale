"use client";
import { Card, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const StatusCard = ({ statusResult }) => {
    return (
        <div className="flex justify-between mt-6">
            <Card
                className="cursor-pointer p-2 min-w-[18.6vw]"
            >
                <Stack spacing={0} direction="row">
                    <div className="mr-2">
                        <CheckCircleIcon className="ml-4 mt-[9px] text-emerald-400" sx={{ fontSize: 40 }} />
                    </div>
                    <div className="p-2 mr-2">
                        <span className="text-lg text-emerald-400 mr-2 font-semibold">{statusResult?.doneCount}</span>
                        <span className="text-lg text-emerald-400 font-semibold">
                            done
                        </span>
                        <div className="text-[12px] font-semibold -mt-1">
                            in the last 30 days.
                        </div>
                    </div>
                </Stack>
            </Card>
            <Card
                className="cursor-pointer p-2 min-w-[18.6vw]"
            >
                <Stack spacing={0} direction="row">
                    <div className="mr-2">
                        <CreateRoundedIcon className="ml-4 mt-[9px] text-indigo-400" sx={{ fontSize: 40 }} />
                    </div>
                    <div className="p-2 mr-2">
                        <span className="text-lg text-indigo-400 mr-2 font-semibold">{statusResult?.updatedCount}</span>
                        <span className="text-lg text-indigo-400 font-semibold">
                            updated
                        </span>
                        <div className="text-[12px] font-semibold -mt-1">
                            in the last 30 days.
                        </div>
                    </div>
                </Stack>
            </Card>
            <Card
                className="cursor-pointer p-2 min-w-[18.6vw]"
            >
                <Stack spacing={0} direction="row">
                    <div className="mr-2">
                        <AddCircleOutlinedIcon className="ml-4 mt-[9px] text-cyan-400" sx={{ fontSize: 40 }} />
                    </div>
                    <div className="p-2 mr-2">
                        <span className="text-lg text-cyan-400 mr-2 font-semibold">{statusResult?.newCount}</span>
                        <span className="text-lg text-cyan-400 font-semibold">
                            new
                        </span>
                        <div className="text-[12px] font-semibold -mt-1">
                            in the last 30 days.
                        </div>
                    </div>
                </Stack>
            </Card>
            <Card
                className="cursor-pointer p-2 min-w-[18.6vw]"
            >
                <Stack spacing={0} direction="row">
                    <div className="mr-2">
                        <CalendarMonthOutlinedIcon className="ml-4 mt-[9px] text-rose-400" sx={{ fontSize: 40 }} />
                    </div>
                    <div className="p-2 mr-2">
                        <span className="text-lg text-rose-400 mr-2 font-semibold">{statusResult?.dueCount}</span>
                        <span className="text-lg text-rose-400 font-semibold">
                            due
                        </span>
                        <div className="text-[12px] font-semibold -mt-1">
                            in the last 30 days.
                        </div>
                    </div>
                </Stack>
            </Card>
        </div>
    );
};

export default StatusCard;
