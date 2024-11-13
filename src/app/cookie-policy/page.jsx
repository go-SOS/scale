'use client'

const CookiesPolicyPage = () => {
    const currentYear = new Date().getFullYear();

    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <div className="shadow-md lg:mx-32 mx-20 lg:my-32 my-16 min-h-[100vh] pb-6">
                <h1 className="text-center font-semibold mt-4 mb-10">
                    Scale Cookie Policy
                </h1>
                <p className="text-justify mb-3 text-[17px] mx-10"><strong>Effective Date:</strong> July 2nd, 2024</p>
                <main className="text-gray-800 mx-10">
                    <p className="text-justify mb-3 text-[17px]">
                        This cookie policy describes how Scale (“Scale”) uses “cookies” and other similar technologies in connection with our Site and Services. Any capitalized term used and not otherwise defined below has the meaning assigned to it in the Privacy Policy.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">1. What is a Cookie?</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        Cookies are small text files that are stored in a computer’s browser directory. They help site providers with things like understanding how people use a site, remembering a User’s login details, and storing site preferences.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">2. Does Scale use Cookies?</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        Yes. We use cookies in accordance with our Privacy Policy to:
                    </p>
                    <ul className="list-disc ml-8 mb-6">
                        <li>Ensure that our Services function properly,</li>
                        <li>Detect and prevent fraud,</li>
                        <li>Understand how visitors use and engage with our Site, and</li>
                        <li>Analyze and improve Services.</li>
                    </ul>

                    <h2 className="text-lg font-semibold mb-3">3. Who sets cookies when I use Scale’s Site?</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        There are two main types of cookies that can be set:
                    </p>
                    <h3 className="text-lg font-semibold mb-3">3.1 First party cookies</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        These cookies are placed and read by Scale directly when you use our Services.
                    </p>
                    <h3 className="text-lg font-semibold mb-3">3.2 Third party cookies</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        These cookies are not set by Scale, but by other companies, like Google, for site analytics purposes. See further details below on how to manage these cookies.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">4. How Scale Uses Cookies?</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        Cookies play an important role in helping us provide effective and safe Services. Below is a list of commonly used cookies and the purposes that apply to them. This list is not exhaustive and describes the main reasons why we typically use cookies.
                    </p>
                    <h3 className="text-lg font-semibold mb-3">4.1 Necessary Cookies</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        Some cookies are essential to the operation of our Site and Services and make it usable and secure by enabling basic functions like page navigation and access to secure areas of the Site. We use those cookies in a number of different ways, including:
                    </p>
                    <ul className="list-disc ml-8 mb-6">
                        <li>Authentication: To remember your login state so you don’t have to log in as you navigate through our Site and dashboard.</li>
                        <li>Fraud Prevention and Detection: Cookies and similar technologies that we deploy through our Site help us learn things about computers and web browsers used to access the Services. This information helps us monitor for and detect potentially harmful or illegal use of our Services.</li>
                        <li>Security: To protect user data from unauthorized access.</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-3">4.2 Preference Cookies</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        Preference cookies are used by Scale to remember your preferences and to recognize you when you return to our Services.
                    </p>

                    <h3 className="text-lg font-semibold mb-3">4.3 Analytics Cookies</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        Analytics cookies help us understand how visitors interact with our Services. We use those cookies in a number of different ways, including:
                    </p>
                    <ul className="list-disc ml-8 mb-6">
                        <li>Site Features and Services: To remember how you prefer to use our Services so that you don’t have to reconfigure your settings each time you log into your account.</li>
                        <li>To Analyze and Improve Our Services: To make our Site and Services work better for You. Cookies help us understand how people reach our Site and our Users’ sites. They give us insights into improvements or enhancements we need to make to our Site and Services.</li>
                        <li>Pixel tags (also known as web beacons and clear GIFs): May be used in connection with some Services to, among other things, track the actions of Users (such as email recipients), measure the success of our marketing campaigns and compile statistics about usage of the Services and response rates.</li>
                        <li>Third Party Analytics: Through Google Analytics in order to collect and analyze information about the use of the Services and report on activities and trends. This service may also collect information regarding the use of other sites, apps, and online resources. You can learn about Google’s practices on the Google website. See further details below on how to manage these cookies.</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-3">4.4 Advertising Cookies</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        We and our service providers will use cookies and similar technologies on scale.ac to direct Scale ads to you through targeted advertisements for Scale Services on other sites you visit and to measure your engagement with those ads.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">5. Can I opt-out?</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        Yes, with the exception of those cookies that are necessary to provide you with our Services. Your web browser may allow you to manage your cookie preferences, including to delete and disable Scale cookies. You can take a look at the help section of your web browser or follow the links below to understand your options. If you choose to disable cookies, some features of our Site or Services may not operate as intended.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">6. How to Contact Us</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        If you have any questions or concerns about our use of cookies, please contact us at:
                    </p>
                    <ul className="list-disc ml-8 mb-6">
                        <li>Email: contact@scale.ac</li>
                    </ul>
                </main>
            </div>
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center justify-center flex-1 ml-[20vw]">
                    <span className="text-slate-700 text-sm cursor-pointer">
                        &copy; Scale {currentYear}. All rights reserved.
                    </span>
                </div>
                <div className="flex justify-end items-end">
                    <div>
                        <span className="text-slate-700 text-sm cursor-pointer mr-3" onClick={() => {
                            openInNewTab('/terms-of-service')
                        }}>
                            Terms of Service
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-700 text-sm cursor-pointer mr-3" onClick={() => {
                            openInNewTab('/privacy-policy')
                        }}>
                            Privacy Policy
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-700 text-sm cursor-pointer mr-6" onClick={() => {
                            openInNewTab('/cookie-policy')
                        }}>
                            Cookie Policy
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CookiesPolicyPage;
