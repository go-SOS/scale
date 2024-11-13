"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from '@mui/material';
import useAppStore from '@/store/appStore';
import { useSession } from "next-auth/react";
import { format, isValid } from 'date-fns';
import axios from "axios";
import useSlug from "@/app/scale/layout/hooks/useSlug";

export default function CardView({ rows, params, from }) {
    const baseURL = '/api/';
    const { updateIsCommonDrawer, updateFromPage } = useAppStore();
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;
    const [loading, setLoading] = useState(true);
    const { slug } = useSlug();
    const [members, setMembers] = useState([]);

    const formatText = (text) => {
        if (typeof text !== 'string') return '';
        // Insert space before each uppercase letter and trim the result
        const spacedText = text.replace(/([A-Z])/g, ' $1').trim();
        // Capitalize the first letter
        return spacedText.charAt(0).toUpperCase() + spacedText.slice(1);
    };


    useEffect(() => {
        getMembers();
    }, [])

    const getMembers = async () => {
        let posturl = baseURL + `assignee?slug=${slug}`;
        await axios
            .get(posturl)
            .then((res) => {
                setMembers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    deleteCookie("logged");
                    signOut();
                }
            });
    };

    const openDrawer = (id) => {
        if (from === "risk") {
            updateFromPage('risk');
            updateIsCommonDrawer(id);
        }
        if (from === "dependencies") {
            updateFromPage('dependencies');
            updateIsCommonDrawer(id);
        }
        if (from === "issue") {
            updateFromPage('issue');
            updateIsCommonDrawer(id);
        }
        if (from === "assumption") {
            updateFromPage('assumption');
            updateIsCommonDrawer(id);
        }
        if (from === "sprint") {
            updateFromPage('sprint');
            updateIsCommonDrawer(id);
        }
        if (from === "project") {
            updateFromPage('project');
            updateIsCommonDrawer(id);
        }
        if (from === "stakeholder") {
            updateFromPage('stakeholder');
            updateIsCommonDrawer(id);
        }
        if (from === "bookmark") {
            updateFromPage('bookmark');
            updateIsCommonDrawer(id);
        }
        if (from === "retrospective") {
            updateFromPage('retrospective');
            updateIsCommonDrawer(id);
        }
        if (from === "timer") {
            updateFromPage('timer');
            updateIsCommonDrawer(id);
        }
        if (from === "timesheet") {
            updateFromPage('timesheet');
            updateIsCommonDrawer(id);
        }
        if (from === "release") {
            updateFromPage('release');
            updateIsCommonDrawer(id);
        }
        if (from === "member") {
            updateFromPage('member');
            updateIsCommonDrawer(id);
        }
        if (from === "backlog") {
            updateFromPage('backlog');
            updateIsCommonDrawer(id);
        }
        if (from === "todo") {
            updateFromPage('todo');
            updateIsCommonDrawer(id);
        }
    };

    const getFirstNameByEmail = (email) => {
        const teamMember = members.find(member => member.email === email);
        return teamMember ? teamMember.fullName : null;
    }

    return (
        <>
            {!loading && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }} className="mt-3">
                    {rows.length > 0 && rows.map((row) => (
                        <Card key={row._id} style={{ minWidth: '32%', maxWidth: '32%' }}>
                            <CardContent>
                                <div className="text-blue-700 cursor-pointer" onClick={() => openDrawer(row?._id)}>
                                    <span className="font-semibold">{formatText(params[0])}:</span> {row?.[params[0]]}
                                </div>
                                {params.slice(1).map((param, index) => (
                                    <div key={index}>
                                        {(param === "startTime" || param === "endTime") ? (
                                            <div>
                                                <span className="font-semibold">{formatText(param)}: </span>
                                                {format(new Date(row?.[param]), 'HH:mm:ss')}
                                            </div>
                                        ) : (
                                            <div>
                                                {(param === "startDate" ||
                                                    param === "dueDate" ||
                                                    param === "releaseDate" ||
                                                    param === "weekStartDate" ||
                                                    param === "weekEndDate" ||
                                                    param === "createdAt" ||
                                                    param === "updatedAt" ||
                                                    param === "expectedStartDate" ||
                                                    param === "expectedEndDate"
                                                ) ? (
                                                    <>
                                                        <span className="font-semibold">{formatText(param)}: </span>
                                                        {isValid(new Date(row?.[param])) ? (
                                                            format(new Date(row?.[param]), dateFormat)
                                                        ) : (
                                                            'Invalid date'
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {param === "assignee" ? (
                                                            <span>
                                                                <span className="font-semibold">{formatText(param)}: </span> {getFirstNameByEmail(row?.[param])}
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <span className="font-semibold">{formatText(param)}: </span> {row?.[param]}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}


                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div >
            )}
            {
                rows.length === 0 && (
                    <div>
                        <div className="flex justify-center text-md mt-32">
                            No record to display.
                        </div>
                    </div>
                )
            }
        </>
    );
}
