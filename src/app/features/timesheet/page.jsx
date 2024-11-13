'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";
import timesheet from '@/img/pages/team/timesheet.PNG';
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

                        {/* Main Section */}
                        <div className="mt-24">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 md:ml-2 md:mr-2">
                                        <h1
                                            className="mb-6 text-4xl font-semibold md:text-5xl md:leading-tight leading-snug gradientText"
                                        >
                                            Efficient Timesheet Management
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Streamline your time tracking process with our comprehensive Timesheet Management tool, designed to simplify logging and managing your work hours.
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
                                        src={timesheet}
                                        alt="Timesheet"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Main Section */}

                        {/* Right Section */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={timesheet}
                                        alt="Timesheet"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Track and Report Your Work Hours
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Keep an accurate record of your work hours and effortlessly generate reports to ensure transparency and efficiency in time management.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Section */}

                        {/* Left Section */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Simplify Timesheet Entry
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Our intuitive interface makes it easy to log time, track project progress, and ensure accurate billing and payroll processing.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={timesheet}
                                        alt="Timesheet"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Left Section */}

                        {/* Right Section */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={timesheet}
                                        alt="Timesheet"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Analyze Time Usage
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Gain insights into time usage across different projects and tasks, helping you identify areas for improvement and optimize resource allocation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Section */}

                        {/* Bottom Section */}
                        <div className="mt-20 md:mt-28 pb-10 md:pb-24">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-full">
                                    <div className="pb-3 text-left md:pb-4 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Optimize Your Time Management
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Enhance your productivity with our Timesheet Management tool, ensuring that every minute is accounted for and every task is completed efficiently.
                                            </p>
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
