'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import Toast from '../ui/Toast'
import { IoIosWarning } from "react-icons/io";
import { MdCloudDone } from "react-icons/md";
import axios from 'axios'
import { useRouter } from 'next/navigation'

function Signup() {

  const [form,Setform] = useState({
    fullname:'',
    email:'',
    password:'',
    confirmpassword:'',
  })
  const [showToast, setShowToast] = useState(false);
  const [showToast2, setShowToast2] = useState(false);
  const [showToast3, setShowToast3] = useState(false);
  const [showToast4, setShowToast4] = useState(false);
  const [spin,Setspin] = useState(false)
  const Router = useRouter()

  const HandleSubmit =async (e) =>{
    e.preventDefault()
    const Name = form.password.length > 7
    console.log(Name)
    if(Name){
    const password = form.password === form.confirmpassword
    if(password){
      const res =await axios.post('/api/Signup',form)
      if(res.data.message === 'success'){
        setShowToast2(false)
        setShowToast(false)
        setShowToast3(false)
        setShowToast4(true)
        Setspin(true)
        setTimeout(() => {
          Setspin(false)
          Router.push('/')
        }, 1500)
      }else{
        setShowToast2(false)
        setShowToast(false)
        setShowToast3(true)
      }
    }else{
      setShowToast2(false)
      setShowToast3(false)
      setShowToast(true)
    }
  }else{
    setShowToast(false)
    setShowToast3(false)
    setShowToast2(true)
  }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {showToast ? <Toast message={<div className='flex justify-center items-center gap-2'><IoIosWarning className='text-red-500 text-lg' />
      <span className='text-white/90'>Password is not same</span></div>} onClose={() => setShowToast(false)} /> : '' }

      {showToast2 ? <Toast message={<div className='flex justify-center items-center gap-2'><IoIosWarning className='text-red-500 text-lg' />
      <span className='text-white/90'>password must be at least 8 characters long </span></div>} onClose={() => setShowToast2(false)} /> : '' }

      {showToast3 ? <Toast message={<div className='flex justify-center items-center gap-2'><IoIosWarning className='text-red-500 text-lg' />
      <span className='text-white/90'>Email Already Used </span></div>} onClose={() => setShowToast3(false)} /> : '' }

      {showToast4 ? <Toast message={<div className='flex justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
      <span className='text-white/90'>User Created Successfully </span></div>} onClose={() => setShowToast4(false)} /> : '' }

      {spin ? <div className='absolute w-full bg-black/20 flex justify-center items-center h-screen'>
      <div className="w-8 h-8 border-4 border-white border-dashed rounded-full animate-spin"></div></div> : '' }
  {/* Green Glow Effect */}
  <div className="absolute w-[90%] top-1/20 left-1/2 h-[200px] bg-white/60 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
  <form onSubmit={HandleSubmit}>
  <div className='rounded-md m-3 bg-gradient-to-b from-white/30 via-white/20 to-white/20 pb-10 pt-7 px-10 md:px-18 flex justify-center items-center flex-col'> 
  <h1 className='font-semibold text-2xl tracking-wide text-white/80'>Sign up</h1>
  <label className='mt-5 text-white/70 tracking-wide w-full flex justify-start ml-2 text-[15px]'>Full Name</label>
  <input onChange={(e)=>Setform({...form,fullname : e.target.value})} value={form.fullname} type='text'
   className='bg-black rounded-sm text-white w-[300px] h-[35px] pl-2 text-[14px]' placeholder='Enter Your Name' required/>

  <label className='mt-5 text-white/70 tracking-wide w-full flex justify-start ml-2 text-[15px]'>Email</label>
  <input onChange={(e)=>Setform({...form,email : e.target.value})} value={form.email} type='email'
   className='bg-black rounded-sm text-white w-[300px] h-[35px] pl-2 text-[14px]' placeholder='demo123@gmail.com' required/>

  <label className='mt-5 text-white/70 tracking-wide w-full flex justify-start ml-2 text-[15px]'>Password</label>
  <input onChange={(e)=>Setform({...form,password : e.target.value})} value={form.password} type='passsword'
   className='bg-black rounded-sm text-white w-[300px] h-[35px] pl-2' placeholder='.......' required/>

  <label className='mt-5 text-white/70 tracking-wide w-full flex justify-start ml-2 text-[15px]'>Confirm password</label>
  <input onChange={(e)=>Setform({...form,confirmpassword : e.target.value})} value={form.confirmpassword} type='password'
   className='bg-black rounded-sm text-white w-[300px] h-[35px] pl-2' placeholder='.......' required/>

  <Link href='/' className='mt-5 text-white/80 text-[16px] font-semibold w-full flex justify-start'>Already Have An Account?</Link>

  <button className='mt-2 text-white/80 bg-gradient-to-b from-white/30 via-white/20 to-white/30 w-full py-2 hover:bg-gradient-to-b
  hover:from-white/20 hover:via-white/20 hover:to-white/20 font-semibold rounded-sm'>Create Account</button>
  </div>
  </form>
</div>
  )
}

export default Signup