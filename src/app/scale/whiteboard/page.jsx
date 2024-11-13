"use client";
import Layout from "@/app/scale/layout/layout";
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import Skeleton from '@mui/material/Skeleton';

const Excalidraw = dynamic(() => import('@excalidraw/excalidraw').then((module) => module.Excalidraw), {
    loading: () => <Skeleton variant="rounded" width="100%" height="400px" className="mt-20" />,
    ssr: false,
});

export default function Page() {
    const excalidrawRef = useRef(null);

    const UIOptions = {
        canvasActions: {
            changeViewBackgroundColor: false,
            clearCanvas: false,
            loadScene: true,
            saveFileToDisk: true,
            // saveToActiveFile: true,
            // saveAsImage: true,
        },
    };

    return (
        <Layout>
            <div>
                <div style={{ height: '83vh' }}>
                    {Excalidraw && (
                        <Excalidraw
                            UIOptions={UIOptions}
                            ref={excalidrawRef}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
}
