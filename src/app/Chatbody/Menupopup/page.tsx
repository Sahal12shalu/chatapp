'use client'
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/navigation'
import Image from 'next/image';

function Menupopup() {

  type UserType = {
    _id:string,
    nickname:string,
    email:string,
    image?:string
  }

    const [showPopup, setShowPopup] = useState(false);
    const [logoutpopup,Setlogoutpopup] = useState(false)
    const { data: session , status} = useSession()
    const [Mydata,Setmydata] = useState<UserType[]>([])
    const router = useRouter()

    const profilePage = () =>{
      router.push(`/profile/${session?.user.id}`)
    }

    useEffect(() => {
       if(!session?.user){
        router.push('/')
       }
    }, [router,session?.user])
    

    useEffect(() => {
        if(status === 'loading') return;
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

      const Logoutbutton = () =>{
        setShowPopup(false)
        Setlogoutpopup(true)
      }


  return (
    <div >
        <FiMenu onClick={() => setShowPopup(true)}  className='text-black w-6 h-6' />

            {showPopup && (
        <div onClick={() => setShowPopup(false)} className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-80 ">
            {
              Mydata.map((value,index)=>(
                <div key={index} className=' p-6 rounded-lg border-b-1 border-black/20 flex flex-col justify-center items-center'>
                  <Image alt='image' width={400} height={400} className='w-40 h-40 rounded-md' src={`${value.image ? value.image === 'A' ? '/unknown3.jpeg' : value.image : '/unknown3.jpeg'  }`} />
            <h2 className="text-xl font-semibold pt-2 font-serif">{value.nickname}</h2>
            <p className='mb-4 text-md'>{value.email}</p>
            </div>
              ))
            }
            <div onClick={profilePage} className='py-2 px-6 bg-black/80 mx-8 text-white rounded-4xl mt-2 m-4 text-center hover:bg-black'>
            <button>Profile</button>
            </div>
            <div onClick={Logoutbutton} className='py-2 px-6 bg-black/80 mx-8 text-white rounded-4xl mt-2 m-4 text-center hover:bg-black'>
            <button>Log out</button>
            </div>
            <div className='px-4 py-2 mx-5'>
            <button
              className="mb-5 h-10 py-1 w-full bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
            </div>
          </div>
        </div>
      )}

      {logoutpopup && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col p-10">
            <p className='text-md font-semibold text-center'>Are you sure<br /> logout the Account</p>
            <div className='flex justify-center gap-4 text-white mt-6'>
              <button onClick={()=>Setlogoutpopup(false)} className='w-25 h-10 bg-black/80 hover:bg-black rounded-full'>Cancel</button>
              <button onClick={()=>signOut()} className='w-25 h-10 bg-red-500 hover:bg-red-600 rounded-full'>Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Menupopup