'use client'
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { IoIosWarning } from "react-icons/io";
import { MdCloudDone } from "react-icons/md";
import { useSession } from 'next-auth/react'
import Toast from '../ui/Toast'

function MeteorsDemo() {

    const [username,Setusername] = useState('')
    const [showToast,setshowToast] = useState(false)
    const [showToast2,setshowToast2] = useState(false)
    const [spin,Setspin] = useState(false)
    const {data : session , status} = useSession()
    const formData = {
      id: session.user.id,
      username: username
    }
    const router = useRouter()

    const Handlesubmit =async (e) =>{
      if(status === 'loading') return;
      e.preventDefault();
      const res =await axios.put('/api/login',formData)
      if(res.data.message === 'success'){
        setshowToast(false)
        setshowToast2(true)
        Setspin(true)
        setTimeout(()=>{
          router.push('/Component/Image')
        },1500)
      }else{
        setshowToast(true)
      }
    }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {showToast ? <Toast message={<div className='flex justify-center items-center gap-2'><IoIosWarning className='text-red-500 text-lg' />
       <span className='text-white/90'>Username Already Exists</span></div>} onClose={() => setshowToast(false)} /> : '' }

      {showToast2 ? <Toast message={<div className='flex justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
      <span className='text-white/90'>Username Added</span></div>} onClose={() => setshowToast2(false)} /> : '' }

      {spin ? <div className='absolute w-full z-99 bg-black/20 flex justify-center items-center h-screen'>
      <div className="w-8 h-8 border-4 border-white border-dashed rounded-full animate-spin"></div></div> : '' }

    <div className="absolute w-[90%] top-1/20 left-1/2 h-[200px] bg-white/60 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="relative w-full max-w-md">
        <form onSubmit={Handlesubmit}>
        <div
          className="relative flex h-full shadow-[4px_-4px_12px_-5px_#ffffff] flex-col items-center justify-end overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-white/30 via-white/20 to-white/20 px-4 py-8">
          <div
            className="mb-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-gray-300">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
            </svg>
          </div>
          
          <h1 className="relative z-50 mb-4 text-xl font-bold text-white/90">
            Enter Username !
          </h1>

          <input type="text" className="bg-black text-white w-50 h-10 rounded-md pl-2" value={username} onChange={(e)=>Setusername(e.target.value)} required/>

          <button className="rounded-lg border border-gray-500 px-6 py-1 mt-4 text-gray-300 hover:border-gray-400 hover:bg-black/20">
            Submit
          </button>

        </div>
        </form>
      </div>
    </div>
  );
}

export default MeteorsDemo
