import CookieConsent from 'react-cookie-consent';
import { useRouter } from 'next-nprogress-bar';

const CookieConsentBanner = () => {
    const router = useRouter();

    return (
        <CookieConsent
            location="bottom"
            buttonText="Accept"
            cookieName="myAwesomeCookieConsent"
            style={{ background: "#dbeafe" }}
            buttonStyle={{ fontSize: "13px", background: "#2563eb", color: "#fff" }}
            expires={150}
        >
            <div className="text-slate-800 md:mx-16 text-justify">
                We use cookies to improve your experience and enable essential features.<br />
                By continuing to use this site, you agree to our use of cookies.
                For more info, see,
                our{" "}
                <span className="cursor-pointer text-blue-600 text-semibold" onClick={() => { router.push('/cookie-policy'); }}>
                    Cookie Policy
                </span>
                {" "}and our{" "}
                <span className="cursor-pointer text-blue-600 text-semibold" onClick={() => { router.push('/privacy-policy'); }}>
                    Privacy Policy.
                </span>
                <br />
            </div>
        </CookieConsent>
    );
};

export default CookieConsentBanner;
