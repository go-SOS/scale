'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";
import whiteboard from '@/img/pages/util/whiteboard.PNG';
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
                                            Visualize and Collaborate with the Whiteboard
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Brainstorm ideas, plan projects, and visualize your workflow with an interactive, collaborative whiteboard.
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
                                        src={whiteboard}
                                        alt="Whiteboard"
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
                                        src={whiteboard}
                                        alt="Whiteboard"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Collaborative Brainstorming
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Engage your team in brainstorming sessions with a virtual whiteboard where everyone can contribute in real-time.
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
                                            Visual Planning
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Map out your project visually, from initial ideas to detailed workflows, all in one flexible space.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={whiteboard}
                                        alt="Whiteboard"
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
                                        src={whiteboard}
                                        alt="Whiteboard"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Real-Time Collaboration
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Work together on the whiteboard in real-time, whether your team is in the office or spread across the globe.
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
                                            Idea Sharing
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Capture and share ideas instantly, making your whiteboard the central hub for team creativity and innovation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={whiteboard}
                                        alt="Whiteboard"
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
                                        src={whiteboard}
                                        alt="Whiteboard"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold  md:leading-tight leading-snug gradientText"
                                        >
                                            Flexible and Intuitive
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                The Whiteboard is designed for simplicity and ease of use, giving your team the flexibility to work the way they want.
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
                                            Bring Your Ideas to Life with Whiteboard
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-gray-700 text-lg"
                                            >
                                                Transform your ideas into action with the Whiteboard. Start collaborating, planning, and innovating today.
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
