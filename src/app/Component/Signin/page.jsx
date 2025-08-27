'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '../ui/Toast'
import { IoIosWarning } from "react-icons/io";
import { MdCloudDone } from "react-icons/md";
import { getSession, signIn } from 'next-auth/react'

function Signin() {

  const [formData,Setformdata] = useState({
    email:'',
    password:'',
  })
  const router = useRouter()
  const [showToast,setShowToast] = useState(false)
  const [showToast2,setShowToast2] = useState(false)
  const [showToast3,setShowToast3] = useState(false)
  const [spin,Setspin] = useState(false)

  const Handlelogin =async (e) =>{
    e.preventDefault()
     await signIn('credentials',{
      redirect:false,
      email:formData.email,
      password:formData.password
    })
    const session =await getSession()
    if(session.user.message === 'success'){
      Setspin(true)
      setShowToast2(false)
      setShowToast(false)
      setShowToast3(true)
      setTimeout(() => {
        if(session.user.username){
          if(session.user.image){
            router.push('/Chatcomponent/Chatbody')
          }else{
            router.push('/Component/Image')
          }
        }else{
          router.push('/Component/Username')
        }
        }, 1500)
    }else{
      if(session.user.message === 'password not match'){
      setShowToast2(false)
      setShowToast(true)
    }else if(session.user.message === 'Email not found'){
      setShowToast(false)
      setShowToast2(true)
    }
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">

      {showToast ? <Toast message={<div className='flex justify-center items-center gap-2'><IoIosWarning className='text-red-500 text-lg' />
      <span className='text-white/90'>Password is Not Match</span></div>} onClose={() => setShowToast(false)} /> : '' }

      {showToast2 ? <Toast message={<div className='flex justify-center items-center gap-2'><IoIosWarning className='text-red-500 text-lg' />
      <span className='text-white/90'>Email is Not Found</span></div>} onClose={() => setShowToast2(false)} /> : '' }

      {showToast3 ? <Toast message={<div className='flex justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
      <span className='text-white/90'>Login Successfully</span></div>} onClose={() => setShowToast3(false)} /> : '' }

      {spin ? <div className='absolute w-full bg-black/20 flex justify-center items-center h-screen'>
      <div className="w-8 h-8 border-4 border-white border-dashed rounded-full animate-spin"></div></div> : '' }
  {/* Green Glow Effect */}
  <div className="absolute w-[90%] top-1/20 left-1/2 h-[200px] bg-white/60 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
  <form onSubmit={Handlelogin}>
  <div className='rounded-md m-3 bg-gradient-to-b from-white/30 via-white/20 to-white/20 pb-10 pt-7 px-10 md:px-14 flex justify-center items-center flex-col'> 
  <h1 className='font-semibold text-2xl tracking-wide text-white/80'>Login</h1>

  <label className='mt-5 text-white/70 tracking-wide w-full flex justify-start ml-2 text-[15px]'>Email</label>
  <input type='email' onChange={(e)=>Setformdata({...formData,email:e.target.value})} value={formData.email}
    className='bg-black rounded-sm text-white w-[300px] h-[35px] pl-2 text-[14px]' placeholder='demo123@gmail.com' required/>

  <label className='mt-5 text-white/70 tracking-wide w-full flex justify-start ml-2 text-[15px]'>Password</label>
  <input type='passsword' onChange={(e)=>Setformdata({...formData,password:e.target.value})} value={formData.password}
   className='bg-black rounded-sm text-white w-[300px] h-[35px] pl-2' placeholder='.......' required/>

  <Link href='/Component/Signup' className='mt-5 text-white/80 text-[16px] font-semibold w-full flex justify-start'>Create New Account!</Link>

  <button className='mt-2 text-white/80 bg-gradient-to-b from-white/30 via-white/20 to-white/30 w-full py-2 hover:bg-gradient-to-b
  hover:from-white/20 hover:via-white/20 hover:to-white/20 font-semibold rounded-sm'>Login</button>
  </div>
  </form>
</div>
  )
}

export default Signin