import dbConnect from "@/db/config/dbConnect";
import User from "@/db/models/user";
import Member from "@/db/models/member";
import bcrypt from 'bcryptjs';

dbConnect();


export async function POST(request) {

    const { email, password, hashedPassword } = await request.json();

    // Check if email and password are provided
    if (!email || !password) {
        return new Response(JSON.stringify({
            success: false,
            status: 400,
            message: 'email and password are required',
            data: email,
        }));
    }

    // Find the user in the database
    // const user = await User.findOne({ email });
    const user = await User.findOne({ email: email.toLowerCase() });
    const member = await Member.findOne({ email: email.toLowerCase() });

    // If user is not found, return an error
    if (!user) {
        return new Response(JSON.stringify({
            success: false,
            status: 400,
            message: 'Invalid credentials'
        }));
    }


    console.log('member ', member);

    if (hashedPassword !== undefined && hashedPassword !== "undefined") {
        const isPasswordValid = (hashedPassword === user.password);
        if (isPasswordValid) {
            if (member) {
                member.isJoined = true;
                await member.save();
            }
            return new Response(JSON.stringify({
                success: true,
                status: 200,
                data: user
            }));
        } else {
            return new Response(JSON.stringify({
                success: false,
                status: 400,
                message: 'Wrong Password'
            }));
        }
    } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            if (member) {
                member.isJoined = true;
                await member.save();
            }
            return new Response(JSON.stringify({
                success: true,
                status: 200,
                data: user
            }));
        } else {
            return new Response(JSON.stringify({
                success: false,
                status: 400,
                message: 'Wrong Password'
            }));
        }
    }



    // Compare the provided password with the hashed password stored in the database
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    // If passwords match, generate a JWT token and send it in the response
    // if (isPasswordValid) {
    //     const token = jwt.sign({ email: user.email }, 'secret-key', { expiresIn: '1h' });
    //     return res.json({ message: 'Login successful', token });
    // } else {
    //     // If passwords do not match, return an error
    //     return res.status(401).json({ message: 'Invalid credentials' });
    // }

}
