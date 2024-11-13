'use client';
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";

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

                        {/* Contact Section */}
                        <div className="mt-32">
                            <div className="mx-4 md:mx-16 flex flex-col md:flex-row">
                                <div className="mt-8 md:mt-0 md:ml-8 text-base md:w-1/2">
                                    <div className="pb-3 text-left md:pb-4 mt-2 md:ml-20 md:mr-2">
                                        <h1
                                            className="mb-6 text-3xl font-semibold md:leading-tight leading-snug gradientText"
                                        >
                                            Contact Us
                                        </h1>
                                        <div className="mx-auto max-w-3xl">
                                            <div className="bg-white">
                                                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                                                <p className="text-lg text-gray-700 mb-2">
                                                    <strong>Email:</strong> contact@scale.ac
                                                </p>
                                                <p className="text-lg text-gray-700 mb-2">
                                                    <strong>Location:</strong> Burlingame, CA 94010
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Contact Section */}

                        {/* Final Call-to-Action Section */}
                        <div className="mt-24">
                            <hr />
                            <div className="mx-4 md:mx-16">
                                <div className="text-center text-xl md:text-2xl mt-20">
                                    <h3 className="leading-tight font-semibold gradientText">
                                        We're Here to Help
                                    </h3>
                                </div>
                                <div className="mt-6 flex justify-center text-gray-700">
                                    <p className="max-w-3xl text-lg">
                                        Feel free to reach out with any questions, concerns, or feedback. We value your input and are here to assist you.
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
