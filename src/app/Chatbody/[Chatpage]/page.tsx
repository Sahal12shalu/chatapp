'use client'
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from "react-icons/fa6";
import { GrEmoji } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react';
import './page.css'
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client'
import Link from 'next/link';
import Msgdltpopup from '../Msgdltpopup/page';
import Menumain from '../Menu/Menumain/page';
import { RiCheckDoubleFill } from "react-icons/ri";
const socket = io({
  path: '/api/socket'
})

function Chatpage() {

  type UserType = {
    _id: string,
    nickname: string,
    email: string,
    image?: string
    online: boolean
  }

  type MessageType = {
    _id: string,
    sender: string,
    reciever: string,
    message: string,
    timestamp: string
    seen: boolean
  }

  const [emoji, Setemoji] = useState(false)
  const [inputText, SetinputText] = useState('')
  const [message, setMessage] = useState<MessageType[]>([])
  const [userData, SetuserData] = useState<UserType[]>([])
  const [msgdltpopup, Setmsgdltpopup] = useState(false)
  const [msgId, SetmsgId] = useState<string>('')
  const params = useParams()
  const id = params?.Chatpage
  const { data: session, status } = useSession()

  const handleMessageupdated = (updatedMessage:MessageType) =>{
    setMessage((prev) => prev.map((msg) =>msg._id === updatedMessage._id ? updatedMessage : msg))
  }
  
  const Openemoji = () => {
    Setemoji(!emoji)
  }

  const handleDeletesuccess = (id: string) => {
    setMessage(prev => prev.filter(msg => msg._id !== id))
  }

  const Messageclick = (msg: string) => {
    SetmsgId(msg)
    Setmsgdltpopup(true)
  }

  useEffect(() => {
    if (status === 'loading') return;
    const Getmydetails = async () => {
      const res = await fetch("/api/register/user", {
        method: "POST",
        body: JSON.stringify({ id: id }),
      });

      if (res.ok) {
        const datas = await res.json();
        SetuserData([datas.message])
        socket.on('user-status-changed', ({ userId, online }) => {
          SetuserData((prev) => prev.map((user) => user._id === userId ? { ...user, online } : user))
        })
        return () => { socket.off('user-status-changed') }
      } else {
        alert('error')
      }
    }
    Getmydetails()
  }, [status])

  useEffect(() => {
    if (status === 'loading') return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/message?sender=${session?.user.id}&receiver=${id}`)
      const data = await res.json()
      setMessage(data.message)
    }
    fetchMessages()
  }, [status])

  useEffect(() => {
    if(!id || !session?.user.id) return;
    const unSeenmessage = message.filter(m => m.sender === id && !m.seen)
    if(unSeenmessage.length > 0) {
      const messageIds = unSeenmessage.map(m => m._id);
      socket.emit('mark-seen', {
        messageIds,
        senderId:id,
        receiverId:session.user.id
      })
    }
  }, [id, message, session?.user.id])

  type Messageseenpayload = {
    messageIds:string[],
    receiverId:string
  }

  useEffect(() => {
    const handleMessageseen =  ({messageIds,receiverId} : Messageseenpayload) => {
      setMessage((prev) => 
        prev.map((msg) =>
           messageIds.includes(msg._id) ? {...msg, seen:true} : msg
    )
     );
    }
    socket.on('message-seen', handleMessageseen);

    return() =>{
      socket.off('message-seen',handleMessageseen)
    }
  }, [])
  

  useEffect(() => {
    socket.on('recieve_message', (data) => {
      const isCurrentChat =
        (data.sender === session?.user.id && data.receiver === id) ||
        (data.sender === id && data.receiver === session?.user.id)

      if (isCurrentChat) {
        setMessage((prev) => [...prev, data])
      }
    })

    return () => {
      socket.off('receive_message');
    }
  }, [session?.user.id, id])


  const sendMessage = async () => {
    if (!inputText.trim()) {
      return;
    }
    const messageData = {
      sender: session?.user.id,
      receiver: id,
      message: inputText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    socket.emit('send_message', messageData);
    SetinputText('')
    await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    })

    const res = await fetch(`/api/message?sender=${session?.user.id}&receiver=${id}`)
    const data = await res.json()
    setMessage(data.message)

  }

  return (
    <div className='bg-gradient-to-r from-gray-700 to-gray-600 w-full h-[100vh] flex justify-center items-center'>
      {
        msgdltpopup ? <Msgdltpopup id={msgId} onCancel={() => Setmsgdltpopup(false)} onDeletesuccess={() => handleDeletesuccess(msgId)} OnmessageUpdated={handleMessageupdated} /> : ''
      }
      <div className='w-full max-w-xl h-[100vh] md:h-[97vh] bg-gradient-to-r from-white/90 to-white/90 md:rounded-2xl'>
        <div className='h-[13%] md:rounded-t-2xl flex items-center justify-between bg-black/80 text-white'>
          {
            userData.map((value, index) => (
              <div key={index} className='flex items-center'>
                <Link href='/Chatbody/Body'><FaAngleLeft className='ml-2 md:ml-5 ' /></Link>
                <img src={`${value.image ? value.image === 'A' ? '/unknown3.jpeg' : value.image : '/unknown3.jpeg'}`} className='h-15  w-15 rounded-full ml-2 md:ml-5' />
                <div className='flex flex-col ml-1 md:ml-3 p-2'>
                  <p className='font-semibold text-lg pl-[-10px] text-white/90'>{value.nickname}</p>
                  <p className='text-md tracking-normal text-white/80'>{value.online ? 'Online' : 'offline'}</p>
                </div>
              </div>
            ))
          }

          {typeof id === 'string' ? <Menumain userId={id} onAllDeletesuccess={() => setMessage([])} /> : null}

        </div>

        <div className='h-[78%] px-5 md:px-8 py-2 w-full overflow-scroll scrollbar-hide flex flex-col justify-end items-end  bg-gradient-to-r from-white/70 to-white/60'>
          {
            message.map((msg, index) => (
              <div key={index} className={`${msg.sender === session?.user.id ? 'flex justify-end' : 'flex justify-start'} w-full `}>
                <div onClick={() => Messageclick(msg._id)} className={`${msg.sender === session?.user.id ? 'bg-black/20 pl-6 pr-3' : 'bg-green-600/90 px-6'} max-w-max my-2  w-[80%] md:w-[65%] py-1 rounded-2xl`}>
                  <p className={`${msg.sender === session?.user.id ? 'text-black/80' : 'text-white'} font-semibold text-md tracking-wide`}>{msg.message}</p>
                  <div className='flex justify-end gap-2'>
                    <p className='text-black/60 text-[10px]' >{msg.timestamp}</p>
                    {msg.sender === session?.user.id ? <RiCheckDoubleFill className={`${msg.seen ? 'text-blue-500' : 'text-black'}`} /> : ''}
                  </div>
                </div>
              </div>
            ))
          }

          {
            emoji ? <div className=' w-full' onClick={(e) => e.stopPropagation()}>
              <EmojiPicker onEmojiClick={(emojiData) => {
                SetinputText(prev => prev + emojiData.emoji)
              }} style={{ width: '100%' }} /> </div> : ''
          }
        </div>


        <div className='h-[10%] md:rounded-2xl flex bg-gray-300  items-center'>
          <GrEmoji onClick={Openemoji} className='hidden md:flex mx-4 h-6 w-6' />
          <FaPlus className='mx-3 md:ml-1 md:mr-3' />
          <input value={inputText} onChange={(e) => SetinputText(e.target.value)} placeholder="text" className="input mr-2" />
          <button onClick={sendMessage} className='send-btn h-12'>
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="20">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                </svg>
              </div>
            </div>
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatpage