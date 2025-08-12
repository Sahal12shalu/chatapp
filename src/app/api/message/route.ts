import { connectToDB } from "@/app/lib/mongodb";
import { message } from "../../../../component/Schema/Messageschema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectToDB()
    const body = await req.json();
    const saved = await message.create(body)
    return NextResponse.json({success: true , saved}, { status: 201 });
}

export async function GET(req: NextRequest) {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const sender = searchParams.get('sender')
    const receiver = searchParams.get('receiver')

    const messages = await message.find({
        $or:[
            { sender , receiver},
            { sender:receiver , receiver:sender},
        ]
    }).sort({timeStamp:1})

    return NextResponse.json({success: true ,message: messages}, { status: 201 });
}

export async function DELETE(req: NextRequest) {
    await connectToDB()
    const body = await req.json();
    const { id } = body
    
    const data = await message.findByIdAndDelete(id)
    return NextResponse.json({ message:data } , { status: 201 });
}

export async function PUT(req: NextRequest) {
    await connectToDB()
    const body = await req.json();
    const { updatedmessage, messageId} = await body
    
    const data = await message.findByIdAndUpdate({_id:messageId},{message:updatedmessage},{new:true})
    return NextResponse.json({success: true ,message: data}, { status: 201 });
}
