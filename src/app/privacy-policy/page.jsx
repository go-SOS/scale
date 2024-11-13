'use client'

const PrivacyPolicy = () => {
    const currentYear = new Date().getFullYear();

    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <div className="shadow-md lg:mx-32 mx-20 lg:my-32 my-16 min-h-[100vh] pb-6">
                <h1 className="text-center font-semibold mt-4 mb-10">
                    Scale Privacy Notice
                </h1>
                <div className="mx-10">
                    <p className="text-justify mb-3 text-[17px]"><strong>Effective Date:</strong> July 2nd, 2024</p>
                    <h2 className="text-justify mb-3 text-[17px] font-semibold">1. Overview</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        Scale is committed to protecting your privacy. This Privacy Notice (“Notice”) describes how Scale processes personal data in connection with our business, including the provision of our website at <a href="https://scale.ac">https://scale.ac</a> (“Website”) and our Services.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        This Notice explains Scale&rsquo;s approach to any Personal Data that we might collect from you, or which we have obtained about you from a third party, and the purposes for which we process your Personal Data in our capacity as a Controller (i.e., when Scale determines the purposes and means of the processing of personal data). It also describes your rights in respect of our processing of your Personal Data.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        We process Personal Data in the countries in which we are established, including the United States, the United Kingdom, and the European Economic Area (“EEA”), and in other countries where third parties that we may use are based.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        While processing Personal Data, we comply with the principles and rules of the EU-U.S. Data Privacy Framework (EU-U.S. DPF) and the UK Extension to the EU-U.S. DPF, and the Swiss-U.S. Data Privacy Framework (Swiss-U.S. DPF) and to the rights of EU, UK, and Swiss individuals.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        By transferring Personal Data to a third party where Scale is acting as a controller, we have the full responsibility that the processing of a third party as a processor takes place under the DPF Principles. Scale shall remain liable under the DPF Principles if its processors process Personal Data in a manner inconsistent with the DPF Principles, unless Scale proves that it is not responsible for the event giving rise to the damage.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        This Notice only applies to the use of your Personal Data by us or on our behalf. It does not apply to:
                    </p>
                    <ul style={{ listStyleType: 'disc' }}>
                        <li className="text-justify mb-3 text-[17px] ml-6">Personal Data collected by third parties during your communications/dealings with those third parties or your use of their products or services (for example, where you follow links to third-party websites over which we have no control).</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">Personal Data processed, stored, or hosted by us when we act as a Processor on behalf of our Customers in the course of providing our Services, in which case the privacy statement of the relevant Customer will apply, and our data processing agreement with such Customer will govern our processing of your Personal Data.</li>
                    </ul>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">2. Personal Data We Collect</h2>
                    <h3 className="text-justify mb-3 text-[17px] font-semibold">2.1 Personal Data that we collect about you.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        Personal Data is any information that relates to an identified or identifiable individual. The Personal Data that you provide directly to us through our Sites and Services will be apparent from the context in which you provide the data. In particular:
                    </p>
                    <ul style={{ listStyleType: 'decimal' }}>
                        <li className="text-justify mb-3 text-[17px] ml-6">When you register for a Scale account we collect your full name, email address, and account log-in credentials.</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">When you fill-in our online form to contact our sales team, we collect your full name, work email, country, and anything else you tell us about your project, needs and timeline.</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">When you respond to Scale emails or surveys we collect your email address, name and any other information you choose to include in the body of your email or responses. If you contact us by phone, we will collect the phone number you use to call Scale. If you contact us by phone as a Scale User, we may collect additional information in order to verify your identity.</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">If you are a Scale User, you will provide your contact details, such as name, postal address, telephone number, and email address. As part of your business relationship with us, we may also receive financial and personal information about you, such as your date of birth and government identifiers associated with you and your organization (such as your social security number, tax number, or Employer Identification Number).</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">If you are a Scale User, you may be asked to provide information about your employees or contractors that you add to Scale. This information may include, but will not be limited to, their name, email address, residential and business address, or bank account information.</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">When we conduct fraud monitoring, prevention, detection, and financial compliance activities or provide such services to our Users, we will receive Personal Data from you (and your device) and about you through our Service and from our business partners, financial service providers, identity verification services, and publicly available sources (e.g., name, address, phone number, country), as necessary to confirm your identity and prevent fraud. Our fraud monitoring, detection and prevention services may collect Personal Data about you and use technology to help us assess the risk associated with an attempted transaction by you with a Scale User.</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">You may also choose to submit information to us via other methods, including: (i) in response to marketing or other communications, (ii) through social media or online forums, (iii) through participation in an offer, program or promotion, (iv) in connection with an actual or potential business relationship with us, or (v) by giving us your business card or contact details at trade shows or other events.</li>
                    </ul>
                    <h3 className="text-justify mb-3 text-[17px] font-semibold">2.2 Information that we collect automatically on our Sites.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        Our Sites use cookies and other technologies to function effectively. These technologies record information about your use of our Sites, including:
                    </p>
                    <ul style={{ listStyleType: 'decimal' }}>
                        <li className="text-justify mb-3 text-[17px] ml-6">Browser and device data, such as IP address, device type, operating system and Internet browser type, screen resolution, operating system name and version, device manufacturer and model, language, plug-ins, add-ons and the language version of the Sites you are visiting;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">Usage data, such as time spent on the Sites, pages visited, links clicked, language preferences, and the pages that led or referred you to our Sites.</li>
                    </ul>
                    <p className="text-justify mb-3 text-[17px]">
                        We also collect information about your online activities on websites and connected devices over time and across third-party websites, devices, apps and other online features and services. We use Google Analytics on our Sites to help us analyze Your use of our Sites and diagnose technical issues.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        To learn more about the cookies that may be served through our Sites and how You can control our use of cookies and third-party analytics, please see our Cookie Policy.
                    </p>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">3. How We Use Personal Data</h2>
                    <h3 className="text-justify mb-3 text-[17px] font-semibold">3.1 Our products and services.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        We rely upon a number of legal grounds to ensure that our use of your Personal Data is compliant with applicable law. We use Personal Data to facilitate the business relationships we have with our Users, to comply with our financial regulatory and other legal obligations, and to pursue our legitimate business interests. We also use Personal Data to complete transactions and deliver the Services to you.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        In particular, we use Personal Data for the following purposes:
                    </p>
                    <ul style={{ listStyleType: 'decimal' }}>
                        <li className="text-justify mb-3 text-[17px] ml-6">To provide you with the information, products and services that you have requested from us;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">To send you service-related emails and messages relating to our products and Services, including the provision of customer support;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">To collect payments from you, where applicable;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">To enable you to access and use our Services; and</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">To ensure the security and integrity of our Services.</li>
                    </ul>

                    <h3 className="text-justify mb-3 text-[17px] font-semibold">3.2 Marketing and events-related communications.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        We may send you email marketing communications about Scale products and services that may be of interest to you, provided that this is in accordance with your marketing preferences. We may also administer promotions or contests, or other promotional activities or events sponsored by us or our partners.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        You can opt out of our marketing communications at any time. If you no longer wish to receive marketing communications from us, you can unsubscribe by clicking on the unsubscribe link in the emails, or by contacting us using the details provided in the “Contact Us” section of this Notice. Please note that if you unsubscribe from marketing communications, you may still receive transactional or administrative messages from us.
                    </p>

                    <h3 className="text-justify mb-3 text-[17px] font-semibold">3.3 Compliance and protection.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        We use Personal Data to comply with applicable laws and regulations, establish or exercise our legal rights, protect our property, defend against legal claims, and detect and prevent fraud and other illegal activities. For example, we may use Personal Data to comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) obligations, and we may use Personal Data to investigate and prevent fraud and other illegal activities.
                    </p>

                    <h3 className="text-justify mb-3 text-[17px] font-semibold">3.4 Data analytics and improvement of our services.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        We use Personal Data that we collect about you to analyze how our Services are being used, to measure the effectiveness of our marketing campaigns, and to improve and optimize our Services. For example, we use Google Analytics on our Sites to analyze how users interact with our Sites and to improve our Sites and Services. We also use Personal Data to develop new products and services.
                    </p>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">4. How We Share Personal Data</h2>
                    <h3 className="text-justify mb-3 text-[17px] font-semibold">4.1 With your consent.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        We may share Personal Data with third parties when we have your consent to do so.
                    </p>

                    <h3 className="text-justify mb-3 text-[17px] font-semibold">4.2 With our service providers.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        We may share Personal Data with our service providers who perform services on our behalf. For example, we may share Personal Data with our hosting providers, payment processors, marketing service providers, and other service providers who help us deliver our Services. These service providers may have access to Personal Data as needed to perform their functions, but they are not permitted to use Personal Data for their own purposes.
                    </p>

                    <h3 className="text-justify mb-3 text-[17px] font-semibold">4.3 For legal reasons.</h3>
                    <p className="text-justify mb-3 text-[17px]">
                        We may share Personal Data with third parties if we believe that disclosure is reasonably necessary to comply with any applicable law, regulation, legal process, or governmental request; to enforce our agreements, policies, and terms of service; to protect the security or integrity of our Services; to protect the property, rights, and safety of Scale, our customers, or the public from harm or illegal activities; or to respond to an emergency which we believe in good faith requires us to disclose information to assist in preventing a death or serious bodily injury.
                    </p>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">5. Your Rights and Choices</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        You have certain rights regarding your Personal Data, subject to local data protection laws. These rights may include:
                    </p>
                    <ul style={{ listStyleType: 'decimal' }}>
                        <li className="text-justify mb-3 text-[17px] ml-6">The right to access your Personal Data held by us;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">The right to rectify inaccurate or incomplete Personal Data;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">The right to delete your Personal Data;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">The right to restrict the processing of your Personal Data;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">The right to data portability;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">The right to object to the processing of your Personal Data;</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">The right to withdraw your consent at any time, if we have collected and processed your Personal Data with your consent; and</li>
                        <li className="text-justify mb-3 text-[17px] ml-6">The right to lodge a complaint with a data protection authority about our collection and use of your Personal Data.</li>
                    </ul>
                    <p className="text-justify mb-3 text-[17px]">
                        If you wish to exercise any of these rights, please contact us using the details provided in the “Contact Us” section of this Notice. We will respond to your request in accordance with applicable data protection laws.
                    </p>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">6. International Data Transfers</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        Scale is a global company and we may transfer Personal Data to countries other than the country in which the data was originally collected. These countries may not have the same data protection laws as the country in which you initially provided the data. When we transfer your Personal Data to other countries, we will protect that data as described in this Notice and in compliance with applicable data protection laws.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        We have implemented appropriate safeguards to ensure that your Personal Data remains protected when it is transferred outside of your country. These safeguards include the use of Standard Contractual Clauses approved by the European Commission and the UK Information Commissioner’s Office, and other lawful mechanisms.
                    </p>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">7. Data Retention</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        We will retain your Personal Data for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements. When we no longer have a legitimate need to process your Personal Data, we will either delete or anonymize it, or, if this is not possible (for example, because your Personal Data has been stored in backup archives), then we will securely store your Personal Data and isolate it from any further processing until deletion is possible.
                    </p>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">8. Security of Your Personal Data</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        We have implemented appropriate technical and organizational measures to protect the Personal Data that we collect and process about you. These measures are designed to provide a level of security appropriate to the risk of processing your Personal Data. We regularly review our security policies and procedures to ensure the security of our systems and your Personal Data.
                    </p>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">9. Updates to This Privacy Notice</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        We may update this Privacy Notice from time to time in response to changing legal, technical, or business developments. When we update our Privacy Notice, we will take appropriate measures to inform you, consistent with the significance of the changes we make. We will obtain your consent to any material Privacy Notice changes if and where this is required by applicable data protection laws.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        You can see when this Privacy Notice was last updated by checking the “last updated” date displayed at the top of this Privacy Notice.
                    </p>

                    <h2 className="text-justify mb-3 text-[17px] font-semibold">10. Contact Us</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        If you have any questions or concerns about this Privacy Notice or our privacy practices, please contact us at:
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        Email: contact@scale.ac
                    </p>
                </div>
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

export default PrivacyPolicy;
