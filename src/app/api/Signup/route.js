import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/schema/userschema'
import bcrypt from 'bcrypt'

export async function POST(req) {
    await dbConnect()
    const body =await req.json()
    const { fullname, email, password } = body

    const hashedpassword = await bcrypt.hash(password, 10)
    const userExist =await User.findOne({email:email})
    if(userExist){
    return NextResponse.json({message:'unsuccess'})
    }else{
    const newUser =await User.create({fullname,email,password:hashedpassword})
    return NextResponse.json({message:'success', user: newUser})
    }
}

export async function GET(req) {
  await dbConnect()
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("userId"); 
  const data =await User.findById(user)

  return NextResponse.json({ message: "User received", user:data });
}


export async function PUT(req) {
  await dbConnect();
  const body =await req.json()
  const {id, status} = body;

  const updateUser =await User.findByIdAndUpdate(id,
    {status},
    {new:true}
  )
   if(updateUser) {
    return NextResponse.json({ message: "Status updated", user:updateUser });
   }
}