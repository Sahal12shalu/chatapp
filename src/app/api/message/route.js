import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import Message from '@/app/schema/messageschema'

export async function POST(req) {
    await dbConnect();
    const body =await req.json()
    const newMessage =await Message.create(body)
    return NextResponse.json({message:'success', newMessage})
}

export async function GET(req){
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get("senderId"); 
    const receiverId = searchParams.get("receiverId"); 
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }, // reverse chat
        ],
      }).sort({ createdAt: 1 });

      return NextResponse.json({message:'success', messages})
}

export async function DELETE(req){
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const msgId = searchParams.get("msgId"); 
    console.log(msgId)
    await Message.findByIdAndDelete(msgId)

    return NextResponse.json({message:'success'})
}