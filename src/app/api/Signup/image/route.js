import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/schema/userschema'

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