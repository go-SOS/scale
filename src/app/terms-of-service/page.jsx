'use client'

const TermsOfService = () => {
    const currentYear = new Date().getFullYear();

    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <div className="shadow-md lg:mx-32 mx-20 lg:my-32 my-16 min-h-[100vh] pb-6">
                <h1 className="text-center font-semibold mt-4 mb-10">
                    Scale Terms of Service
                </h1>
                <p className="text-justify mb-3 text-[17px] mx-10"><strong>Effective Date:</strong> July 2nd, 2024</p>
                <main className="text-gray-800 mx-10">
                    <p className="text-justify mb-3 text-[17px]">
                        BY ACCEPTING THIS AGREEMENT OR ACCESSING OR USING THE SERVICE, YOU ARE AGREEING TO THE TERMS AND CONDITIONS OF THIS AGREEMENT.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        IF YOU ARE USING ANY SERVICE AS AN EMPLOYEE, AGENT, OR CONTRACTOR OF A CORPORATION, PARTNERSHIP OR SIMILAR ENTITY, THEN YOU REPRESENT AND WARRANT THAT YOU HAVE THE AUTHORITY TO SIGN FOR AND BIND SUCH ENTITY IN ORDER TO ACCEPT THE TERMS OF THIS AGREEMENT. THE RIGHTS GRANTED UNDER THIS AGREEMENT ARE EXPRESSLY CONDITIONED UPON ACCEPTANCE BY SUCH AUTHORIZED PERSONNEL.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">Modifications to this Agreement:</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        From time to time, Scale may modify this Agreement. Unless otherwise specified by Scale, changes become effective for Customer upon renewal of the then-current Subscription Term or entry into a new Service Order Form after the updated version of this Agreement goes into effect. Scale will use reasonable efforts to notify Customer of the changes through communications via Customer’s Account, email or other means.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        The “Effective Date” of this Agreement is the date which is the earlier of (a) Customer’s initial access to any Service through any online provisioning, registration or order process or (b) the effective date of the first Service Order Form, as applicable, referencing this Agreement. This Agreement will govern Customer’s initial purchase on the Effective Date as well as any future purchases made by Customer that reference this Agreement.
                    </p>
                    <p className="text-justify mb-3 text-[17px]">
                        These Terms of Service (the “Agreement”) is entered into by and between Scale Inc., a California corporation ("Scale" or “Provider”) and the person or entity placing an order for or accessing the Service (“Customer” or “you”). In consideration of the terms and conditions set forth below, the parties agree as follows:
                    </p>



                    <h2 className="text-lg font-semibold mb-3">1. Provision of Service.</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        Scale will make the Services and Software available to Customer pursuant to this Agreement, the Supplemental Terms (where applicable), the applicable SOF, and the Documentation, and provide such Services in accordance with this Agreement, including the Data Processing Addendum (“DPA”), the Professional Services Agreement (“PSA”), the BAA, if applicable (as defined below), the laws and government regulations applicable to Scale business, during each Subscription Term, and if applicable, the Privacy Notice.  During the Subscription Term, Scale grants to Customer a limited, non-exclusive right to access and use the Services and Software only for its internal business purposes, for up to the number of Users included in the Service Plan or otherwise noted in the SOF, including the right to download, install, and use the Mobile Apps in connection with the authorized use of the Services.
                    </p>


                    <h2 className="text-lg font-semibold mb-3">2. Responsibilities of Customer</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. Customer Account.</b> Customer may need to register for an Account in order to place orders or access or receive the Services. Customer agrees to keep its Account information current, accurate, and complete so that Scale may send notices, statements, and other information to Customer via email or through its Account, which notifications will be subject to this Agreement and the Privacy Notice. Customer will be responsible for maintaining the confidentiality of User login information and credentials for accessing the Services and will notify Scale promptly of any loss, misuse, or unauthorized disclosure of such login information and/or credentials of which Customer becomes aware. Scale and its Affiliates will not be liable for any damage or loss that may result from Customer’s breach of the foregoing obligations.
                        <br />
                        <b>b. Data and Information.</b> Additionally, we are not responsible for any losses you may experience while using our software, regardless of the situation.
                        <br />
                    </p>


                    <p className="text-justify mb-3 text-[17px]">
                        <b>c. Acceptable Use.</b>  Customer may only use the Services in accordance with the Documentation, subject to the use limitations indicated in any Service Order Form pursuant to which Customer subscribes to the Services, and the terms of this Agreement. Customer agrees to comply with the Scale Acceptable Use and Conduct Policy (as defined below) which is hereby incorporated into this Agreement.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">3. Customer Data</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. Use of Customer Data.</b> As between the parties, Customer and its licensors retain all right, title, and interest (including any and all intellectual property rights) in and to the Customer Data and any modifications made thereto in the course of the operation of the Scale Technology. Subject to the terms of this Agreement, Customer hereby grants to Scale and its Affiliates a non-exclusive, worldwide, royalty-free right to process the Customer Data solely to the extent necessary to provide, maintain, and improve the Scale Technology and perform all related obligations owed to Customer under this Agreement, or as may be required by law. Customer is solely responsible for the accuracy, content, and legality of all Customer Data. Customer warrants that Customer has and will have sufficient rights in the Customer Data to grant the rights to Scale under this Agreement. If Customer is subject to the US Health Insurance Portability and Accountability Act of 1996 and its implementing regulations (“HIPAA”), Customer may not upload protected health information (“PHI”) as defined by HIPAA, unless Customer has entered into a business associate agreement with Scale, which will govern the parties’ respective obligations with respect to any PHI uploaded by Customer to the Services, Software, or Mobile Apps (“BAA”).
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>b. Data Security.</b> The parties will comply with the terms of the DPA, which is incorporated into this Agreement by this reference, with respect to the provision and processing of Personal Data as defined in the DPA. Scale will use appropriate technical and organizational measures in the Services to protect the Customer Data from unauthorized access, processing, loss, or disclosure. Scale measures are designed to provide a level of security appropriate to the risk of processing the Customer Data within the Services. Customer understands that Scale and its Affiliates will process Customer Data in accordance with applicable data protection laws, this Agreement, including the DPA, and the Privacy Notice.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">4. Intellectual Property.</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. Ownership Rights.</b> Customer Data is Customer’s Confidential Information under this Agreement. Customer and its licensors retain all right, title, and interest in and to the Customer Data and all of Customer’s Confidential Information provided under this Agreement, and Scale obtains no rights in the foregoing except for the express rights granted in this Agreement and the Privacy Notice. Scale and its licensors retain all right, title, and interest in and to Scale Technology and Usage Data (as defined below). Customer acknowledges that the Services are offered as online, hosted solutions, and that Customer has no right to obtain a copy of the underlying computer code for any Services, except (if applicable) for any downloadable Software, in object code format. Scale may freely use and incorporate into Scale products and services any suggestions, enhancement requests, recommendations, corrections, or other feedback provided by Customer or by any Users or End Users relating to Scale products or services. Feedback and any other suggestions are provided by Customer exclusively “AS IS,” in Customer’s sole discretion, and will not be used by Scale in any way that identifies or permits identification of Customer, its Affiliates, Users, or End Users. Customer agrees that its name, logo, and/or use case may be used by Scale in marketing materials (“Promotional Materials”). Promotional Materials may be for both internal and/or external purposes of Scale and such rights granted herein shall be worldwide, perpetual, and in any media. Customer may request that Scale stop the use of Promotional Materials of Customer by submitting an email to contact@scale.ac at any time. It may take us up to thirty (30) days to process a request.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>b. Usage Data.</b> Notwithstanding anything to the contrary in this Agreement, Scale may collect and use any data that is gathered in or derived from the use of the Services (“Usage Data”) to develop, improve, support, and operate its products and services. Scale shall not share with a third party any Usage Data that includes Customer’s Confidential Information except (i) in accordance with Section 8 (Confidentiality) of this Agreement, or (ii) to the extent the Usage Data is aggregated and anonymized such that the data no longer directly identifies Customer or Customer’s Users.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>c. Updates.</b> Scale may modify the Services, Software, and Service Plans from time to time, including by adding or removing features, functions, and entitlements; provided, however, that (i) Scale will not materially decrease the overall functionality of the Services or Software during Customer’s Subscription Term, except where such modifications are required for data security reasons or to comply with applicable law and (ii) any such modifications are made on a prospective and nondiscriminatory basis. Such modifications to any Services, Service Plans, or Software are subject to this Agreement. Customer agrees that its purchase to subscriptions of the Services and Software is neither contingent upon the delivery of any future functionality or features, nor dependent upon any oral or written comments made by Scale with respect to future functionality or features.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">5. Fees and Payment.</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. Fees and Payment.</b> All charges associated with Customer’s Account (“Fees”) are set forth in the applicable SOF or Website. For credit card payments, the payment is due immediately upon receipt of invoice. Customer hereby authorizes Scale or our authorized agents, as applicable, to bill your credit card upon subscription to the Services (and any renewal thereof). For payments through other accepted methods, payment is due and payable in full within thirty (30) days from the invoice date or as stated in the applicable SOF. Payment obligations are non-cancelable, regardless of utilization by the Customer and except as expressly permitted in this Agreement, Fees paid are non-refundable. Customer will pay the Fees through an accepted payment method as specified in the applicable SOF or Website. Unless otherwise set forth in the SOF, Customer’s subscription to the Services will renew automatically for a Subscription Term in accordance with the renewal terms and conditions set forth in Section 6(b) below. During the Subscription Term, the Customer shall not: (i) reduce their User count, or (ii) downgrade their Service Plan.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>b. Late Payments.</b> If undisputed Fees are more than thirty (30) days overdue, then, following written notification from Scale, Scale may suspend Customer’s access to the Scale Technology, including, without limitation, Customer’s Account, until such unpaid Fees are paid in full.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>c. Payment Disputes.</b> Scale will not exercise its rights under Section 5(b) (Late Payments), Section 6(c)(i) (Suspension of Service), or Section 6(d) (Termination for Cause) with respect to non-payment by Customer if Customer is disputing the applicable charges reasonably and in good faith and is cooperating diligently to resolve the dispute. If the parties are unable to resolve such a dispute within thirty (30) days, Scale will have the right to seek any remedies it may have under this Agreement, at law or in equity, irrespective of any terms that would limit remedies on account of a dispute. For clarity, any undisputed amounts must be paid in full.
                    </p>


                    <p className="text-justify mb-3 text-[17px]">
                        <b>e. Orders by Affiliates.</b> Customer’s Affiliates may purchase Services directly from Scale by executing an SOF which is governed by the terms of this Agreement. Such SOF will establish a new and separate agreement between the Customer’s Affiliate and the Scale entity signing such SOF. If the Affiliate resides in a different country than Customer, then the SOF may include modifications to terms applicable to the transaction(s) (including but not limited to tax terms and governing law).
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>f. Purchases from Channel Partners.</b> Customer may procure use of any Services, Software, or Mobile Apps from a third-party authorized reseller of Scale, including third-party marketplaces (“Channel Partner”) pursuant to a separate agreement with the Channel Partner. Customer’s use of any Services, Software, or Mobile Apps procured through a Channel Partner will be subject to the terms of this Agreement, and all fees payable (including all applicable Taxes) for such use will be payable to the Channel Partner pursuant to the terms agreed to between Customer and Channel Partner. Customer understands and agrees that, if Customer purchased the Services, Software, or Mobile Apps subscriptions via a Channel Partner, service credits and refunds payable under this Agreement may be payable or applied by Channel Partner acting on behalf of Scale in proportion to the fees paid by Customer to the Channel Partner, and the discharge by the Channel Partner of such obligations will relieve Scale of the same under this Agreement.
                    </p>


                    <h2 className="text-lg font-semibold mb-3">6. Term, Termination and Suspension.</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. Term.</b> This Agreement is effective as of the Effective Date (or, for online Customers, the date of sign up on the Website) and will continue through the then-current Subscription Term. Service Plans commence on the start date specified in the relevant SOF (or, for online Customers, the date of sign up on the Website) and continue for the Subscription Term specified therein.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>b. Renewal.</b> Unless a party gives written notice of non-renewal or downgrade at least sixty (60) days’ prior to the expiration of the relevant Subscription Term, Service Plans will automatically renew at the same number of Users and at the same Service Plan (including any add-ons), for a period equal to the previous Subscription Term. Scale reserves the right to increase the Fees at the beginning of each Subscription Term, including any automatically renewed term. Any Fees for a renewed Subscription Term are due upon the date of renewal.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>c. Suspension.</b> Scale may suspend Customer’s access to the Services, Software, Mobile Apps and/or Customer’s Account, on the following grounds: (i) late payment/non-payment of undisputed Fees, per the process noted in Section 5(b) above; (ii) non-renewal of the Services by Customer; (iii) Customer’s or its Users’ breach of Section 2 (Use Restrictions); or (iv) in the event suspension is deemed necessary by Scale to prevent or address the introduction of Malicious Software (as defined in Section 9.b below), a security incident, or other harm to Customer, Scale, or Scale other customers. Scale will notify Customer of any such suspension. Scale will use diligent efforts to attempt to limit, where commercially feasible, the suspension to affected Users or Scale Technology, and will immediately restore the availability of the same as soon as the issues leading to the suspension are resolved. Such suspension will in no way affect Customer’s other obligations under this Agreement.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>d. Termination for Cause.</b> Either party may terminate this Agreement by written notice to the other party in the event that (i) such other party materially breaches this Agreement and does not cure such breach within thirty (30) days of such notice, or (ii) immediately in the event the other party becomes the subject of a petition in bankruptcy or any other proceeding relating to insolvency, receivership, liquidation or assignment for the benefit of creditors.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>e. Free Trial Customers.</b> Upon the expiration of Customer’s free trial, Scale may immediately suspend Customer’s access to the free trial Services. Customer must export Customer Data before the end of the free trial or Customer Data will be permanently deleted. Notwithstanding anything to the contrary in this Agreement, Scale will have no obligation to maintain, store, or otherwise retain Customer Data beyond the end of the free trial period.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">7. Data Export and Retention.</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        Upon termination or expiration of this Agreement or any SOF for any reason, Customer’s access to the Services, Software, Mobile Apps, APIs, and other Scale Technology will terminate. Scale strongly recommends that Customer export all Customer Data before Customer closes Customer’s Account. Scale will make Customer Data available for export for fourteen (14) days from the effective date of the closure of Customer’s Account due to: (i) the termination or expiration of this Agreement, or (ii) termination or expiration the applicable SOF (“Data Export Period”). Where Customer Data is retained by Scale and can be exported, and provided that Customer is current on its payment obligations as described in Section 5, Customer may contact Scale within the Data Export Period at contact@scale.ac to have Scale export Customer’s Customer Data. Beyond such Data Export Period, Scale reserves the right to retain Customer data for up to three (3) months before deleting all Customer Data in the normal course of operation except as necessary to comply with Scale legal obligations, maintain accurate financial and other records, resolve disputes, and enforce its agreements. Customer Data cannot be recovered once it is deleted.
                    </p>



                    <h2 className="text-lg font-semibold mb-3">9. Warranties/Disclaimer of Warranties.</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. Service Warranty.</b> Scale warrants that the Services, Software, or Mobile Apps will perform in all material respects in accordance with the Documentation. Provided that Customer provides written notice of a claim within thirty (30) days after first becoming aware of a breach of the foregoing warranty, Scale will use diligent efforts to correct the Services, Software, or Mobile Apps so the foregoing warranty is met, and if Scale is unable to make such corrections in a timely manner, either party may terminate the applicable SOF, and Customer, as its sole and exclusive remedy, will be entitled to receive a refund of any unused Fees that Customer has pre-paid for the applicable Services, Software, or Mobile Apps purchased thereunder. This warranty will not apply if the error or non-conformance was caused by Customer’s breach of this Agreement or Customer’s or its Users’ misuse of the Services, Software, and Mobile Apps, modifications to the Services, Software, and Mobile Apps by anyone other than Scale or its representatives, or third-party hardware, software, or services used in connection with the Services, Software, and Mobile Apps.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>b. Malware Warranty.</b> Scale warrants that the Services hosted by Scale will be monitored using commercially available means to attempt to detect and prevent the introduction of any computer instructions, circuitry or other technology means whose purpose or effect is to disrupt, damage or interfere with the authorized use of, or allow access to, the computer and communications facilities or equipment of Scale or Customer, including, without limitation, any code containing viruses, Trojan horses, worms, backdoors, trap doors, time-out devices, or similar destructive or harmful code or code that self-replicates (collectively, “Malicious Software”).
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>c. Warranty Disclaimer.</b> EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, NEITHER PARTY MAKES ANY OTHER WARRANTIES, EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, AND ALL SUCH WARRANTIES ARE HEREBY DISCLAIMED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, TITLE, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                    </p>

                    <h2 className="text-lg font-semibold mb-3">10. Indemnification</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. Indemnification by Scale.</b> This section states Scale entire liability and Customer’s exclusive remedy with respect to an IP Claim. Scale will defend Customer, and its officers, directors, and employees against any Claim, from any third party claim alleging that Customer’s use of the Scale Technology accessed or used in accordance with this Agreement infringes such third party’s patent, copyright and/or trademark intellectual property rights (an “IP Claim”), and will indemnify and hold harmless Customer from and against any damages and costs awarded against Customer, or agreed in settlement by Scale (including reasonable attorneys’ fees) resulting from such IP Claim. Scale will have no liability or obligation with respect to any IP Claim if such claim is caused in whole or in part by (i) unauthorized use of the Scale Technology by Customer, its Affiliates or Users; (ii) modification of the Scale Technology by anyone other than Scale or its representatives; or (iii) the combination, operation, or use of the Scale Technology with other data, hardware, or software not provided by Scale. If Customer’s use of the Scale Technology results (or in Scale opinion is likely to result) in an IP Claim, Scale may at its own option and expense (a) procure for Customer the right to continue using the foregoing items as set forth hereunder; (b) replace or modify them to make them non-infringing; or (c) if options (a) or (b) are not commercially reasonable as determined by Scale, then either Customer or Scale may terminate Customer’s subscription to the Service, whereupon Scale will refund Customer, on a pro-rated basis, any Fees Customer has previously paid Scale for the corresponding unused portion.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>b. Indemnification by Customer.</b> Customer will defend Scale and its Affiliates from any third party claim (“Claim”), and will indemnify and hold harmless Scale and its Affiliates from and against any damages and costs awarded against Scale and its Affiliates, or agreed in settlement by Customer (including reasonable attorneys’ fees) resulting from such Claim, to the extent caused by: (i) Customer’s or its Affiliate’s unauthorized supply, disclosure, or processing of Customer Data, including Personal Data therein, (ii) Customer’s or its Affiliate’s violation of laws applicable to Customer’s or its Affiliate’s business.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>c. Indemnification Procedures.</b> In the event of a potential indemnity obligation under this Section 10, the indemnified party will: (i) promptly notify the indemnifying party in writing of the claim, (ii) allow the indemnifying party the right to control the investigation, defense and settlement (if applicable) of such claim at the indemnifying party’s sole cost and expense, and (iii) upon request of the indemnifying party, provide all necessary cooperation at the indemnifying party’s expense. Failure by the indemnified party to notify the indemnifying party of a claim under this section will not relieve the indemnifying party of its obligations under this Section, however, the indemnifying party will not be liable for any litigation expenses that the indemnified party incurred prior to the time when notice is given or for any damages and/or costs resulting from any material prejudice caused by the delay or failure to provide notice to the indemnifying party in accordance with this section. The indemnifying party may not settle any claim that would bind the indemnified party to any obligation (other than payment covered by the indemnifying party or ceasing to use infringing materials) or require any admission of fault by the indemnified party, without the indemnified party’s prior written consent, such consent not to be unreasonably withheld, conditioned, or delayed. Any indemnification obligation under this Section 10 will not apply if the indemnified party settles or makes any admission with respect to a claim without the indemnifying party’s prior written consent.
                    </p>


                    <h2 className="text-lg font-semibold mb-3">11. Limitation of Liability</h2>
                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. SUBJECT TO APPLICABLE LAW AND NOTWITHSTANDING ANYTHING ELSE IN THIS AGREEMENT, IN NO EVENT WILL EITHER PARTY BE LIABLE FOR SPECIAL, INCIDENTAL, INDIRECT OR CONSEQUENTIAL DAMAGES (INCLUDING WITHOUT LIMITATION DOWNTIME COSTS, LOSS OF DATA, RESTORATION COSTS, LOST PROFITS, OR COST OF COVER) REGARDLESS OF WHETHER SUCH CLAIMS ARE BASED ON CONTRACT, TORT, WARRANTY OR ANY OTHER LEGAL THEORY.
                        </b>
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>b. EXCEPT FOR AN ACTION BROUGHT FOR GROSS NEGLIGENCE, WILLFUL MISCONDUCT, FRAUD OR A PARTY’S INDEMNIFICATION OBLIGATIONS, EACH PARTY’S AGGREGATE LIABILITY AND THAT OF ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, SUPPLIERS, AND LICENSORS, UNDER THIS AGREEMENT WILL NOT EXCEED THE FEES RECEIVED BY OR PAYABLE TO SCALE IN THE APPLICABLE SOF IN THE TWELVE MONTHS PRECEDING THE CLAIM.
                        </b>
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>c. THE PARTIES AGREE THAT THIS SECTION 11 WILL APPLY REGARDLESS OF THE FORM OF ACTION, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE AND WILL APPLY EVEN IF ANY LIMITED REMEDY SPECIFIED IN THIS AGREEMENT IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE. THE APPLICABLE MONETARY CAP SET FORTH IN THIS SECTION WILL APPLY ACROSS THIS AGREEMENT AND ANY AND ALL SEPARATE AGREEMENT(S) ON AN AGGREGATED BASIS, WITHOUT REGARD TO WHETHER ANY INDIVIDUAL CUSTOMER AFFILIATES HAVE EXECUTED A SEPARATE SOF.
                        </b>
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>d. CUSTOMER UNDERSTANDS AND AGREES THAT THE PRIMARY INTENT OF SECTION 11 IS TO DISTRIBUTE THE RISKS ASSOCIATED WITH THIS AGREEMENT BETWEEN BOTH PARTIES. THIS LIMITS POSSIBLE LIABILITIES, TAKING INTO ACCOUNT THE COST OF THE FEES. IF SCALE WERE TO TAKE ON ADDITIONAL LIABILITY BEYOND WHAT IS SPECIFIED IN THIS AGREEMENT, THE FEES WOULD HAVE BEEN MARKEDLY HIGHER.
                        </b>
                    </p>


                    <h2 className="text-lg font-semibold mb-3">12. Miscellaneous</h2>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>a. Use of Third Parties for Payment Processing.</b> Scale may use a third-party service provider to manage payment processing provided that such service provider is not permitted to store, retain, or use Customer’s payment account information except to process Customer’s payment information for Scale. Customer must notify Scale of any change in Customer’s payment account information, either by updating Customer’s Account or by emailing Scale at contact@scale.ac.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>b. Assignment.</b> Neither party may assign any of its rights or obligations hereunder, whether by operation of law or otherwise, without the other party’s prior written consent (not to be unreasonably withheld); provided, however, either party may assign this Agreement in its entirety (including all SOFs), without the other party’s consent to its Affiliate or in connection with a merger, acquisition, corporate reorganization, or sale of all or substantially all of its assets. Any attempted assignment in violation of this section will be null and void.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>c. Entire Agreement.</b> This Agreement, together with any SOF, the Privacy Notice, the DPA, and Supplemental Terms, constitutes the entire agreement and supersedes any and all prior agreements or communications between Customer and Scale, including but not limited to Customer registration forms and purchase orders, regarding the subject matter hereof. In the event of a conflict between the Privacy Notice, the Supplemental Terms, or any SOF and this Agreement, the order of precedence will be, first, the Privacy Notice, second, the SOF, third, the Supplemental Terms, and fourth the DPA, and fifth this Agreement. If any provision in this Agreement is held by a court of competent jurisdiction to be unenforceable, such provision will be modified by the court and interpreted so as to best accomplish the original provision, and the remaining provisions of this Agreement will remain in effect.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>d. Relationship of the Parties.</b> The parties are independent contractors. This Agreement does not create a partnership, franchise, joint venture, agency, fiduciary or employment relationship among the parties.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>e. Survival.</b> Sections 2.b (Use Restrictions), 4 (Intellectual Property), 5 (Fees and Payment), 6 (Term, Termination and Suspension), 8 (Confidentiality), 9.c (Warranty Disclaimer), 10 (Indemnification), 11 (Limitation of Liability), 12.c (Entire Agreement), 12.f (Survival), 12.g. (Notices), 12.j (Governing Law), 12.k (Dispute Resolution), and 13 (Definitions) will survive any termination of the Agreement. Termination of this Agreement will not limit either party’s liability for obligations accrued as of or prior to such termination or for any breach of this Agreement.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>f. Notices.</b> All notices to be provided by one party to the other under this Agreement may be delivered in writing by (i) nationally recognized overnight delivery service or US mail to the mailing address provided on the SOF; or (ii) electronic mail to the email address provided for Customer’s Account. The address for a notice to Scale is: Scale Inc., CA with a copy to contact@scale.ac by electronic mail. All notices will be deemed to have been given immediately upon delivery by electronic mail, or if otherwise delivered upon receipt or, if earlier, five (5) business days after being deposited in the mail or with a courier as permitted above.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>g. Anti-Corruption.</b> Neither party has received or been offered any illegal or improper bribe, kickback, payment, gift, or thing of value from an employee or agent of the other party in connection with this Agreement. Reasonable gifts and entertainment provided in the ordinary course of business do not violate the above restriction. If Customer learns of any violation of the above restriction, Customer will use reasonable efforts to promptly notify Scale at contact@scale.ac.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>h. Force Majeure.</b> Neither party will be liable to the other for any delay or failure to perform any obligation under this Agreement (except for a failure to pay Fees) if the delay or failure results from any cause beyond such party’s reasonable control, including but not limited, acts of God, acts of government, acts of terror or civil unrest, Internet failures, or acts undertaken by third parties not under the performing party’s control, including, without limitation, denial of service attacks (“Force Majeure Event”). In the event that a Force Majeure Event continues for a period of thirty (30) consecutive days, the other party may terminate this Agreement and all SOFs on written notice to the non-performing party. If Scale is the party experiencing the Force Majeure Event and as a result thereof is unable to provide the Services, Software or Mobile Apps for the period noted herein, and Customer terminates this Agreement and all SOFs, then Scale will provide Customer a refund of fees paid by Customer pro-rated as of the date the Force Majeure Event commenced.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>i. Governing Law.</b> This Agreement is governed by the laws of the State of California without regard to conflict of laws principles. The parties hereby submit to the exclusive personal jurisdiction of the federal and state courts of the State of California, San Francisco County for any claims or dispute relating to this Agreement.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>j. Dispute Resolution.</b> Any dispute, claim, or controversy arising out of or relating to this Agreement or the breach, termination, enforcement, interpretation, or validity thereof, including the determination of the scope or applicability of this Agreement to arbitrate, will first be determined by arbitration in San Francisco, California. The arbitration will be administered by JAMS pursuant to its arbitration rules and procedures. Judgment on the Award may be entered in any court having jurisdiction. This section will not preclude parties from seeking provisional remedies in aid of arbitration from a court of appropriate jurisdiction.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>k. Export Compliance and Use Restrictions.</b> The Services and other Software or components of the Services which Scale may provide or make available to Customer or Users may be subject to U.S. (or other territories) export control and economic sanctions laws, rules and regulations, including without limitation the regulations promulgated by the U.S. Department of Commerce’s Bureau of Industry and Security (“BIS”) and the U.S. Department of the Treasury’s Office of Foreign Assets Control (“OFAC”) (collectively, “Export Control Laws”). Customer agrees to comply with all the Export Control Laws as they relate to access to and use of the Services, Software, and such other components by Customer and Users. Customer shall not access or use the Services if Customer is located in any jurisdiction in which the provision of the Services, Software or other components is prohibited under U.S. or other applicable laws or regulations, including, without limitation, a country or territory that is subject to comprehensive U.S. trade sanctions (including, without limitation Cuba, Iran, North Korea, Syria or the Crimea or so-called Donetsk People’s Republic (DNR) or Luhansk People’s Republic regions of Ukraine) (a “Prohibited Jurisdiction”) and Customer shall not provide access to the Services to any government, entity or individual located in any Prohibited Jurisdiction. Customer represents, warrants and covenants that (i) Customer is not named on, or owned or controlled by any party named on any U.S. government (or other government) list of persons or entities prohibited from receiving U.S. exports, or transacting with any U.S. person, (ii) Customer is not a national of, located in, or a company registered in, any Prohibited Jurisdiction, (iii) Customer shall not permit Users to access or use the Service in violation of any Export Control Laws, (iv) no Customer Data created or submitted by Customer is subject to any restriction on disclosure, transfer, download, export or re-export under the Export Control Laws, and (v) Customer shall comply with all applicable laws regarding the transmission of technical data exported from the United States and the country in which Customer and Customer’s Users are located. Customer further agrees that Customer will not use the Services to disclose, transfer, download, export or re-export, directly or indirectly, any Customer Data to any country, entity or other party which is ineligible to receive such items under the Export Control Laws or under other laws or regulations to which Customer may be subject. Customer acknowledges that the Service and other Software may not be available in all jurisdictions and that Customer is solely responsible for complying with the Export Control Laws.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>l. Federal Government End Use Restrictions.</b> If Customer is a U.S. federal government department or agency or contracting on behalf of such department or agency, this Service is a “Commercial Item” as that term is defined at 48 C.F.R. §2.101, consisting of “Commercial Computer Software” and “Commercial Computer Software Documentation”, as those terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202. Consistent with 48 C.F.R. §12.212 or 48 C.F.R. §227.7202-1 through 227.7202-4, as applicable, the Service is licensed to Customer with only those rights as provided under the terms and conditions of this Agreement.
                    </p>


                    <h2 className="text-lg font-semibold mb-3">13. Definitions</h2>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Account”</b> means any accounts or instances created by or on behalf of Customer for access to and use of any of the Services.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Affiliate” or “Subsidiaries”</b> means with respect to a party to this Agreement, any entity that directly or indirectly controls, is controlled by, or is under common control with such party, where “control” means the possession, directly or indirectly, of the power to direct, or cause the direction of the management and policies of such entity, whether through the ownership of voting securities, by contract, or otherwise.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Confidential Information”</b> means all information disclosed by one party to the other party, orally, in writing or electronically, that is designated as “confidential” (or with a similar legend), or which a reasonable person should understand to be confidential given the nature of the information and circumstances of disclosure. Confidential Information does not include any information that: (i) was publicly known and made generally available in the public domain prior to the time of disclosure by the disclosing party; (ii) becomes publicly known and made generally available through no action or inaction of the receiving party; (iii) is already in the possession of the receiving party at the time of disclosure by the disclosing party; (iv) is obtained by the receiving party from a third party without a breach of such third party’s obligations of confidentiality; or (v) is independently developed by the receiving party without use of or reference to the disclosing party’s Confidential Information.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Customer Data”</b> means all electronic data, text, messages, or other materials, including, without limitation, Personal Data of Users and End Users, submitted to the Services by Customer or its Users through Customer’s Account in connection with Customer’s use of the Services.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Documentation”</b> means, the then-current, generally available user documentation provided by Scale detailing the functionalities of the Software and the Services.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“End User”</b> means any person or entity other than Customer or Customer’s Users with whom Customer interacts using the Services.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Scale Technology”</b> means (i) the Services, Software, Mobile Apps, Documentation, Scale APIs, Scale websites, and any content published on the Scale websites, (ii) any training materials, support materials, templates, tools, methodologies, or know-how, (iii) Scale Confidential Information, and (iv) any modifications or derivative works of the foregoing.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Mobile Apps”</b> means the Scale-branded Software applications provided by Scale to enable access and use of the Services through mobile or other handheld devices (such as apps on iOS or Android devices).
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Personal Data”</b> means data relating to an individual who is or can be identified either from the data or from the data in conjunction with other information that is in, or is likely to come into, the possession of the data controller (as defined under applicable data protection laws).
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Privacy Notice”</b> means Scale privacy notice currently at <a href="https://www.scale.ac/privacy-policy" target="_blank" rel="noopener noreferrer">www.scale.ac/privacy</a>, as updated from time to time.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Service Order Form or SOF”</b> means (i) any service order referencing this Agreement and executed by Customer and Scale, or (ii) any online ordering document or process completed by Customer, including any online registration through a Website, each of which detail, (a) the Services subscribed to and the corresponding Service Plans, (b) the number of Users authorized to use the Services, (c) Fees payable to Scale, (d) the applicable Subscription Term, and (e) any relevant additional terms and conditions. This may also include any change order forms.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Services”</b> means the Scale software-based service offerings identified on the SOF and any Updates, including any Software, API, or Documentation made available by Scale with such offering, but excludes any applications or APIs separately provided by third parties.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Service Plans”</b> means the pricing plans and other packaged offering limitations for and the applicable Services for which Customer subscribes with respect to any User.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Software”</b> means the generally available software provided by Scale in connection with Customer’s use of the Services, and includes Mobile Apps, but excludes any applications or APIs that are provided by third parties.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Subscription Term”</b> means the period stated on a SOF during which Customer subscribes to the Services.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“Update”</b> means the generally available updates, upgrades, hot fixes, patches, workarounds to the Software or Service provided by Scale to all subscribing customers, but excludes separately priced new products or modules.
                    </p>

                    <p className="text-justify mb-3 text-[17px]">
                        <b>“User” or “Agent”</b> means any individual who is authorized by Customer to use the Services, including an Account administrator, employees, consultants, contractors, and agents of Customer or its Affiliates, and third parties with which Customer or its Affiliates transact business.
                    </p>
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

export default TermsOfService;
