import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/schema/userschema'

export async function PUT(req) {
    await dbConnect()
    const body = await req.json()
    const { id, username } = body

    const Existusername = await User.findOne({ username: username })
    if (Existusername) {
        return NextResponse.json({ message: 'username found' })
    } else {
        await User.findByIdAndUpdate(id, { $set: { username: username } }, { new: true })
        return NextResponse.json({ message: 'success' })
    }
}