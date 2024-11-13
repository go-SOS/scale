import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BetaBanner = () => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    if (!open) {
        return null;
    }

    return (
        <div className="w-full bg-blue-100 text-black py-2 px-4 top-0 left-0 z-50 flex justify-center items-center relative">
            <div className="flex-grow text-center">
                <p className="text-sm md:text-base mx-6">
                    This feature is currently in BETA phase.
                    {/* We are currently in BETA phase. Please note we are fine-tuning features and gathering insights on the real-time experience of our application. */}
                </p>
            </div>
            {/* <IconButton
                onClick={handleClose}
                size="small"
                aria-label="close"
                className="absolute right-0"
                sx={{ color: '#000' }}
            >
                <CloseIcon />
            </IconButton> */}
        </div>
    );
};

export default BetaBanner;
