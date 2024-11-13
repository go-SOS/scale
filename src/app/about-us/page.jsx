'use client';
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";
import planning_board from '@/img/pages/planning_board.PNG'; 
import planning_gantt from '@/img/pages/planning_gantt.PNG'; 
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
                <div className="flex-grow md:mx-32 mb-24">
                    <div className="mt-10">

                        {/* About Section */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-4xl font-semibold md:text-5xl md:leading-tight leading-snug gradientText"
                                        >
                                            About Scale
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-lg text-gray-700 text-justify"
                                            >
                                                Scale is designed to streamline your work, project and task management process. With features that allow you to create, organize, and collaborate on tasks seamlessly, we aim to make project management more efficient and enjoyable.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={planning_gantt}
                                        alt="About Scale"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* About Section */}

                        {/* Main Section */}
                        <div className="mt-24">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <Image
                                        className="rounded-2xl shadow-lg border-2 border-blue-600"
                                        src={planning_board}
                                        alt="Our Mission"
                                    />
                                </div>
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 md:ml-2 md:mr-2">
                                        <h1
                                            className="mb-6 text-[26px] md:text-[32px] font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Our Mission
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <p
                                                className="mb-8 text-lg text-gray-700 text-justify"
                                            >
                                                At Scale, our mission is to make work, project and task management easier by providing an intuitive platform that simplifies task organization, enhances team collaboration, and drives project success.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Main Section */}



                        {/* Final Call-to-Action Section */}
                        <div className="mt-24">
                            <div className="mx-4 md:mx-16">
                                <div className="text-center text-xl md:text-2xl mt-20">
                                    <h3 className="leading-tight font-semibold gradientText">
                                        Discover How Scale Can Transform Your Work, Project and Task Management
                                    </h3>
                                </div>
                                <div className="mt-6 flex justify-center text-gray-700">
                                    <p className="max-w-3xl text-lg">
                                        Learn more about how our platform can help you stay organized, collaborate effectively, and drive your projects to success.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Final Call-to-Action Section */}

                    </div>
                </div>
                <Footer />
            </div >
        </>
    );
}

export default Page;
