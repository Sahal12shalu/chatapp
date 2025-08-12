import { connectToDB } from "@/app/lib/mongodb";
import { message } from "../../../../../component/Schema/Messageschema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const MessageId = searchParams.get('messageId')

    const data = await message.find({_id:MessageId})

    return NextResponse.json({success: true ,message: data}, { status: 201 });
}