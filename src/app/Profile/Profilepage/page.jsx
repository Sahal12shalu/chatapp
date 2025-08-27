'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { BsWechat } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa6";
import { useSession } from 'next-auth/react'
import { FaPenSquare } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdCloudDone } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useRouter } from 'next/navigation'
import axios from 'axios';

function Profilepage() {

    const [Mydata, Setmydata] = useState([])
    const { data: session, status } = useSession()
    const [usernamepopup, Setusernamepopup] = useState(false)
    const [imagepopup, Setimagepopup] = useState(false)
    const [deletepopup, Setdeletepopup] = useState(false)
    const [deleteaccount, Setdeleteaccount] = useState(false)
    const [showToast, setshowToast] = useState(false)
    const [showToast2, setshowToast2] = useState(false)
    const [spin, Setspin] = useState(false)
    const [username, Setusername] = useState('')
    const [image, Setimage] = useState(null)
    const [file, Setfile] = useState(null)
    const [showToast3, setShowToast3] = useState(false)
    const [showToast4, setShowToast4] = useState(false)
    const Router = useRouter()

    const deleteAccountsubmit =async () =>{
        const res =await axios.delete(`/api/user/imageupdate?userId=${session.user.id}`)
        if(res.data.message === 'success'){
            Setspin(true)
            setTimeout(() =>{
                Setspin(false)
                Router.push('/')
            },2000)
        }
    }

    const formData2 = {
        id: session?.user.id,
        image: 'A'
    }

    const formData3 = {
        id: session?.user.id || '',
        image: file
    }

    const handledeletsubmit = async () => {
        const res = await axios.put('/api/user/imageupdate', formData2)
        if (res.data.message === 'success') {
            Setimage('A')
            setShowToast4(true)
            Setspin(true)
            setTimeout(() => {
                setShowToast4(false)
                Setspin(false)
                Setdeletepopup(false)
                Setmydata((prev) => prev.map((item) => item._id === session.user.id ? { ...item, image: 'A' } : item))
            }, 2000)
        } else {
            alert(res.data.message)
        }
    }

    const Handleimagesubmit = async () => {
        const res = await axios.put('/api/user/imageupdate', formData3)
        if (res.data.message === 'success') {
            setShowToast3(true)
            Setspin(true)
            setTimeout(() => {
                setShowToast3(false)
                Setspin(false)
                Setimagepopup(false)
                Setmydata((prev) => prev.map((item) => item._id === session.user.id ? { ...item, image: file } : item))
            }, 2000)
        } else {
            alert(res.data.message)
        }
    }

    function fileToBase64(files) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const handleChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const base64List = await fileToBase64(selectedFile)
            Setfile(base64List)
            const objectUrl = URL.createObjectURL(selectedFile)
            Setimage(objectUrl)
        }
    }

    const formData = {
        id: session?.user.id,
        username: username
    }

    const usernameDone = async () => {
        const res = await axios.put('/api/user', formData)
        if (res.data.message === 'success') {
            setshowToast(false)
            setshowToast2(true)
            Setspin(true)
            Setmydata((prev) => prev.map((item) => item._id === session.user.id ? { ...item, username: username } : item))
            setTimeout(() => {
                Setspin(false)
                setshowToast2(false)
                Setusernamepopup(false)
            }, 2500)
        } else {
            setshowToast(true)
            setTimeout(() => {
                setshowToast(false)
            }, 2500)
        }
    }

    useEffect(() => {
        if (status === 'loading') return;
        const Getmydata = async () => {

            const res = await axios.get(`/api/Signup?userId=${session.user.id}`)
            Setmydata([res.data.user])
            Setusername(res.data.user.username)
            Setimage(res.data.user.image)
        }
        Getmydata()
    }, [status, session?.user?.id])

    return (
        <>

            {
                imagepopup ? <div className='z-60 fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 
      transform-gpu transition-transform duration-300 ease-out animate-fadeIn'
                    style={{ pointerEvents: imagepopup ? 'auto' : 'none' }}>
                    <div className='bg-gray-700 rounded-md py-6 px-10 text-center shadow-xl flex flex-col justify-center items-center relative'>
                        <MdCancel className='absolute right-2 top-2 w-6 h-6 text-white' onClick={() => Setimagepopup(false)} />
                        <p className='text-white/90 text-[16px] font-semibold'>Change Image</p>
                        <Image className='w-30 h-30 mt-4 rounded-full' width={100} height={100} alt='image' src={image === 'A' ? '/unknown2.jpg' : image} />
                        <input onChange={handleChange}
                            className="relative mt-3 w-[80%] block min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 
                            py-[0.32rem] text-base font-normal text-neutral-200 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem]
                             file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3
                              file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px]
                               file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary
                                focus:outline-none "
                            type="file"
                            id="formFile"
                        />
                        <button onClick={Handleimagesubmit}
                            className='bg-blue-500 w-30 h-9 rounded-md mt-3 text-white font-semibold hover:bg-blue-600'>Submit</button>
                    </div>
                </div> : ''
            }
            {
                deleteaccount ? <div className='z-60 fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 
      transform-gpu transition-transform duration-300 ease-out animate-fadeIn'
                    style={{ pointerEvents: deleteaccount ? 'auto' : 'none' }}>
                    <div className='bg-gray-700 rounded-md p-10 text-center shadow-xl '>
                        <p className='text-white/90 text-[16px] font-semibold'>Are you Sure delete <br /> Your Account</p>
                        <p className='text-[12px] text-white/50'>if you delete your account your Messages will be delete for all time!</p>
                        <div className='w-full flex justify-center mt-3 gap-4 '>
                            <button onClick={() => Setdeleteaccount(false)} className='px-7 py-1 hover:bg-white/80 bg-white/90 font-semibold rounded-sm'>No</button>
                            <button onClick={deleteAccountsubmit} className='px-8 py-1 hover:bg-red-500 bg-red-400 font-semibold rounded-sm'>Yes</button>
                        </div>
                    </div>
                </div> : ''
            }
            {
                deletepopup ? <div className='z-60 fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 
      transform-gpu transition-transform duration-300 ease-out animate-fadeIn'
                    style={{ pointerEvents: deletepopup ? 'auto' : 'none' }}>
                    <div className='bg-gray-700 rounded-md p-10 text-center shadow-xl '>
                        <p className='text-white/90 text-[16px] font-semibold'>Are you Sure delete <br /> profile Image</p>

                        <div className='w-full flex justify-center mt-3 gap-4 '>
                            <button onClick={() => Setdeletepopup(false)} className='px-7 py-1 hover:bg-white/80 bg-white/90 font-semibold rounded-sm'>No</button>
                            <button onClick={handledeletsubmit} className='px-8 py-1 hover:bg-green-400 bg-green-300 font-semibold rounded-sm'>Yes</button>
                        </div>
                    </div>
                </div> : ''
            }
            {
                usernamepopup ? <div className='z-60 fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 
      transform-gpu transition-transform duration-300 ease-out animate-fadeIn'
                    style={{ pointerEvents: usernamepopup ? 'auto' : 'none' }}>
                    <div className='bg-gray-700 rounded-md p-10 text-center shadow-xl '>
                        <p className='text-white/90 text-[16px] font-semibold'>Change Username</p>

                        <input value={username} onChange={(e) => Setusername(e.target.value)} type='text' className='bg-white mt-3 h-8 w-45 rounded-md font-semibold text-black pl-2' />
                        <div className='w-full flex justify-center mt-3 gap-4 '>
                            <button onClick={() => Setusernamepopup(false)} className='px-4 py-1 hover:bg-white/80 bg-white/90 font-semibold rounded-sm'>Cancel</button>
                            <button onClick={usernameDone} className='px-8 py-1 hover:bg-green-400 bg-green-300 font-semibold rounded-sm'>Done</button>
                        </div>
                    </div>
                </div> : ''
            }
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
                {showToast ? <div className="absolute z-99 top-5 bg-black text-white px-4 py-2 rounded-xl shadow-lg animate-fadeIn">
                    <div className='flex z-99 justify-center items-center gap-2'><IoIosWarning className='text-red-500 text-lg' />
                        <span className='text-white/90'>Username Already Exists</span></div></div> : ''}

                {showToast2 ? <div className="absolute z-99 top-5 bg-black text-white px-4 py-2 rounded-xl shadow-lg animate-fadeIn">
                    <div className='flex z-99 justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
                        <span className='text-white/90'>Username Added</span></div></div> : ''}

                {showToast3 ? <div className="absolute z-99 top-5 bg-black text-white px-4 py-2 rounded-xl shadow-lg animate-fadeIn">
                    <div className='flex z-99 justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
                        <span className='text-white/90'>Image uploaded Success</span></div></div> : ''}

                {showToast4 ? <div className="absolute z-99 top-5 bg-black text-white px-4 py-2 rounded-xl shadow-lg animate-fadeIn">
                    <div className='flex z-99 justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
                        <span className='text-white/90'>Image deleted Success</span></div></div> : ''}

                {spin ? <div className='absolute w-full z-99 bg-black/20 flex justify-center items-center h-screen'>
                    <div className="w-8 h-8 border-4 border-white border-dashed rounded-full animate-spin"></div></div> : ''}
                <div className="absolute w-[90%] top-1/20 left-1/2 h-[200px] bg-white/60 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                {
                    Mydata.map((value, idx) => (
                        <div key={idx} className='w-full z-20 max-w-xl bg-gradient-to-b from-gray-900 via-black to-gray-800 md:to-black h-screen border-1 border-white/30'>
                            <div className='h-[10%] w-full flex justify-center items-center'>
                                <div className='h-full w-[5%] flex justify-center items-center'>
                                    <Link href='/Chatcomponent/Chatbody'><FaChevronLeft className='text-white ml-3' /></Link>
                                </div>
                                <div className='h-full w-[90%] flex justify-center items-center'>
                                    <BsWechat className='text-white/90 w-10 h-10' />
                                    <p className='bg-gradient-to-r from-white/70 to-white/90 bg-clip-text text-transparent text-[23px] ml-1 font-semibold' style={{ fontFamily: 'cursive' }}>Chatify</p>
                                </div>
                                <div className='w-[5%]'></div>
                            </div>
                            <div className='w-full h-[30%] flex justify-center items-center'>
                                <div className='w-40 h-40 rounded-full flex justify-center items-center relative'>
                                    <Image src={value.image === 'A' ? '/unknown2.jpg' : value.image} alt='profile' width={100} height={100} className='w-40 h-40 rounded-full border-2 border-amber-600' />
                                    <FaPenSquare className={`${value.image === 'A' ? 'text-gray-600' : 'text-white'} absolute bottom-2 right-5 h-6 w-6`} onClick={() => Setimagepopup(true)} />
                                    <MdDelete onClick={() => Setdeletepopup(true)} className={`${value.image === 'A' ? 'hidden' : ''} text-red-500 rounded-sm bg-white absolute bottom-2 left-5 h-5.5 w-5.5`} />
                                </div>
                            </div>
                            <div className='w-full h-[30%] flex flex-col justify-start items-center gap-3'>
                                <div className='w-full flex flex-col justify-center items-center'>
                                    <p className='text-white/90 font-semibold text-[18px]'>Username !</p>
                                    <div className='flex'>
                                        <input value={value.username} type='text' className='bg-white h-8 w-55 rounded-md font-semibold text-black pl-2' readOnly />
                                        <FaPenSquare className='text-white h-8 w-8' onClick={() => Setusernamepopup(true)} />
                                    </div>
                                </div>
                                <div className='w-full flex justify-center items-center'>
                                    <p className='text-white/80 text-[18px] tracking-wide font-semibold'>FullName : {value.fullname}</p>
                                </div>
                                <div className='w-full flex justify-center items-center'>
                                    <p className='text-white/80 text-[18px] tracking-wide font-semibold'>Email : {value.email}</p>
                                </div>
                            </div>
                            <div className=' flex flex-col justify-center items-center gap-3'>
                                <Link href='/'><button className='rounded-md w-30 h-10 text-white font-semibold'>Logout</button></Link>
                                <button onClick={()=>Setdeleteaccount(true)} className='rounded-md font-semibold w-35 h-10 text-white bg-red-500 hover:bg-red-600'>Delete Account</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Profilepage