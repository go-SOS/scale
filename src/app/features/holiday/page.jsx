'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";
import holidayImage from '@/img/pages/team/holidays.PNG';
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
                                            Celebrate Work-Life Balance
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Our Holiday feature helps you keep track of public holidays and personal days off, ensuring you and your team can plan and celebrate effectively.
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
                                        src={holidayImage}
                                        alt="Holiday"
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
                                        src={holidayImage}
                                        alt="Holiday"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Plan Your Time Off
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Easily plan and manage your time off with our Holiday feature. View upcoming holidays, plan vacations, and ensure your team is well-informed.
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
                                            Stay Organized
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Keep your holiday schedule organized with clear visibility of all team members' time off. Coordinate better and avoid scheduling conflicts.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={holidayImage}
                                        alt="Holiday"
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
                                        src={holidayImage}
                                        alt="Holiday"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Enhance Team Coordination
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Improve team coordination with a shared holiday calendar. Ensure everyone is aware of time off to maintain smooth project progress.
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
                                            Simplify Holiday Management
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Manage and track holidays easily with our intuitive interface. Keep your team informed and ensure smooth operations throughout the year.
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
