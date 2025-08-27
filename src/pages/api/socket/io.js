// pages/api/socket/io.js
import { Server } from 'socket.io';
import User from '@/app/schema/userschema'
import Message from '@/app/schema/messageschema'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socket/io',
    addTrailingSlash: false,
  });

  res.socket.server.io = io;
  let onlineUsers = {};
  let activeChats = {};

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('clear-all-messages',async({myId,userId})=>{
      io.emit('chat-cleared',{myId,userId})
      const lastMessage = await Message.findOne({
        $or: [
          { senderId: myId, receiverId: userId },
          { senderId: userId, receiverId: myId }
        ],
      }).sort({ createdAt: -1 }).lean()

      io.emit('message-received', {
        senderId: myId, receiverId:userId, lastMessage:lastMessage
      })
      const unseenCount = await Message.countDocuments({
        senderId: myId,
        receiverId: userId,
        seen: false
      });

      io.emit('unseen-updates', {
        senderId: myId, unseenCount
      })
    })

    socket.on('editMessage', async (data) =>{
        socket.broadcast.emit('messageEdited',data)
        const lastMessage = await Message.findOne({
        $or: [
          { senderId: data.senderId, receiverId: data.receiverId },
          { senderId: data.receiverId, receiverId: data.senderId }
        ],
      }).sort({ createdAt: -1 }).lean()

      io.emit('message-received', {
        senderId: data.senderId, receiverId:data.receiverId, lastMessage:lastMessage
      })
    })

    socket.on('deleteMessage', async (data) =>{
        socket.broadcast.emit('messageDeleted',data.messageId)
        const lastMessage = await Message.findOne({
        $or: [
          { senderId: data.senderId, receiverId: data.receiverId },
          { senderId: data.receiverId, receiverId: data.senderId }
        ],
      }).sort({ createdAt: -1 }).lean()

      io.emit('message-received', {
        senderId: data.senderId, receiverId:data.receiverId, lastMessage:lastMessage
      })

      const unseenCount = await Message.countDocuments({
        senderId: data.senderId,
        receiverId: data.receiverId,
        seen: false
      });

      io.emit('unseen-updates', {
        senderId: data.senderId, unseenCount
      })
      })

    socket.on('user-online', async (userId) => {
      socket.userId = userId
      await User.findByIdAndUpdate(userId, { status: true })
      io.emit('status-updated', { userId, status: true })
    })

    socket.on('join', (userId) => {
      onlineUsers[userId] = socket.id
    })

    socket.on('chatOpened', async ({ myUserId, Chatpage }) => {
      await Message.updateMany(
        { senderId: Chatpage, receiverId: myUserId, seen: false },
        { $set: { seen: true } }
      );
      if (onlineUsers[Chatpage]) {
        io.to(onlineUsers[Chatpage]).emit('message-seen', { by: myUserId })
      }
    })

    socket.on('send-message', async (msg) => {

      const lastMessage = await Message.findOne({
        $or: [
          { senderId: msg.senderId, receiverId: msg.receiverId },
          { senderId: msg.receiverId, receiverId: msg.senderId }
        ],
      }).sort({ createdAt: -1 }).lean()

      io.emit('message-received', {
        senderId: msg.senderId, receiverId:msg.receiverId, lastMessage:lastMessage || null
      })

      const unseenCount = await Message.countDocuments({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        seen: false
      });

      io.emit('unseen-updates', {
        senderId: msg.senderId, unseenCount
      })

      if (onlineUsers[msg.receiverId]) {
        io.to(onlineUsers[msg.receiverId]).emit("newMessage", msg);
      }

      if (activeChats[msg.receiverId] === msg.senderId) {
        await Message.updateOne(
          { _id: msg._id },
          { $set: { seen: true } }
        );

        if (onlineUsers[msg.senderId]) {
          io.to(onlineUsers[msg.senderId]).emit("message-seen", { by: msg.receiverId });
        }
      }

    });

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.userId, { status: false })
      io.emit('status-updated', { userId: socket.userId, status: false })
      console.log('user disconnected', socket.id)
    })
  });
  res.end();
}

