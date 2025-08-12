import { connectToDB } from "@/app/lib/mongodb";
import { User } from "../../../../../component/Schema/Userschema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email } = await req.json()
    await connectToDB()

    await User.findOneAndUpdate({ email: email },{image:'A'});

    return NextResponse.json({ message: "Empty Image created" }, { status: 201 });
}