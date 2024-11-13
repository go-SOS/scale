import dbConnect from "@/db/config/dbConnect";
import User from "@/db/models/user";
import nodemailer from "nodemailer";

dbConnect();

async function connectToEmail(email, otp) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        secure: true,
    });

    // Email content
    const mailOptions = {
        from: 'team@scale.ac',
        to: email,
        subject: 'Scale Sign Up Verification Code',
        html: `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" 
            style="margin: auto; max-width: 600px; background-color: #ffffff; font-family: Arial, Helvetica, sans-serif; color: #222222;">
            <tbody>
                <tr>
                    <td style="padding: 20px 0; text-align: center; font-size: 24px; font-weight: 600; color: #333333;">
                        Scale Sign Up Verification Code
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 30px; text-align: left; font-size: 16px; line-height: 24px; color: #555555;">
                        Hi there,<br><br>
                        We received a request to create an account with this email address. Please use the verification code below to proceed.
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 20px; text-align: center;">
                        <div style="font-size: 32px; font-weight: bold; color: #333333; padding: 20px; border: 2px solid #333333; display: inline-block;">
                            ${otp}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 20px 40px; text-align: left; font-size: 16px; line-height: 24px; color: #555555;">
                        If you didn’t request this, please ignore this email.
                    </td>
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

    // Send mail
    await transporter.sendMail(mailOptions);
}


export async function POST(request) {

    const { email, password } = await request.json();

    console.log('password ', password);
    console.log('email ', email);

    const existingUser = await User.findOne({ email });

    console.log('existingUser ', existingUser);
    if (existingUser) {
        return new Response(JSON.stringify({ error: 'Email is already taken' }), { status: 409 });
    }

    // Generate OTP
    const otp = Math.random().toString().slice(2, 8); // 6-digit OTP

    // Send OTP to the provided email
    connectToEmail(email, otp);

    // If user is created successfully, return a success message
    const users = await User.create({
        timeZone: '',
        dateFormat: '',
        otp: otp,
        email,
        createdBy: email, createdAt: new Date()
    });

    return new Response(JSON.stringify(users), { status: 200 });

}