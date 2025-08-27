'use client'
import React, { useEffect, useState } from 'react'
import { BsWechat } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { useSession } from 'next-auth/react'
import axios from 'axios';
import Link from 'next/link';
import { formatWhatsAppTime } from '../../lib/Formatdate'
import { io } from 'socket.io-client';
import { TbArchiveOff } from "react-icons/tb";
import { FaChevronLeft } from "react-icons/fa6";

let socket;

function Archievepage() {

    const { data: session, status } = useSession()
    const [Alldata, Setalldata] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);

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
        const GetarchieveUsers = async () => {
            if (status === 'loading') return;
            const res = await axios.get(`/api/Signup/archieve?myId=${session.user.id}`)
            Setalldata(res.data.user)
        }
        GetarchieveUsers()
    }, [session?.user?.id])

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
            Setalldata(prev => prev.map(u => u._id === userId ? { ...u, status } : u))
        })

        socket.on('messageDeleted', (deletedId) => {
            Setalldata((prev) => prev.filter(msg => msg._id !== deletedId))
        })

        socket.on('messageEdited', (data) => {
            Setalldata((prev) => prev.map((m) => m._id === data.messageId ? { ...m, message: data.updatemsg } : m))
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

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-800">
            <div className="absolute w-[90%] top-1/20 left-1/2 h-[200px] bg-white/60 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            {
                filteredData.length > 0 ?
                    <div className='w-full z-20 max-w-xl bg-gradient-to-b from-gray-900 via-black to-gray-800 md:to-black h-screen border-1 border-white/30'>

                        <div className='w-full h-[20%] border-b-1 border-white/40'>
                            <div className='h-[48%] w-full flex'>
                                <div className='h-full w-[31%] flex justify-start items-center pl-6'>
                                    <Link href='/Chatcomponent/Chatbody' ><FaChevronLeft className='text-white' /></Link>
                                </div>
                                <div className='h-full w-[33%] flex justify-center items-center'>
                                    <BsWechat className='text-white/90 w-10 h-10' />
                                    <p className='bg-gradient-to-r from-white/70 to-white/90 bg-clip-text text-transparent text-[23px] ml-1 font-semibold' style={{ fontFamily: 'cursive' }}>Chatify</p>
                                </div>
                                <div className='h-full w-[27%] flex justify-end items-center'></div>
                            </div>

                            <div className='h-[50%] w-full flex justify-center items-center'>
                                <div className='w-[85%] h-9 relative'>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch className='text-white/70' /></span>
                                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                        type='text' className='bg-white/20 w-full h-9 rounded-2xl pl-9 text-white ' placeholder='Search user' />
                                </div>
                            </div>
                        </div>

                        <div className='w-full h-[7%] flex items-center'>
                            <p className='ml-3 text-white/80 text-[18px] font-semibold'>Archieved Users</p>
                        </div>

                        <div className='w-full h-[73%] overflow-y-scroll scrollbar-hide'>
                            {
                                filteredData.map((value, id) => (
                                    <Link href={`/Chatcomponent/${value._id}?from=archieve`} key={id} className={`w-full h-[17%] flex ${value._id === session.user.id ? 'hidden' : ''}`}>
                                        <div className='h-full w-[15%] flex justify-center items-center'>
                                            <img src={value.image === 'A' ? '/unknown3.png' : value.image} width={100} height={100} alt='profile' className='w-12 h-12 rounded-full bg-white' />
                                        </div>
                                        <div className='h-full w-[65%] flex flex-col justify-center max-md:pl-3'>
                                            <h1 className={`${value.unseenCount > 0 ? 'text-white' : 'text-white/80'} 'text-[17px]`} style={{ fontWeight: 'bold' }}>{value.username}</h1>
                                            <p style={{ fontFamily: 'serif' }} className={`${value.lastMessage === null ? 'text-white/50' : value.seen ? 'text-white' : 'text-white/80'} text-[14px] tracking-wider max-w-[70%] self-start w-fit overflow-hidden whitespace-nowrap text-ellipsis`}>
                                                {value.lastMessage || 'No messages found...'}</p>
                                        </div>
                                        <div className='h-full w-[20%] flex flex-col'>
                                            <div className='h-[50%] flex items-end justify-center'>
                                                <p className={`${value.unseenCount > 0 ? 'text-white' : 'text-white/80'} text-[14px] flex items-center mt-1`}>{value.lastMessageTime === null ? formatWhatsAppTime(value.createdAt) : formatWhatsAppTime(value.lastMessageTime)}</p>
                                            </div>
                                            <div className='h-[50%] w-full flex justify-center items-start mt-1'>
                                                {value.unseenCount > 0 ? <p className='flex justify-center items-center bg-green-400 rounded-full h-6 w-6 text-[13px]'>
                                                    {value.unseenCount}</p> : ''}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                    :
                    <div className='w-full relative z-20 max-w-xl bg-gradient-to-b from-gray-900 via-black to-gray-800 md:to-black h-screen border-1 border-white/30 flex flex-col justify-center items-center'>
                        <Link href='/Chatcomponent/Chatbody' className='absolute left-5 top-5' ><FaChevronLeft className='text-white' /></Link>
                        <TbArchiveOff className='text-gray-300 w-30 h-30' />
                        <p className='text-white/70 text-[18px]'>No Archieve Chats Found</p>
                    </div>
            }
        </div>
    )
}

export default Archievepage