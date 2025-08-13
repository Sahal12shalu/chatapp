'use client'
import React, { useEffect, useState } from 'react'
import { FiEdit3 } from "react-icons/fi";
import { signOut , useSession } from 'next-auth/react';
import { io } from 'socket.io-client'
import Link from 'next/link';
import { FaAngleLeft } from "react-icons/fa6";
import { MdCancel } from 'react-icons/md'
import './page.css'
import { toast, ToastContainer } from 'react-toastify';
import FileEdit from '../Imagedit/page';
import Image from 'next/image';
const socket = io({
  path: '/api/socket'
})

function Profilepage() {

  type UserType = {
    _id: string,
    nickname: string,
    email: string,
    image?: string
    online: boolean
    name:string
  }

  const [deletepopup, Setdeletepopup] = useState(false)
  const [userData,SetuserData] = useState<UserType[]>([])
  const [Newnickname,Setnickname] = useState('')
  const { data: session , status } = useSession()
  const [nicknamepopup,Setnicknamepopup] = useState<boolean>(false)
  const [imageshowpopup,Setimageshowpopup] = useState<boolean>(false)
  const [message,Setmessage] = useState('')

  const cancelEditimage = () =>{
    Setimageshowpopup(false)
  }

  const Handlesubmit =async (e:React.FormEvent) =>{
          e.preventDefault()
          const res = await fetch("/api/register", {
        method: "PUT",
        body: JSON.stringify({Newnickname,email:session?.user?.email}),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json()
      if (data.message === 'success') {
        SetuserData((prev) => prev.map((user) =>user._id ? { ...user, nickname:Newnickname} : user) )
        Setnicknamepopup(false)
        toast('Nickname changed successfully')
      } else {
        Setmessage(data.message);
      }
      }

  useEffect(() => {
      if (status === 'loading') return;
      const Getmydetails = async () => {
        const res = await fetch("/api/register/user", {
          method: "POST",
          body: JSON.stringify({ id: session?.user.id }),
        });
  
        if (res.ok) {
          const datas = await res.json();
          SetuserData([datas.message])
          Setnickname(datas.message.nickname)
          socket.on('user-status-changed', ({ userId, online }) => {
            SetuserData((prev) => prev.map((user) => user._id === userId ? { ...user, online } : user))
          })
          return () => { socket.off('user-status-changed') }
        } else {
          alert('error')
        }
      }
      Getmydetails()
    }, [status,session?.user.id])

  const deletebutton = () => {
    Setdeletepopup(true)
  }

  const Deleteaccountbtn =async () =>{
        const res= await fetch('/api/register',{
          method: "DELETE",
          body: JSON.stringify({ userId : session?.user.id }),
        })
        if(res.ok){
          signOut()
        }
      }

  return (
    <div className='bg-gradient-to-r from-gray-700 to-gray-600 w-full h-[100vh] flex justify-center items-center relative'>
      <ToastContainer />
      {
            userData.map((value, index) => (
      <div key={index} className='w-full max-w-xl h-[100vh] md:h-[97vh] bg-gradient-to-r from-white/90 to-white/80 md:rounded-2xl'>
        <div className='w-full max-md:h-[8%] h-[14%] p-7'> 
          <Link href='/Chatbody/Body'><FaAngleLeft /></Link>
        </div>

        <div className='w-full h-[35%] flex justify-center items-center'>
          <div className='h-41 w-41 relative'>
            <Image alt='image' width={400} height={400} src={`${value.image ? value.image === 'A' ? '/unknown3.jpeg' : value.image : '/unknown3.jpeg'}`} className='h-41 w-41 rounded-full' />
            <div onClick={()=>Setimageshowpopup(true)} className='w-8 h-8 rounded-full bg-black absolute bottom-2 right-5 flex justify-center items-center'>
              <FiEdit3 className=' w-4 h-4 text-white rounded-full' />
            </div>
          </div>
        </div>

        <div className='w-full h-[40%] flex flex-col mt-2'>
          <div className='w-full flex flex-col items-center'>
            <p className='tracking-wide text-lg font-semibold'>Nickname</p>
            <div className='flex w-full gap-0.5 justify-center'>
              <input type='text' value={value.nickname} className='h-8 w-[60%] md:w-[40%] font-semibold bg-white rounded-sm shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] border-black pl-2' readOnly />
              <button onClick={()=>Setnicknamepopup(true)} className='w-8 h-8 shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex justify-center items-center bg-gray-100 rounded-sm'>
                <FiEdit3 className=' w-4 h-4' />
              </button>
            </div>
            <div className='mt-3 flex flex-col justify-center items-center'>
              <p className='text-[17px]'><span className='font-semibold'>Email :</span> {value.email}</p>
              <p className='text-[17px] mt-2'><span className='font-semibold'>Full Name :</span> {value.name}</p>
              <p className='mt-7 font-semibold text-[16px]'>Your Id : {value._id}</p>
              <button onClick={deletebutton}
                className='mt-5 hover:bg-red-700 bg-red-500 rounded-sm text-center h-9 w-35 text-white font-semibold'>Delete Account</button>
            </div>
          </div>
        </div>
      </div>
       )) }

      {deletepopup && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-90 flex flex-col p-10">
            <p className='text-md font-semibold text-center'>Are you sure<br /> Delete Your Account</p>
            <p className='w-full text-sm text-black/50 text-center'>you will lose your all images,chats,etc...</p>
            <div className='flex justify-center gap-4 text-white mt-6'>
              <button onClick={()=>Setdeletepopup(false)} className='w-25 h-10 bg-black/80 hover:bg-black rounded-full'>Cancel</button>
              <button onClick={Deleteaccountbtn} className='w-25 h-10 bg-red-500 hover:bg-red-600 rounded-full'>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {nicknamepopup && (
        <div className="bg-gradient-to-r bg-black/20 w-full h-[100vh] flex justify-center items-center absolute" onClick={()=>Setnicknamepopup(false)}>
            <div className="relative w-full max-md:mx-5 max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
              
                <form onSubmit={Handlesubmit}>
                <div className="relative flex justify-center items-center h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-white px-4 py-8 shadow-xl">
                    <MdCancel onClick={()=>Setnicknamepopup(false)} className='absolute top-2 right-2 h-6 w-6' />
                    <h1 className="relative z-50 mb-2 text-xl font-bold text-black">
                        Enter Nickname
                    </h1>
                    <p className="relative z-50 mb-4 text-base font-normal text-slate-600 text-center">
                        enter your nickname it will show for others when you chatting
                    </p>
                    <p className="text-rose-500 text-start">{message}</p>
                    <input value={Newnickname} onChange={(e)=>Setnickname(e.target.value)} type="text" className="border-1 z-99 border-gray-600 rounded-xl mb-3 h-12 pl-3" required/>

                    <button className="beautiful-button rounded-lg borderpx-4 py-1 text-black/90">
                        Submit
                    </button>
                    
                </div>
                </form>

            </div>
        </div>
      )}

      {
        imageshowpopup ? <FileEdit onCancel={cancelEditimage} /> : ''
      }
    </div>
  )
}

export default Profilepage