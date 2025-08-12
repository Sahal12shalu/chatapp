import { connectToDB } from "@/app/lib/mongodb";
import { Archieve } from "../../../../component/Schema/Archieveschema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectToDB();
    const body =await req.json()
    const { userId,archievedUserid,category } = body

    const existing = await Archieve.findOne({userId,archievedUserid})
    if(existing){
        existing.category = category
        await existing.save()
        return NextResponse.json({success: true , existing}, { status: 201 });
    }else{

    const newArchieve = await Archieve.create(body)
    return NextResponse.json({success: true , newArchieve}, { status: 201 });
    }
}

export async function GET(req: NextRequest) {
    await connectToDB()
    const { searchParams } = new URL(req.url)

    const userId = searchParams.get('userId')

    const archieve = await Archieve.find({userId:userId })
    return NextResponse.json({success: true , archieve}, { status: 201 });
}