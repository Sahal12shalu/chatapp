'use client'
import axios from 'axios';
import React, { useEffect, useState, Suspense } from 'react';
import { LuMenu } from "react-icons/lu";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';

let socket;

function Menupage({ menupopup, Setmenupopup, userId, setShowToast, setShowToast2, Setspin }) {

  const [archievepopup, Setarchievepopup] = useState(false)
  const [isArchieve, SetisArchieve] = useState()
  const [unarchievepopup, Setunarchievepopup] = useState(false)
  const [alldltpopup, Setalldltpopup] = useState(false)
  const searchParams = useSearchParams()
  const from = searchParams.get("from")
  const { data: session, status } = useSession()

  const Allmsgdltsubmit =async () =>{
    socket = io('', {
            path: '/api/socket/io',
        });
    const res =await axios.delete(`/api/message/getmessage?myId=${session.user.id}&userId=${userId}`)
    if(res){
      Setalldltpopup(false)
      Setspin(true)
      setTimeout(() => {
        Setspin(false)
      }, 2000)
      socket.emit('clear-all-messages',{
        myId:session.user.id,
        userId:userId
      })
    }
  }

  useEffect(() => {
    from === "archieve" ? SetisArchieve(true) : SetisArchieve(false)
  }, [])

  const Allmsgdltopen =()=>{
    Setmenupopup(false)
    Setalldltpopup(true)
  }

  const Archieveopen = () => {
    Setmenupopup(false)
    Setarchievepopup(true)
  }

  const unArchieveopen = () => {
    Setmenupopup(false)
    Setunarchievepopup(true)
  }

  const UnArchievesubmit = async () => {
    if (status === 'loading') return;
    const res = await axios.delete(`/api/Signup/archieve?userId=${userId}&myId=${session.user.id}`)
    if (res.data.message === 'success') {
      Setunarchievepopup(false)
      Setspin(true)
      setShowToast2(true)
      SetisArchieve(false)
      setTimeout(() => {
        Setspin(false)
        setShowToast2(false)
      }, 2000)
    }
  }

  const Archievesubmit = async () => {
    if (status === 'loading') return;
    const res = await axios.post(`/api/Signup/archieve?userId=${userId}&myId=${session.user.id}`)
    if (res.data.message === 'success') {
      Setarchievepopup(false)
      Setspin(true)
      setShowToast(true)
      SetisArchieve(true)
      setTimeout(() => {
        Setspin(false)
        setShowToast(false)
      }, 2000)
    }
  }

  return (
    <>
      <LuMenu className='text-white h-7 w-7' onClick={() => Setmenupopup(true)} />

      {
        unarchievepopup ? <div className='z-97 fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 
      transform-gpu transition-transform duration-300 ease-out animate-fadeIn'
          style={{ pointerEvents: unarchievepopup ? 'auto' : 'none' }}>
          <div className='bg-gray-700 rounded-md p-10 text-center shadow-xl '>
            <p className='text-white/90 text-[16px] font-semibold'>Are You Sure Want to UnArchieve<br /> this Chat</p>
            <div className='w-full flex justify-center mt-3 gap-4 '>
              <button onClick={() => Setunarchievepopup(false)} className='px-6 py-2 hover:bg-gray-100 bg-white/80 text-black/90 font-semibold rounded-sm'>No</button>
              <button onClick={UnArchievesubmit} className='px-8 py-2 hover:bg-green-400 bg-green-300 font-semibold rounded-sm'>Yes</button>
            </div>
          </div>
        </div> : ''
      }

      {
        archievepopup ? <div className='z-97 fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 
      transform-gpu transition-transform duration-300 ease-out animate-fadeIn'
          style={{ pointerEvents: archievepopup ? 'auto' : 'none' }}>
          <div className='bg-gray-700 rounded-md p-10 text-center shadow-xl '>
            <p className='text-white/90 text-[16px] font-semibold'>Are You Sure Want to Archieve<br /> this Chat</p>
            <div className='w-full flex justify-center mt-3 gap-4 '>
              <button onClick={() => Setarchievepopup(false)} className='px-6 py-2 hover:bg-gray-100 bg-white/80 text-black/90 font-semibold rounded-sm'>No</button>
              <button onClick={Archievesubmit} className='px-8 py-2 hover:bg-green-400 bg-green-300 font-semibold rounded-sm'>Yes</button>
            </div>
          </div>
        </div> : ''
      }
      {
        menupopup ? <div className={`z-96 absolute right-0 top-0 w-[230px] h-[300px] border-1 rounded-bl-lg border-white/60 bg-gray-700
     backdrop-blur-sm transform-gpu ${menupopup ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-out animate-fadeIn`}>
          <div className='text-white h-auto w-full border-b-1 border-white/50 p-4 flex justify-end'>
            <MdOutlineClose className='border-1 border-white/50 hover:bg-gray-600 rounded-sm h-6 w-6' onClick={() => Setmenupopup(false)} /></div>
          {isArchieve ? <button onClick={unArchieveopen} className='text-white hover:bg-gray-600 h-auto w-full border-b-1 border-white/50 px-4 py-3 flex text-[18px]' style={{ fontFamily: 'cursive' }}>Un Archieve</button>
            : <button onClick={Archieveopen} className='text-white hover:bg-gray-600 h-auto w-full border-b-1 border-white/50 px-4 py-3 flex text-[18px]' style={{ fontFamily: 'cursive' }}>Archieve</button>}
          <button onClick={Allmsgdltopen} className='text-white hover:bg-gray-600 h-auto w-full border-b-1 border-white/50 px-4 py-3 flex text-[18px] ' style={{ fontFamily: 'cursive' }}>Clear All messages</button>
        </div> : ''
      }
      {
        alldltpopup ? <div className='z-97 fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 
      transform-gpu transition-transform duration-300 ease-out animate-fadeIn'
          style={{ pointerEvents: alldltpopup ? 'auto' : 'none' }}>
          <div className='bg-gray-700 rounded-md p-10 text-center shadow-xl '>
            <p className='text-white/90 text-[16px] font-semibold'>Are You Sure Delete<br />All messages</p>
            <div className='w-full flex justify-center mt-3 gap-4 '>
              <button onClick={() => Setalldltpopup(false)} className='px-6 py-2 hover:bg-gray-100 bg-white/80 text-black/90 font-semibold rounded-sm'>No</button>
              <button onClick={Allmsgdltsubmit} className='px-8 py-2 hover:bg-green-400 bg-green-300 font-semibold rounded-sm'>Yes</button>
            </div>
          </div>
        </div> : ''
      }

    </>
  )
}

export default function MenuContent(props) {
  return (
    <Suspense fallback={<div></div>} >
      <Menupage {...props} />
    </Suspense>
  )
}

