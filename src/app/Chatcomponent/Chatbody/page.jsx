'use client'
import React, { useEffect, useState } from 'react'
import { BsWechat } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { IoArchive } from "react-icons/io5";
import { LuMessageSquareMore } from "react-icons/lu";
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { MdOutlineClose } from "react-icons/md";
import { formatWhatsAppTime } from '../../lib/Formatdate'

let socket;

function Chatbody() {

  const { data: session, status } = useSession()
  const [Mydata, Setmydata] = useState([])
  const [Alldata, Setalldata] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [archieveUser, SetarchieveUser] = useState([])
  const [menuhome, Setmenuhome] = useState(false)

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(Alldata);
    } else {
      const filtered = Alldata.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, Alldata]);

  useEffect(() => {
    if (status === 'loading') return;
    const Getalldata = async () => {
      const res = await axios.get(`/api/login?userId=${session.user.id}`)
      Setalldata(res.data.user)
    }
    Getalldata()
  }, [status, session?.user?.id])

  useEffect(() => {
    if (!session?.user?.id) return;

    socket = io('', {
      path: '/api/socket/io',
    });

    socket.on('connect', () => {
      console.log('Connected:', socket.id);
    });

    socket.emit('user-online', session.user.id)

    socket.on('status-updated', ({ userId, status }) => {
      Setmydata(prev => prev.map(u => u._id === userId ? { ...u, status } : u))
    })

    socket.on('message-received', (data) => {
      Setalldata((prev) => prev.map((chat) => chat._id === data.senderId ? {
        ...chat, lastMessage: data.lastMessage?.message || null,
        lastMessageTime: data.lastMessage?.createdAt || null
      } : chat))
    });

    socket.on('unseen-updates', (data) => {
      Setalldata((prev) => prev.map((chat) => chat._id === data.senderId ? { ...chat, unseenCount: data.unseenCount } : chat))
    })

    return () => {
      socket.disconnect();
    };
  }, [session?.user?.id]);


  useEffect(() => {
    if (status === 'loading') return;
    const Getmydata = async () => {

      const res = await axios.get(`/api/Signup?userId=${session.user.id}`)
      Setmydata([res.data.user])
    }
    Getmydata()
  }, [status, session?.user?.id])

  useEffect(() => {
    const GetarchieveUsers = async () => {
      if (status === 'loading') return;
      const res = await axios.get(`/api/Signup/archieve?myId=${session.user.id}`)
      const unseenlength = res.data.user.filter(user => user.unseenCount > 0)
      const unseenUserLength = unseenlength.length
      res.data.user.unseenUserLength = unseenUserLength
      SetarchieveUser(res.data.user)
    }
    GetarchieveUsers()
  }, [session?.user?.id])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-800">
      <div className="absolute w-[90%] top-1/20 left-1/2 h-[200px] bg-white/60 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className='relative w-full z-20 max-w-xl bg-gradient-to-b from-gray-900 via-black to-gray-800 md:to-black h-screen border-1 border-white/30'>
        {
          menuhome && <div className={`z-96 absolute left-0 top-0 w-[250px] h-[250px] border-1 rounded-bl-lg border-white/60 bg-gray-700
               backdrop-blur-sm transform-gpu transition-transform duration-300 ease-out animate-fadeIn`}>
            <div className='text-white h-auto w-full border-b-1 border-white/50 p-4 flex justify-end'>
              <MdOutlineClose onClick={()=>Setmenuhome(false)} className='border-1 border-white/50 hover:bg-gray-600 rounded-sm h-6 w-6' /></div>
            <Link href='/Chatcomponent/Archieve'><button className='text-white hover:bg-gray-600 h-auto w-full border-b-1 border-white/50 px-4 py-3 flex text-[18px]'>Archieve Page</button></Link>
            <Link href='/Profile/Profilepage'><button className='text-white hover:bg-gray-600 h-auto w-full border-b-1 border-white/50 px-4 py-3 flex text-[18px] '>Profile</button></Link>
            <Link href='/'><button className='text-white hover:bg-gray-600 h-auto w-full border-b-1 border-white/50 px-4 py-3 flex text-[18px] '>Logout</button></Link>
          </div>
        }
        <div className='w-full h-[20%] border-b-1 border-white/40'>
          <div className='h-[48%] w-full flex'>
            <div className='h-full w-[31%] flex justify-start items-center pl-6'>
              <HiDotsHorizontal className='text-white w-6 h-6' onClick={() => Setmenuhome(true)} />
            </div>
            <div className='h-full w-[33%] flex justify-center items-center'>
              <BsWechat className='text-white/90 w-10 h-10' />
              <p className='bg-gradient-to-r from-white/70 to-white/90 bg-clip-text text-transparent text-[23px] ml-1 font-semibold' style={{ fontFamily: 'cursive' }}>Chatify</p>
            </div>
            <div className='h-full w-[27%] flex justify-end items-center'>
              {
                Mydata.map((value, ind) => (
                  <Link key={ind} href='/Profile/Profilepage' className='mt-1 max-md:w-13 max-md:h-13 w-11 h-11 rounded-full'>
                    <Image src={value.image === 'A' ? '/unknown2.jpg' : value.image} width={100} height={100} alt='profile' className='rounded-full w-full h-full' /></Link>
                ))
              }
            </div>
          </div>

          <div className='h-[50%] w-full flex justify-center items-center'>
            <div className='w-[85%] h-9 relative'>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch className='text-white/70' /></span>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                type='text' className='bg-white/20 w-full h-9 rounded-2xl pl-9 text-white ' placeholder='Search user' />
            </div>
          </div>
        </div>

        <Link href='/Chatcomponent/Archieve'><div className={`w-full max-md:h-[8%] h-[10%] border-b-1 border-white/40 flex ${archieveUser.length > 0 ? 'text-white' : 'text-white/80'} items-center`}>
          <div className='flex w-[90%]'>
            <p className='w-[8%]'></p>
            <IoArchive className='md:h-7 md:w-7 h-8 w-8' />
            <p className='ml-10 md:mt-0 mt-1 font-semibold text-[18px]'>Archieved Chat</p>
          </div>
          <div className='w-[18%] md:w-[14%] flex gap-2 ml-2'>
            {
              archieveUser.unseenUserLength > 0 ?
                <p className='flex justify-center items-center text-white bg-green-400 text-[14px] rounded-full h-6 w-6 '>{archieveUser.unseenUserLength}</p>
                : ''
            }
            <LuMessageSquareMore className={`text-white w-6 h-6 md:h-6 md:w-6 ${archieveUser.length > 0 ? '' : 'hidden'}`} />
          </div>
        </div></Link>

        <div className='w-full h-[70%] overflow-y-scroll scrollbar-hide'>
          {
            filteredData.map((value, id) => (
              <Link href={`/Chatcomponent/${value._id}?from=chatbody`} key={id} className={`w-full h-[17%] flex ${value._id === session.user.id ? 'hidden' : ''}`}>
                <div className='h-full w-[15%] flex justify-center items-center'>
                  <img src={value.image === 'A' ? '/unknown3.png' : value.image} width={100} height={100} alt='profile' className='w-12 h-12 rounded-full bg-white' />
                </div>
                <div className='h-full w-[65%] flex flex-col justify-center max-md:pl-3'>
                  <h1 className={`${value.unseenCount > 0 ? 'text-white' : 'text-white/80'} 'text-[17px]`} style={{ fontWeight: 'bold' }}>{value.username}</h1>
                  <p style={{ fontFamily: 'serif' }} className={`${value.lastMessage === null ? 'text-white/50' : value.seen ? 'text-white' : 'text-white/70'} text-[14px] tracking-wider max-w-[70%] self-start w-fit overflow-hidden whitespace-nowrap text-ellipsis`}>
                    {value.lastMessage || 'No messages found...'}</p>
                </div>
                <div className='h-full w-[20%] flex flex-col'>
                  <div className='h-[50%] flex items-end justify-center'>
                    <p className={`${value.unseenCount > 0 ? 'text-white' : 'text-white/80'} text-[14px] flex items-center mt-1`}>{value.lastMessageTime === null ? formatWhatsAppTime(value.createdAt) : formatWhatsAppTime(value.lastMessageTime)}</p>
                  </div>
                  <div className='h-[30%] w-full flex justify-center items-center mt-1'>
                    {value.unseenCount > 0 ? <p className='flex justify-center items-center bg-green-400 rounded-full h-6 w-6 text-[13px]'>
                      {value.unseenCount}</p> : ''}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Chatbody
