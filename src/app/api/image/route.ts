import { connectToDB } from "@/app/lib/mongodb";
import { User } from "../../../../component/Schema/Userschema";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const {base64Image, email } = await req.json()
  await connectToDB()

  const updateImage = await User.findOneAndUpdate({email:email},{image:base64Image},{new:true});
  
    if(!updateImage){
      return NextResponse.json({ message: "failed" }, { status: 404 });
    }
    return NextResponse.json({ message: "Image added" }, { status: 201 });
}

export async function POST(req: Request) {
  await connectToDB();

  const { email } = await req.json()
  const response = await User.findOne({email:email})

  return NextResponse.json({ message:response } , { status: 201 });
}