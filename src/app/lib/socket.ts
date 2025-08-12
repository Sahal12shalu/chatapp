import { Server } from 'socket.io'
import { connectToDB } from "@/app/lib/mongodb";
import { User } from "../../../component/Schema/Userschema";
import { message } from '../../../component/Schema/Messageschema';

let io: Server;

export function initSocket(server : any) {
    if(!io) {
        io = new Server(server, {
            path:'/api/socket',
            cors: { origin: '*' }
        })

        const userScoketMap = new Map()

        io.on('connection',async (socket) => {
            console.log('user connected', socket.id)

            socket.on('user-connected', async (userId:string) => {
                userScoketMap.set(socket.id,userId)
                await connectToDB()
                await User.findByIdAndUpdate(userId,{online:true});

                socket.broadcast.emit('user-status-changed',{
                    userId,
                    online:true,
                })
            })

            socket.on('send_message', (data) => {
                io.emit('receive_message', data);
            })

            socket.on('disconnect',async ()=>{
                console.log('user disconnected')
                const userId = userScoketMap.get(socket.id);
                if(userId){
                    await connectToDB()
                    await User.findByIdAndUpdate(userId, {online:false})
                    userScoketMap.delete(socket.id)

                    socket.broadcast.emit('user-status-changed',{
                        userId,
                        online:false,
                    })
                }
            })

            socket.on('mark-seen', async ({ messageIds, senderId, receiverId}) =>{
                await connectToDB()

                await message.updateMany(
                    {_id: {$in:messageIds}},
                    {$set : {seen : true}}
                );

                const senderSocketId = [...userScoketMap.entries()].find((
                    [_, uid]) => uid === senderId)?.[0];

                    if(senderSocketId){
                        io.to(senderSocketId).emit('message-seen', { messageIds,receiverId})
                    }
            })
        })
    }
    return io
}