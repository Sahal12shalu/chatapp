import { connectToDB } from "@/app/lib/mongodb";
import { User } from "../../../../../component/Schema/Userschema";
import {  NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDB();

  const { id } = await req.json()
  const response = await User.findOne({_id:id})

  return NextResponse.json({ message:response } , { status: 201 });
}
