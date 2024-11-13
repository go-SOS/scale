'use client';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";

const Page = () => {

    return (
        <>
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow md:mx-32 mb-24">
                    <div className="mt-10">

                        {/* Changelog Section */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-3xl font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Changelog
                                        </h1>
                                        {/* Changelog Content */}
                                        <div className="text-lg text-gray-700">
                                            <h2 className="font-semibold mb-2">22nd September 2024</h2>
                                            <ul className="list-disc list-inside mb-6">
                                                <li>New Feature: Team members can now view only their allocated projects, ensuring focused access.</li>
                                                <li>Enhanced Project Assignment: One team member and an admin can now be assigned to different projects.</li>
                                                <li>Bug Fix: Resolved the issue with Twitter Sign-In, ensuring smoother authentication.</li>
                                            </ul>

                                            <h2 className="font-semibold mb-2">16th September 2024</h2>
                                            <ul className="list-disc list-inside mb-6">
                                                <li>New Feature: Introduced <strong>Video Conferencing</strong>, allowing seamless, real-time communication for teams.</li>
                                                <li>New Feature: Added <strong>Text Chat</strong> functionality for in-depth conversations during or outside of calls.</li>
                                            </ul>

                                            <h2 className="font-semibold mb-2">14th September 2024</h2>
                                            <ul className="list-disc list-inside mb-6">
                                                <li>New Feature: Added a <strong>Contact Page</strong> for easier communication with the support team.</li>
                                            </ul>
                                        </div>
                                        {/* End of Changelog Content */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Changelog Section */}

                    </div>
                </div>
                <Footer />
            </div >
        </>
    );
}

export default Page;
