import dbConnect from "@/db/config/dbConnect";
import User from "@/db/models/user";
import bcrypt from 'bcryptjs'; 

dbConnect();

export async function POST(request) {

    const { token, password } = await request.json();

    console.log('token ', token);
    console.log('password ', password);

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return new Response(JSON.stringify({ message: 'Password reset token is invalid or has expired' }), { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return new Response(JSON.stringify({ message: 'Password has been reset' }), { status: 200 });
}

