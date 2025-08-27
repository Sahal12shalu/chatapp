import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/schema/userschema'
import Message from '@/app/schema/messageschema'

export async function POST(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); 
    const myId = searchParams.get("myId"); 
    await User.findByIdAndUpdate(myId, {$addToSet : {
        archieveUsers: userId
    }})
    return NextResponse.json({ message: 'success' });
}

export async function DELETE(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); 
    const myId = searchParams.get("myId"); 
    await User.findByIdAndUpdate(myId,
        { $pull: {archieveUsers: userId }},
        { new: true }
    )
    return NextResponse.json({ message: 'success' });
}

export async function GET(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("myId");
    const data =await User.findById(userId).populate('archieveUsers')
    const ChatList = await Promise.all(data.archieveUsers.map(async (u) => {
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
    return NextResponse.json({ message: 'success', user:ChatList });
}