"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import TeamComponent from "./teamComponent";
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import TeamDrawer from "./components/teamDrawer";
import useSlug from "@/app/scale/layout/hooks/useSlug";

export default function Page() {
    const { projectName } = useSlug();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [loading]);

    return (
        <Layout>
            {!loading && (
                <>
                    <Breadcrumb page="Team" project={projectName} />
                    <TeamDrawer />
                    <TeamComponent />
                </>
            )}
        </Layout>
    )
}
