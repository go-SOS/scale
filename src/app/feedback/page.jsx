'use client'
import React, { useEffect } from "react";
import Navbar from "@/components/home/topNavbar";
import Footer from "@/components/home/footer";
import FeedbackForm from "./feedbackForm";

const Page = () => {


    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow">
                    <div className="mt-10">
                        <FeedbackForm />
                    </div>
                </div>
                <div className="mt-32">
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Page;
