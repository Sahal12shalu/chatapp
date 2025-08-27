import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/schema/userschema'
import Message from '@/app/schema/messageschema'
import bcrypt from 'bcrypt'

export async function POST(req) {
    await dbConnect()
    const body = await req.json()
    const { email, password } = body

    const Emailexist = await User.findOne({ email: email })
    if (Emailexist) {
        const passExist = await bcrypt.compare(password, Emailexist.password)
        if (passExist) {
            const userData = await User.findOne({ email: email })
            if (userData.image) {
                const NewImage = 'B'
                userData.image = NewImage
            }
            return NextResponse.json({ message: 'success', user: userData })
        } else {
            return NextResponse.json({ message: 'password not match' })
        }
    } else {
        return NextResponse.json({ message: 'Email not found' })
    }
}

export async function PUT(req) {
    await dbConnect()
    const body = await req.json()
    const { id, username } = body

    const Existusername = await User.findOne({ username: username })
    if (Existusername) {
        return NextResponse.json({ message: 'username found' })
    } else {
        await User.findByIdAndUpdate(id, { $set: { username: username } }, { new: true })
        return NextResponse.json({ message: 'success' })
    }
}

export async function GET(req) {
    await dbConnect()
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const currentUser =await User.findById(userId);
    const archieveIds = currentUser.archieveUsers || []
    const data = await User.find({ _id: {$ne: userId, $nin:archieveIds}})
    const ChatList = await Promise.all(data.map(async (u) => {
        const lastMessage =await Message.findOne({
            $or: [
                { senderId: userId, receiverId: u._id },
                { senderId: u._id, receiverId: userId }
            ],
        }).sort({createdAt: -1}).lean()
        const unseenCount = await Message.countDocuments({
            senderId: u._id,
            receiverId: userId,
            seen : false
        });

        return{ ...u.toObject(), lastMessage:lastMessage ? lastMessage.message : null ,
            lastMessageTime:lastMessage ? lastMessage.createdAt : null,
            seen:lastMessage ? lastMessage.seen : null, unseenCount }
    }))

    return NextResponse.json({ message: "User received", user: ChatList });
}