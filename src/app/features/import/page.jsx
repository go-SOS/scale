'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";
import importsnap from '@/img/pages/util/import.PNG';
import Image from 'next/image';

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

                        {/* Main Section  */}
                        <div className="mt-24">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 md:ml-2 md:mr-2">
                                        <h1
                                            className="mb-6 text-4xl font-semibold md:text-5xl md:leading-tight leading-snug gradientText"
                                        >
                                            Simplify Your Imports with Our Tool
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Streamline your import process and handle complex imports with ease and efficiency.
                                            </p>
                                        </div>
                                        <div>
                                            <div
                                                className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-start"
                                            >
                                                <div
                                                    className="pulsebuttonblue px-4"
                                                    onClick={() => router.push('/register')}
                                                >
                                                    Get started
                                                </div>
                                                <div className="pulsebuttonwhite px-4 sm:ml-4 sm:w-auto">
                                                    Learn More
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={importsnap}
                                        alt="Import Process"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Main Section  */}

                        {/* Right Section  */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={importsnap}
                                        alt="Import Milestones"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Set Your Import Milestones
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Establish and track key import milestones to ensure your projects are on schedule and on target.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Section  */}

                        {/* Left Section  */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Visualize the Import Process
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                See your entire import process at a glance with a detailed timeline that keeps everyone informed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={importsnap}
                                        alt="Import Timeline"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Left Section  */}

                        {/* Right Section  */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={importsnap}
                                        alt="Strategic Import Planning"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Strategic Import Planning
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Ensure your imports align with strategic goals, making every task count towards your project's success.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Section  */}

                        {/* Left Section  */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Monitor Import Progress
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Keep track of your imports in real-time, making adjustments as necessary to stay on course.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={importsnap}
                                        alt="Import Tracking"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Left Section  */}

                        {/* Right Section  */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={importsnap}
                                        alt="Import Communication"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Clear Import Communication
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Facilitate effective communication among stakeholders, ensuring everyone is on the same page with import progress.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Section  */}

                        {/* Section 5 */}
                        <div className="mt-24">
                            <div className="mx-4 md:mx-16">
                                <div className="text-center text-xl md:text-2xl mt-20">
                                    <h3 className="leading-tight font-semibold gradientText">
                                        Experience the Future of Import Management
                                    </h3>
                                </div>
                                <div className="mt-6 flex justify-center text-gray-700">
                                    <p className="max-w-3xl text-lg">
                                        Embrace the power of our import tool and transform your import process into a seamless, strategic, and success-driven journey.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Section 5 */}

                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Page;
