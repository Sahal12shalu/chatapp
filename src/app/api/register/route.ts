// app/api/register/route.ts
import { connectToDB } from "@/app/lib/mongodb";
import { User } from "../../../../component/Schema/Userschema";
import { Archieve } from "../../../../component/Schema/Archieveschema";
import { message } from "../../../../component/Schema/Messageschema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface UserData {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  await connectToDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 404 });
  }
  
  let userData:UserData = { name, email ,password }
  if(password){
  const hashedPassword = await bcrypt.hash(password, 10);
  userData = { ...userData, password:hashedPassword }
  }
  await User.create(userData)

  return NextResponse.json({ message: "User created" }, { status: 201 });
}

export async function PUT(req: Request) {
  const { nickname , email } = await req.json()
  await connectToDB();
  const existingNickname = await User.findOne({ nickname })
  if(existingNickname) {
    return NextResponse.json({ message: "Nickname already used" }, { status: 201 });
  }
  await User.findOneAndUpdate({email:email},{nickname:nickname},{new:true});

  return NextResponse.json({message:'success'}, { status: 201 });
}

export async function GET() {
  await connectToDB();

  const users = await User.find()

  return NextResponse.json({ message: users }, { status: 201 });
}

export async function DELETE(req: Request) {
  await connectToDB();
  const body =await req.json()
  const { userId } = await body
  
  await User.findByIdAndDelete(userId)
 
 await message.deleteMany({
  $or:[{sender:userId},{receiver:userId}]
 })
 
 await Archieve.deleteMany({
  $or:[{userId:userId},{archievedUserid:userId}]
 })

 return NextResponse.json({ message: 'success' }, { status: 201 });
}

