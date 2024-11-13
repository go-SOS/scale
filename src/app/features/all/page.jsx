'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";
import board from '@/img/pages/development/board.PNG';
import Image from 'next/image';
import FeaturesList from "./featuresList";


const Page = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session && session.data) {
            if (session?.data?.isOnboarded) {
                router.push('/scale/home');
            } else if (!session?.data?.isOnboarded) {
                router.push('/onboard');
            }
        }
    }, [session, router]);

    return (
        <>
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow md:mx-32">
                    <div className="mt-10">
                        {/* Main Section */}
                        <div className="mt-24">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 md:ml-2 md:mr-2">
                                        <h1 className="mb-6 text-4xl font-semibold md:text-5xl md:leading-tight leading-snug gradientText">
                                            List of All Features
                                        </h1>
                                        <p className="mb-8 text-gray-700 text-lg">
                                            Use these features to visualize and manage project workflows, keeping your team aligned and tasks moving forward.
                                        </p>
                                        <div className="flex space-x-4">
                                            <div className="pulsebuttonblue px-4" onClick={() => router.push('/register')}>
                                                Get started
                                            </div>
                                            <div className="pulsebuttonwhite px-4">
                                                Learn More
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image className="rounded-2xl shadow-lg border-2 border-blue-600" src={board} alt="Board" />
                                </div>
                            </div>
                        </div>
                        {/* Main Section */}

                        {/* Features Section */}
                        <FeaturesList />
                        {/* Features Section */}

                        {/* Bottom Section */}
                        <div className="mt-20 md:mt-28 pb-10 md:pb-24">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-full">
                                    <div className="pb-3 text-left md:pb-4 md:ml-20 md:mr-2">
                                        <h1 className="mb-6 text-[26px] md:text-[32px] font-semibold md:leading-tight leading-snug gradientText">
                                            Your Project, Your Features, Your Control
                                        </h1>
                                        <p className="mb-8 text-gray-700 text-lg">
                                            Customize your project with powerful tools like intuitive boards, customizable workflows, dashboards, filters, and more to fit your team’s unique needs.
                                        </p>
                                        <div className="flex space-x-4">
                                            <div className="pulsebuttonblue px-4" onClick={() => router.push('/register')}>
                                                Get started
                                            </div>
                                            <div className="pulsebuttonwhite px-4">
                                                Learn More
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Bottom Section */}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Page;
