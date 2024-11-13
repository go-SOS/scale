import nodemailer from 'nodemailer';
import dbConnect from "@/db/config/dbConnect";
import User from "@/db/models/user";
import crypto from 'crypto';

dbConnect();

export async function POST(request) {

    const { email } = await request.json();

    if (!email) {
        return new Response(JSON.stringify({ message: 'Email is required' }), { status: 401 });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return new Response(JSON.stringify({ message: 'No user with that email' }), { status: 401 });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        secure: true,
    });

    const mailOptions = {
        to: user.email,
        from: 'team@scale.ac',
        subject: 'Password Reset',
        html: `
        <table width="448px" border="0" cellspacing="0" cellpadding="0"
            style="margin: auto; color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: 0px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">
            <tbody>
                <tr>
                    <td class="m_-1463397402471218279center"
                        style="margin: 0px; padding-top: 30px; padding-bottom: 30px; color: rgb(68, 68, 68); font-family: Arial, Arial, sans-serif; font-size: 30px; line-height: 40px; font-weight: 300;">
                       Reset your password?</td>
                </tr>
                <tr>
                    <td class="m_-1463397402471218279center"
                        style="margin: 0px; padding-bottom: 26px; color: rgb(102, 102, 102); font-family: Arial, sans-serif; font-size: 20px; line-height: 30px; min-width: auto !important;">
                        You’re receiving this message because you (or someone else) have requested the reset of the password for your account.<br><br>Please click on the button below to complete the process. </td>
                </tr>
                <tr>
                    <td align="left" style="margin: 0px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td
                                        style="margin: 0px; color: rgb(255, 255, 255); background: rgb(58, 12, 163); border-radius: 5px; font-family: Arial, Arial, sans-serif; font-size: 14px; line-height: 18px; font-weight: 500; padding: 12px 25px;">
                                        <a href="${process.env.NEXTAUTH_URL}/reset/${token}"
                                            target="_blank"
                                            style="color: rgb(255, 255, 255); text-decoration: none;"><span
                                                style="color: rgb(255, 255, 255); text-decoration: none;">Reset Password</span></a></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="margin: 0px; padding-bottom: 26px; color: rgb(102, 102, 102); font-family: Arial, sans-serif; font-size: 20px; line-height: 30px;">
                        Or copy and paste this link to reset password: <br/> 
                        ${process.env.NEXTAUTH_URL}/reset/${token}
                    </td>
                </tr>
                <tr>
                    <td class="m_-1463397402471218279center"
                        style="margin: 0px; padding-top: 30px; padding-bottom: 30px; color: rgb(68, 68, 68); font-family: Arial, Arial, sans-serif; font-size: 20px; line-height: 30px; font-weight: 300;">
                        If you did not request this, please ignore this email and your password will remain unchanged.</td>
                </tr>
                <tr>
                    <td style="padding: 20px; text-align: center; font-size: 14px; color: #999999;">
                        <a href="https://scale.ac/privacy-policy" style="color: #0066cc; text-decoration: none;">Privacy Policy</a> | 
                        <a href="mailto:contact@scale.ac" style="color: #0066cc; text-decoration: none;">Contact Support</a>
                    </td>
                </tr>
            </tbody>
        </table>
        `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Password reset email sent' }), { status: 200 });
}