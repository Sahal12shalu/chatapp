import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import Message from '@/app/schema/messageschema'

export async function GET(req){
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const msgId = searchParams.get("msgId"); 
    const messages =await Message.findById(msgId)

    return NextResponse.json({message:'success', messages})
}

export async function PUT(req){
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const msgId = searchParams.get("msgId");
    const message = searchParams.get("updateMsg"); 

    await Message.findByIdAndUpdate(msgId,{message:message},{new:true})

    return NextResponse.json({message:'success'})
}

export async function DELETE(req){
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const myId = searchParams.get("myId");
    const userId = searchParams.get("userId"); 

    await Message.deleteMany({
        $or:[
            {myId, userId},
            {senderId:userId, receiverId:myId},
            {senderId:myId, receiverId:userId}
        ]
    })

    
    return NextResponse.json({message:'success'})
}