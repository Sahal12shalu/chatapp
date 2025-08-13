'use client'
import React, { useState } from 'react'

type MessageType = {
    _id: string,
    sender: string,
    reciever: string,
    message: string,
    timestamp: string,
    seen: boolean
  }

type Msgdltpopupprops = {
    id: string,
    onCancel: () => void;
    onDeletesuccess: () => void;
    OnmessageUpdated: (updatedMessage:MessageType) => void
}

function Msgdltpopup({ id, onCancel, onDeletesuccess, OnmessageUpdated }: Msgdltpopupprops) {

    const [dltpopup, Setdltpopup] = useState<boolean>(false)
    const [updatepopup, Setupdatepopup] = useState<boolean>(false)
    const [updatedmsg, Setupdatedmsg] = useState('')

    const Updatedone =async (e:React.FormEvent) => {
        e.preventDefault();
        const res =await fetch('/api/message',{
            method:'PUT',
            body:JSON.stringify({ updatedmessage:updatedmsg, messageId:id }),
            headers: { "Content-Type": "application/json" },
        })
        if(res.ok){
            onCancel()
            const data =await res.json()
            OnmessageUpdated(data.message)
        }
    }

    const updatebutton = async (e: React.FormEvent) => {
        e.preventDefault()
        Setupdatepopup(true)
        const res = await fetch(`/api/message/getmessage?messageId=${id}`)
        const data = await res.json()
        Setupdatedmsg(data.message[0].message)
    }

    const dltpopupbtn = () => {
        Setdltpopup(true)
    }

    const Deletemessage = async () => {
        const res = await fetch("/api/message", {
            method: "DELETE",
            body: JSON.stringify({ id: id }),
        });

        if (res.ok) {
            Setdltpopup(false)
            onCancel()
            onDeletesuccess()
        }
    }

    return (
        <>
            {
                <div className={`${updatepopup ? 'hidden' : ''}`}>
                    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col p-10">
                            <p className='text-md font-semibold text-center'>Select You Want</p>
                            <div className='text-white mt-6 flex flex-col justify-center items-center w-full gap-3'>
                                <button onClick={updatebutton} className='w-[70%] h-10 bg-black/80 hover:bg-black rounded-full justify-center items-center flex'>Edit</button>
                                <button onClick={dltpopupbtn} className='w-[70%] h-10 bg-black/80 hover:bg-black rounded-full justify-center items-center flex'>Delete</button>
                                <button onClick={onCancel} className='w-[70%] h-10 bg-red-500 hover:bg-red-600 rounded-full justify-center items-center flex'>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                dltpopup ?
                    <div>
                        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col p-10">
                                <p className='text-md font-semibold text-center'>You want delete this Message</p>
                                <div className='text-white mt-6 flex flex-col justify-center items-center w-full gap-3'>
                                    <button onClick={() => Setdltpopup(false)} className='w-[70%] h-10 bg-black/80 hover:bg-black rounded-full justify-center items-center flex'>No</button>
                                    <button onClick={Deletemessage} className='w-[70%] h-10 bg-red-500 hover:bg-red-600 rounded-full justify-center items-center flex'>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div> : ''
            }
            {
                updatepopup ?
                    <div>
                        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col p-10">
                                <p className='text-md font-semibold text-center'>Edit the Message</p>
                                <form onSubmit={Updatedone}>
                                <div className='mt-6 flex justify-center items-center w-full'>
                                        <input type='text' onChange={(e)=>Setupdatedmsg(e.target.value)}
                                         value={updatedmsg} className='border-1 border-black rounded-2xl h-9 w-[80%] pl-3' required/>
                                 
                                </div>
                                <div className='text-white mt-6 flex justify-center items-center w-full gap-3'>
                                    <button onClick={() => Setupdatepopup(false)} className='w-[60%] h-10 bg-red-500 hover:bg-red-600 rounded-full justify-center items-center flex'>No</button>
                                    <button className='w-[70%] h-10 bg-black/80 hover:bg-black rounded-full justify-center items-center flex'>Yes</button>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div> : ''
            }
        </>
    )
}

export default Msgdltpopup