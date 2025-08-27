'use client'
import React, { use, useEffect, useRef, useState } from 'react'
import { MdEmojiEmotions } from "react-icons/md";
import { useSession } from 'next-auth/react'
import './page.css'
import axios from 'axios';
import Image from 'next/image';
import Picker from "emoji-picker-react";
import { FaChevronLeft } from "react-icons/fa6";
import Link from 'next/link';
import { io } from 'socket.io-client';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import Menupage from '../Menu/page';
import { MdCloudDone } from "react-icons/md";
import Toast from '../../Component/ui/Toast';
import { useSearchParams } from 'next/navigation';
import Messageoption from '../Messageoption/page';

let socket;

function Chatpage({ params: paramsPromise }) {

  const { data: session, status } = useSession()
  const [userData, Setuserdata] = useState([])
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [menupopup, Setmenupopup] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showToast2, setShowToast2] = useState(false)
  const [messagePage, SetmessagePage] = useState(false)
  const [messageId,SetmessageId] = useState('')
  const [spin, Setspin] = useState(false)
  const inputRef = useRef(null);
  const params = use(paramsPromise)
  const { Chatpage } = params;
  const searchParams = useSearchParams()
  const from = searchParams.get("from")

  const MessageOptions = (id) => {
    SetmessageId(id)
    SetmessagePage(true)
  }

  useEffect(() => {
    if (status === 'loading' || !session.user?.id) return;
    socket = io('', {
      path: '/api/socket/io',
    });

    socket.on('chat-cleared',({myId,userId}) => {
      if((myId ===session.user.id && userId === Chatpage) ||
      (myId === Chatpage && userId === session.user.id )){
        setMessages([])
      }
    })

    socket.on('connect', () => {
      console.log('Connected:', socket.id);
    });

    socket.emit('join', session.user.id)

    socket.emit('chatOpened', { myUserId: session.user.id, Chatpage })

    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg])

      if (msg.senderId === Chatpage && msg.receiverId === session.user.id) {
        socket.emit('chatOpened', { myUserId: session.user.id, Chatpage })
      }
    })

    socket.on('message-seen', ({ by }) => {
      if (by === Chatpage) {
        setMessages((prev) => prev.map((m) =>
          m.senderId === session.user.id ? { ...m, seen: true } : m))
      }
    })

    socket.emit('user-online', session.user.id)

    socket.on('status-updated', ({ userId, status }) => {
      Setuserdata(prev => prev.map(u => u._id === userId ? { ...u, status } : u))
    })

    socket.on('messageDeleted', (deletedId) => {
      setMessages((prev) => prev.filter(msg => msg._id !== deletedId))
    })

    socket.on('messageEdited', (data) => {
      setMessages((prev) => prev.map((m)=> m._id === data.messageId ? {...m, message:data.updatemsg} : m))
    })

    socket.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
      socket.off('message-seen')
    };
  }, [session?.user?.id, status, Chatpage]);

  useEffect(() => {
    if (status === 'loading' || !session.user?.id) return;
    const getMessages = async () => {
      const res = await axios.get(`/api/message?senderId=${session.user.id}&receiverId=${Chatpage}`)
      setMessages(res.data.messages)
    }
    getMessages()
  }, [session?.user?.id, Chatpage, status]);


  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const res = await axios.post('/api/message', {
      senderId: session.user.id,
      receiverId: Chatpage,
      message: inputValue,
    });
    if (res.data.message === 'success') {
      const Data = {
        _id:res.data.newMessage._id,
        message: inputValue,
        senderId: session.user.id,
        receiverId: Chatpage,
        timestamp: res.data.newMessage.timestamp,
        seen: false,
        createdAt: res.data.newMessage.createdAt
      }
      setMessages((prev) => [...prev, Data])
      socket.emit('send-message', Data);
      setInputValue('');
    }
  };

  const onEmojiClick = (emojiObject, event) => {
    const emoji = emojiObject.emoji;

    const cursorPos = inputRef.current.selectionStart;
    const textBeforeCursor = inputValue.substring(0, cursorPos);
    const textAfterCursor = inputValue.substring(cursorPos);
    const newText = textBeforeCursor + emoji + textAfterCursor;

    setInputValue(newText);

    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.selectionStart = cursorPos + emoji.length;
      inputRef.current.selectionEnd = cursorPos + emoji.length;
    }, 0);
  };

  useEffect(() => {
    if (status === 'loading') return;
    const Getmydata = async () => {

      const res = await axios.get(`/api/Signup?userId=${Chatpage}`)
      Setuserdata([res.data.user])
    }
    Getmydata()
  }, [status, Chatpage])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-800">
      {
        messagePage ? <div className='w-full h-full z-90 fixed flex justify-center items-center bg-black/10' onClick={()=>SetmessagePage(false)}> 
        <Messageoption messageId={messageId} onDeleteSuccess={()=> SetmessagePage(false)} myId={session.user.id} userId={Chatpage} Setspin={Setspin} /> </div> : ''
      }
      <div className="absolute w-[90%] top-1/20 left-1/2 h-[200px] bg-white/60 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className='relative w-full z-20 max-w-xl bg-gradient-to-b from-gray-900 via-black to-gray-800 md:to-black h-screen border-1 border-white/30'>

        {showToast ? <div className='absolute w-full z-0 bg-black/0 flex justify-center items-center h-full'>
          <Toast message={<div className='flex justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
            <span className='text-white/90'>User archieve success</span></div>} onClose={() => setShowToast(false)} />
        </div> : ''}

        {showToast2 ? <div className='absolute w-full z-0 bg-black/0 flex justify-center items-center h-full'>
          <Toast message={<div className='flex justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
            <span className='text-white/90'>User Unarchieve success</span></div>} onClose={() => setShowToast(false)} />
        </div> : ''}

        {spin ? <div className='absolute w-full z-99 bg-black/20 flex justify-center items-center h-full'>
          <div className="w-8 h-8 border-4 border-white border-dashed rounded-full animate-spin"></div></div> : ''}
        {
          userData.map((value, id) => (
            <div key={id} className='w-full h-[14%] border-b-1 border-white/50 flex' onClick={() => setShowPicker(false)}>
              <div className='h-full w-[24%] flex justify-around items-center'>
                {from === "archieve" ? <Link href='/Chatcomponent/Archieve'><FaChevronLeft className='text-white' /></Link> :
                  <Link href='/Chatcomponent/Chatbody'><FaChevronLeft className='text-white' /></Link>}
                <Image src={value.image === 'A' ? '/unknown3.png' : value.image} alt='profile' width={100} height={100} className='bg-white h-17 w-17 rounded-full' />
              </div>
              <div className='h-full w-[63%] flex flex-col justify-center pl-3'>
                <h1 className='bg-gradient-to-r from-white/80 via-white to-white/90 bg-clip-text text-transparent font-semibold text-[26px]' style={{ fontFamily: 'cursive' }}>{value.username}</h1>
                <p className={`${value.status ? 'text-white/90' : 'text-white/70'} text-[13px] tracking-wider`}>{value.status ? 'online' : 'offline'}</p>
              </div>
              <div className='h-full w-[13%] flex justify-center items-center'>
                <Menupage menupopup={menupopup} Setmenupopup={Setmenupopup} userId={Chatpage} setShowToast={setShowToast} setShowToast2={setShowToast2} Setspin={Setspin} />
              </div>
            </div>
          ))
        }

        <div className='w-full h-[75%] overflow-y-scroll scrollbar-hide flex flex-col justify-end' onClick={() => { setShowPicker(false), Setmenupopup(false) }}>
          {
            messages.map((msg, id) => (
              <div key={id} className={`w-[100%] h-auto pl-5 pr-3 py-1 flex ${msg.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}>
                <div onClick={()=>MessageOptions(msg._id)} className={`relative ${msg.senderId === session.user.id ? 'bg-gray-700' : 'bg-indigo-700'} inline-block max-w-[70%] break-words h-auto pl-4 pr-16 pt-1.5 pb-2.5 rounded-lg`}>
                  <p className='text-white/90 tracking-wide'>{msg.message}</p>
                  <div className='absolute bottom-1 right-1 flex justify-end items-end gap-1'>
                    <p className='text-white/80 text-[9px]'>{msg.timestamp}</p>
                    <p className={`${msg.senderId === Chatpage ? 'hidden' : ''}`}><IoCheckmarkDoneSharp className={`h[13px] w-[13px] ${msg.seen ? 'text-blue-500' : 'text-white/70'}`} /></p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {showPicker && (
          <div style={{ position: "absolute", bottom: "60px", zIndex: 1000 }}>
            <Picker width={'450px'} height={'450px'} style={{ marginLeft: '10px' }} onEmojiClick={onEmojiClick} />
          </div>
        )}
        <div className='w-full h-[1%]'></div>
        <div className='w-full h-[10%] flex items-center border-t-1 border-white/50'>
          <div className='md:hidden w-[6%]'></div>
          <MdEmojiEmotions onClick={() => setShowPicker(!showPicker)} className='text-white/80 w-[13%] h-8 max-md:hidden ' />
          <input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type a message"
            type='text' className='bg-white/90 w-[67%] h-[50%] rounded-2xl pl-2' />
          <button onClick={sendMessage} className="beautiful-button ml-2 h-10 flex justify-center items-center">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatpage