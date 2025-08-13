'use client'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { useSession } from 'next-auth/react'
import Link from 'next/link';
import Menupopup from '../Menupopup/page';
import { BsXLg } from 'react-icons/bs'
import { io } from 'socket.io-client'
import Image from 'next/image';
const socket = io({
  path: '/api/socket'
})

function Body() {

  type UserType = {
    _id: string,
    nickname: string,
    email: string,
    image?: string
  }

  type AllUserType = {
    _id: string,
    nickname: string,
    email: string,
    image?: string
    online: boolean
  }

  type ArchieveType = {
    _id: string,
    userId: string,
    archievedUserid: string,
    category:string
  }

  interface ArchieveItem  {
    userId:string;
    archievedUserid: string;
    category:string;
  }

  type Message = {
  userId: string;
  lastMessageTime: string;
};

  const { data: session, status } = useSession()

  const [Mydata, Setmydata] = useState<UserType[]>([])
  const [selectedTab, SetselectedTab] = useState<string>('All')
  const [Archievedata,SetArchievedata] = useState<ArchieveType[]>([])
  const [fulluserList,SetfulluserList] = useState<AllUserType[]>([])
  const [filtereduserList,SetfiltereduserList] = useState<AllUserType[]>([])
  const [Familyusers,Setfamilyusers] = useState([])
  const [Friendsusers,Setfriendsusers] = useState([])
  const [Archieveusers,Setarchieveusers] = useState([])
  const [Allusers,Setallusers] = useState<string[]>([])
  const [Searchbutton,Setseachbutton] = useState(false)
  const [searchTerm,SetsearchTerm] = useState('')
  const [LastmsgTime,SetLastmsgTime] = useState<Record<string,string | null >>({})
  const [unseencount,Setunseencount] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchunseencount =async () =>{
      const res = await fetch(`/api/message/Allmessage?userId=${session?.user.id}`)
       const data =await res.json()
       Setunseencount(data.message)
    }
    fetchunseencount()

    const interval = setInterval(fetchunseencount, 5000)
    return () => clearInterval(interval)
  }, [session?.user.id])
  
  useEffect(() => {
    if (status === 'loading') return;
    const getLastmessage = async () =>{
      const Userids = fulluserList.map((user)=> user._id)
      const res = await fetch('/api/message/Allmessage',{
        method:'POST',
        body:JSON.stringify({
            Myid : session?.user.id,
            Userids
        }),
        headers:{'Content-Type' : 'application/json'}
      })
      const data = await res.json()
      const msgTimeObj = data.message.reduce((acc:Record<string, string>, curr: Message) =>{
        acc[curr.userId] = curr.lastMessageTime;
        return acc
      },{})
      SetLastmsgTime(msgTimeObj)
    }
    getLastmessage()
  }, [fulluserList,session?.user.id,status])
  

  const Searchfiltereduser = filtereduserList.filter((user)=> user.nickname?.toLowerCase().includes(searchTerm.toLowerCase()))

  const FilterarchievedUsers = (category: string) => {
  SetselectedTab(category);

  if (category === "All") {
    const archivedAllIds = Archievedata.filter(
      item => item.userId === session?.user.id && item.category === "All"
    ).map(item => item.archievedUserid.toString());
    const allArchivedIds = Archievedata.filter(
      item => item.userId === session?.user.id
    ).map(item => item.archievedUserid.toString());
    const notArchivedUsers = fulluserList.filter(user =>
      !allArchivedIds.includes(user._id.toString()));

    const archivedAllUsers = fulluserList.filter(user =>
      archivedAllIds.includes(user._id.toString()));

    const combinedUsers = [...archivedAllUsers, ...notArchivedUsers];
    SetfiltereduserList(combinedUsers);

  } else {
    const filteredUserIds = Archievedata.filter(
      item => item.userId === session?.user.id && item.category === category
    ).map(item => item.archievedUserid.toString());

    const ArchivedUserDetails = fulluserList.filter(user =>
      filteredUserIds.includes(user._id.toString())
    );

    SetfiltereduserList(ArchivedUserDetails);
  }
};

  useEffect(() => {
    if (status === 'loading') return;
    const fetchArchieve = async () => {
      const res = await fetch(`/api/archieve?userId=${session?.user.id}`)
      const data = await res.json()
      SetArchievedata(data.archieve)

      Setallusers(data.archieve.filter((item:ArchieveItem) => item.userId === session?.user.id && item.category === 'All' ))
      Setfamilyusers(data.archieve.filter((item:ArchieveItem) => item.userId === session?.user.id && item.category === 'Family'))
      Setfriendsusers(data.archieve.filter((item:ArchieveItem) => item.userId === session?.user.id && item.category === 'Friends'))
      Setarchieveusers(data.archieve.filter((item:ArchieveItem) => item.userId === session?.user.id && item.category === 'Archieve'))
      
      const userRes = await fetch("/api/register")
      const userData = await userRes.json()
      SetfulluserList(userData.message)
      const archivedAllIds = data.archieve
      .filter(
      (item:ArchieveItem) => item.userId === session?.user.id && item.category === "All"
    ).map((item:ArchieveItem) => item.archievedUserid.toString());

    const allArchivedIds = data.archieve.filter((item:ArchieveItem) => item.userId === session?.user.id
    ).map((item:ArchieveItem) => item.archievedUserid.toString());

    const notArchivedUsers = userData.message.filter((user:AllUserType) =>
      !allArchivedIds.includes(user._id.toString())
    );

    const archivedAllUsers = userData.message.filter((user:AllUserType) =>
      archivedAllIds.includes(user._id.toString())
    );

    const combinedUsers = [...archivedAllUsers, ...notArchivedUsers];
    Setallusers(combinedUsers)
    SetfiltereduserList(combinedUsers);
    }
    fetchArchieve()

    socket.on('user-status-changed',({userId,online}) => {
      SetfiltereduserList((prev) => prev.map((user) => user._id === userId ? {...user,online} : user))
    })
    return() => { socket.off('user-status-changed')}
  }, [session?.user.id,status])

  useEffect(() => {
    if(!session?.user.id) return ;
    socket.emit('user-connected',session.user.id)
  }, [session?.user.id,status])
  

  
  useEffect(() => {
    if (status === 'loading') return;
    const Getmydetails = async () => {
      const res = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({ email: session?.user?.email }),
      });

      if (res.ok) {
        const datas = await res.json();
        Setmydata([datas.message])
      } else {
        alert('error')
      }
    }
    Getmydetails()
  }, [status,session?.user?.email])

  return (
    <div className='bg-gradient-to-r from-gray-700 to-gray-600 w-full h-[100vh] flex justify-center items-center'>
      <div className='w-full max-w-xl h-[100vh] md:h-[97vh] bg-gradient-to-r from-white/70 to-white/50 md:rounded-2xl'>
        <div className={`md:h-[20%] ${Searchbutton ? 'h-[12%]' : 'h-[15%]' } w-full text-black flex justify-between items-center px-4 md:px-10 `}>
          {
            Mydata.map((user, index) => (
              <div className='flex' key={index}>
                <Image alt='picture' width={500} height={300} src={`${user.image ? user.image === 'A' ? '/unknown3.jpeg' : user.image : '/unknown3.jpeg'}`} className='w-18 h-18 object-fill rounded-full' />
                <div className='items-start flex-col justify-center flex ml-2 md:ml-4'>
                  <h1 className='font-semibold text-xl font-serif'>{user.nickname}</h1>
                  <p className='text-sm tracking-wider pt-1'>{user.email}</p>
                </div>
              </div>
            ))
          }

          <div className='flex justify-center items-center gap-2 md:gap-5'>
            {
              Searchbutton ? <div className='relative'><input type='text' className='bg-white rounded-md max-md:hidden h-7 pl-2' placeholder='Search'
              value={searchTerm} onChange={(e) => SetsearchTerm(e.target.value)} />
              <span onClick={()=>Setseachbutton(false)} className='absolute right-1 max-md:hidden top-[20%]'><BsXLg /></span></div> : ''
            }
            {
              Searchbutton ? '' : <FaSearch className='text-black w-6 h-6 max-md:hidden' onClick={()=>Setseachbutton(true)} />
            }
            <FaSearch className='text-black w-6 h-6 md:hidden' onClick={()=>Setseachbutton(!Searchbutton)} />
            <Menupopup />
          </div>
        </div>
        {
          Searchbutton ? 
          <div className='h-7 md:hidden flex justify-center items-center'>
          <div className='relative w-[80%] flex justify-center items-center'><input type='text' className='bg-white rounded-md md:hidden w-[100%] pl-2 h-7'
          value={searchTerm} onChange={(e) => SetsearchTerm(e.target.value)} />
          <span onClick={()=>Setseachbutton(false)} className='absolute right-1 md:hidden top-[20%]'><BsXLg /></span></div>
        </div> : ''
        }
        <div className='h-[6%] px-10 -tracking-normal text-3xl font-extrabold text-black/70'>Chat </div>
        <div className='h-[7%] text-black bg-gradient-to-r from-white/70 to-white/50 rounded-4xl flex justify-between items-center'>
          <button onClick={() => FilterarchievedUsers('All')} className={`${selectedTab === 'All' ? 'bg-white' : ''} 
          text-lg font-semibold text-black/70 w-[20%] flex justify-center items-center transition-opacity duration-500 rounded-4xl h-full`}>All
          {Allusers.length === 1 ? null : <span className='bg-green-500/80 rounded-full w-3 h-3 mt-0.5 ml-1'></span>}</button>

          <button onClick={() => FilterarchievedUsers('Family')} className={`${selectedTab === 'Family' ? 'bg-white' : ''} 
          text-lg font-semibold text-black/70 w-[25%] flex justify-center items-center transition-opacity duration-500 rounded-4xl h-full`}>Family
          {Familyusers.length === 0 ? '' : <span className='bg-green-500/80 rounded-full w-3 h-3 mt-0.5 ml-1'></span>}</button>
          
          <button onClick={() => FilterarchievedUsers('Friends')} className={`${selectedTab === 'Friends' ? 'bg-white' : ''} 
          not-odd:text-lg font-semibold text-black/70 w-[25%] flex justify-center items-center transition-opacity duration-300 rounded-4xl h-full`}>Friends
          {Friendsusers.length === 0 ? '' : <span className='bg-green-500/80 rounded-full w-3 h-3 mt-0.5 ml-1'></span>}</button>
          
          <button onClick={() => FilterarchievedUsers('Archieve')} className={`${selectedTab === 'Archieve' ? 'bg-white' : ''} 
          text-lg font-semibold text-black/70 w-[30%] flex justify-center items-center rounded-4xl transition-opacity duration-300 h-full`}>Archieve
          {Archieveusers.length === 0 ? '' : <span className='bg-green-500/80 rounded-full w-3 h-3 mt-0.5 ml-1'></span>}</button>
        </div>
        <div className='md:h-[66%] h-[70%] bg-gradient-to-r from-white/90 to-white/70 rounded-2xl mt-[1%] mx-1 overflow-scroll scrollbar-hide'>
          <p className='font-semibold py-2 px-4 text-black/70 text-md'>Conversation</p>
          <div className='border-b-1 border-gray-300'></div>

          {
            Searchfiltereduser.length > 0 ?
            Searchfiltereduser.map((value, index) => (
              <Link href={`/Chatbody/${value._id}`} key={index}><div className={`${value.email === session?.user.email ? 'hidden' : ''}`}>
                <div className=' w-full h-[100px] flex justify-between px-5 bg-gradient-to-r from-white/90 to-white/70 hover:bg-white'>
                  <div className='flex gap-5 items-center'>
                    <div className=''>
                      <Image alt='image' width={500} height={300} src={`${value.image ? value.image === 'A' ? '/unknown3.jpeg' : value.image : '/unknown3.jpeg'}`} className='h-17 w-17 rounded-full' />
                    </div>
                    <div className=''>
                      <p className={`${unseencount[value._id] > 0 ? 'text-black' : 'text-black/70'} font-semibold text-lg `}>{value.nickname}</p>
                      <p className={`${value.online ? 'text-green-400' : 'text-black/70' } text-[14px] tracking-wide`}>{value.online ? 'Online' : 'offline'}</p>
                    </div>
                  </div>
                  <div className='flex flex-col mt-6'>
                    <p className='text-sm font-extralight text-black/70'>{LastmsgTime[value._id] ? LastmsgTime[value._id] : '' }</p>
                    {unseencount[value._id] > 0 ? (
                    <div className='w-full h-full flex justify-center'><p className='w-7 h-7 rounded-full bg-green-700 text-white font-semibold flex justify-center items-center text-sm md:mt-1'>{unseencount[value._id]}</p></div>
                    ) : ''}
                  </div>
                </div>
                <div className='border-b-1 border-gray-300'></div>
              </div></Link> 
            )) : <div className='flex justify-center items-center w-full h-[91%]'><Image alt='image' width={500} height={300} src='/nodata2.png' className='w-40 h-40' /></div>
          }
          <div className='border-b-1 border-gray-300'></div>
        </div>
      </div>
    </div>
  )
}

export default Body