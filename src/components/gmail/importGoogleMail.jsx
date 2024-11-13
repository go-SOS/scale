"use client";
import GoogleBtn from "./googleBtn";
import { GoogleOAuthProvider } from "@react-oauth/google";

function GoogleMail() {
    const googleClientId = process.env.NEXT_GOOGLE_CLIENT_ID;

    return (
        <div className="container">
            <GoogleOAuthProvider clientId={googleClientId}>
                <div>
                    <GoogleBtn />
                </div>
            </GoogleOAuthProvider>
        </div>
    );
}

export default GoogleMail;
