'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";
import team from '@/img/pages/backlog.PNG';
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
                                            Build and Empower Your Team
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Manage your team efficiently, assign roles, and collaborate effectively to achieve your project goals.
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
                                        src={team}
                                        alt="Team"
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
                                        src={team}
                                        alt="Team"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Team Collaboration
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Foster collaboration within your team by sharing updates, assigning tasks, and discussing project details.
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
                                            Role Assignment
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Assign roles and responsibilities to team members, ensuring everyone knows their part in the project.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={team}
                                        alt="Team"
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
                                        src={team}
                                        alt="Team"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Progress Tracking
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Monitor your team's progress, track milestones, and ensure that your project is on track.
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
                                            Team Communication
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Streamline communication within your team with integrated messaging, notifications, and updates.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={team}
                                        alt="Team"
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
                                        src={team}
                                        alt="Team"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Team Visibility
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Keep everyone on the same page with clear visibility into tasks, deadlines, and team priorities.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Section  */}

                        {/* Bottom Section  */}
                        <div className="mt-20 md:mt-28 pb-10 md:pb-24">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-full">
                                    <div className="pb-3 text-left md:pb-4 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Empower Your Team Today
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Equip your team with the tools they need to collaborate effectively, stay organized, and drive your project to success.
                                            </p>
                                        </div>
                                        <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-start">
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
                        </div>
                        {/* Bottom Section  */}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Page;
