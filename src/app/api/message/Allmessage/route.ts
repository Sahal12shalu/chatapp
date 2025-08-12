import { connectToDB } from "@/app/lib/mongodb";
import { message } from "../../../../../component/Schema/Messageschema";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest) {
    await connectToDB()
    const body = await req.json();
    const { Myid, UserId } =await body

    const data = await message.deleteMany({
        $or:[
            {sender:Myid, receiver:UserId},
            {sender:UserId, receiver:Myid}
        ]
    })
    return NextResponse.json({ message:data } , { status: 201 });
}

export async function POST(req: NextRequest) {
    await connectToDB();
    const { Myid,Userids } = await req.json()

    const lastMessage = await Promise.all(
        Userids.map(async (id:string)=>{
            const msg = await message.findOne({
                $or:[
                    {sender:Myid,receiver:id},
                    {sender:id,receiver:Myid}
                ],
            }).sort({timestamp: -1}).limit(1);
            return{
                userId:id,
                lastMessageTime: msg ? msg.timestamp : null,
            }
        })
    )
    return NextResponse.json({ message:lastMessage } , { status: 201 });
}

export async function PUT(req: NextRequest) {
    await connectToDB()
    const { MessageId } = await req.json()
    
    const updated =await message.updateMany({_id:{$in:MessageId}},{$set:{seen:true}})

    return NextResponse.json({ message:updated } , { status: 201 });
}

export async function GET(req: NextRequest) {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const unseenCount = await message.aggregate([
        {$match: {receiver : userId, seen : false}},
        {$group : {
            _id : '$sender',
            count : {$sum : 1}
        }}
    ])

    const results : Record<string, number> = {};
    unseenCount.forEach(item =>{
        results[item._id] = item.count
    })

    return NextResponse.json({ message:results } , { status: 201 });
}