"use client";
import Layout from "@/app/scale/layout/layout";
import { useEffect, useState } from "react";
import MemberComponent from "./memberComponent";
import MemberDrawer from './components/memberDrawer';
import Breadcrumb from '@/app/scale/layout/breadcrumb';
import useSlug from "@/app/scale/layout/hooks/useSlug";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next-nprogress-bar';


export default function Page() {
    const router = useRouter();
    const { projectName, slug, key } = useSlug();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [loading]);

    return (
        <Layout>
            <>
                {!loading && (
                    <>
                        <Breadcrumb page="Members" project={projectName} section="Team" slug={slug} />
                        <div className="hover:bg-blue-100 hover:rounded-md max-w-[50px] mt-5 -mb-6">
                            <div
                                className="px-3 py-1 mr-1 text-blue-600 cursor-pointer"
                                onClick={() => {
                                    router.back();
                                }}
                            >
                                <KeyboardBackspaceIcon className="w-5 h-5" />
                            </div>
                        </div>
                        <MemberDrawer />
                        <MemberComponent />
                    </>
                )}
            </>
        </Layout>
    )
}
