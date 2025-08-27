import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/schema/userschema'
import Message from '@/app/schema/messageschema'

export async function PUT(req) {
    await dbConnect()
    const body =await req.json()
    const { id, image } = body
    
    const updatedUser =await User.findByIdAndUpdate( id,{ $set: { image:image }},{ new: true })
    if(updatedUser){
    return NextResponse.json({message:'success'})
    }else{
        return NextResponse.json({message:'unsuccess'})
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); 
    await User.findByIdAndDelete(userId)
    await Message.deleteMany({
        $or:[{senderId:userId},{receiverId:userId}]
    })
    return NextResponse.json({message:'success'})
}