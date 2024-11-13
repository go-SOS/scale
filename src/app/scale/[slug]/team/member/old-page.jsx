"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import MemberComponent from "./memberComponent";
import TeamComponent from "../team/teamComponent";
import MemberDrawer from './components/memberDrawer';
import TeamDrawer from '../team/components/teamDrawer';
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Page() {
    const { projectName, slug, key } = useSlug();
    const [loading, setLoading] = useState(true);
    const [isTeamVisible, setIsTeamVisible] = useState(false);
    const [isMemberVisible, setIsMemberVisible] = useState(true);

    const toggleTeamAccordion = () => {
        setIsTeamVisible(!isTeamVisible);
    };

    const toggleMemberAccordion = () => {
        setIsMemberVisible(!isMemberVisible);
    };

    useEffect(() => {
        setLoading(false);
    }, [loading]);

    return (
        <Layout>
            <>
                {!loading && (
                    <>
                        <Breadcrumb page="Members" project={projectName} section="Team" slug={slug} />
                        {!isTeamVisible && (
                            <div className="cursor-pointer flex justify-center mt-6">
                                <div className="text-md font-semibold">
                                    Add Team
                                </div>
                            </div>
                        )}
                        <div onClick={toggleTeamAccordion} className="cursor-pointer flex justify-center -mt-2">
                            <div className={`transform transition-transform duration-300 ${isTeamVisible ? 'rotate-180' : ''} text-black`}>
                                <ExpandMoreIcon sx={{ fontSize: 35 }} />
                            </div>
                        </div>
                        <MemberDrawer />
                        <TeamDrawer />
                        <div>
                            {isTeamVisible && (
                                <TeamComponent />
                            )}
                        </div>
                        <div className="mt-10">
                            {!isMemberVisible && (
                                <div className="cursor-pointer flex justify-center mt-6">
                                    <div className="text-md font-semibold">
                                        Add Member
                                    </div>
                                </div>
                            )}
                            <div onClick={toggleMemberAccordion} className="cursor-pointer flex justify-center -mt-2">
                                <div className={`transform transition-transform duration-300 ${isMemberVisible ? 'rotate-180' : ''} text-black`}>
                                    <ExpandMoreIcon sx={{ fontSize: 35 }} />
                                </div>
                            </div>
                            <div className="mt-4">
                                {isMemberVisible && (
                                    <MemberComponent />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </>
        </Layout>
    )
}
