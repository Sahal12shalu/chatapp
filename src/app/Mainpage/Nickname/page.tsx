'use client'
import React, { useState } from "react";
import './page.css'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function MeteorsDemo() {

    const router = useRouter()
    const [nickname,Setnickname] = useState('')
    const { data: session } = useSession()
    const [message,Setmessage] = useState('')

    const Handlesubmit =async (e:React.FormEvent) =>{
        e.preventDefault()
        const res = await fetch("/api/register", {
      method: "PUT",
      body: JSON.stringify({nickname,email:session?.user?.email}),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json()
    if (data.message === 'success') {
      router.push("/Mainpage/Image");
    } else {
      Setmessage(data.message);
    }
    }
    
    
    return (
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 w-full h-[100vh] flex justify-center items-center">
            <div className="relative w-full max-md:mx-5 max-w-md">
                <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
                <form onSubmit={Handlesubmit}>
                <div className="relative flex justify-center items-center h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-white px-4 py-8 shadow-xl">
                    
                    <h1 className="relative z-50 mb-2 text-xl font-bold text-black">
                        Enter Nickname
                    </h1>
                    <p className="relative z-50 mb-4 text-base font-normal text-slate-600 text-center">
                        enter your nickname it will show for others when you chatting
                    </p>
                    <p className="text-rose-500 text-start">{message}</p>
                    <input onChange={(e)=>Setnickname(e.target.value)} type="text" className="border-1 z-99 border-gray-600 rounded-xl mb-3 h-12 pl-3" required/>

                    <button className="beautiful-button rounded-lg borderpx-4 py-1 text-black/90">
                        Submit
                    </button>
                    
                </div>
                </form>
            </div>
        </div>
    );
}
