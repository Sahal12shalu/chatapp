'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { io } from 'socket.io-client';

let socket;

function Messageoption({ messageId, onDeleteSuccess, myId, userId, Setspin }) {

    const [deletepopup, Setdeletepopup] = useState(false)
    const [editpopup, Seteditpopup] = useState(false)
    const [updatemsg, Setupdatemsg] = useState('')
    const data = {
        messageId: messageId,
        senderId: myId,
        receiverId: userId
    }

    const data2 = {
        messageId:messageId,
        updatemsg:updatemsg,
        senderId: myId,
        receiverId: userId
    }

    const Editsubmit = async (updatemsg) => {
        socket = io('', {
            path: '/api/socket/io',
        });
        const res = await axios.put(`/api/message/getmessage?msgId=${messageId}&updateMsg=${updatemsg}`)
        if (res) {
            Setspin(true)
            setTimeout(() => {
                Setspin(false)
                Seteditpopup(false)
                onDeleteSuccess()
                socket.emit('editMessage', data2)
            }, 2000)
        }
    }

    const editButton = async () => {
        const res = await axios.get(`/api/message/getmessage?msgId=${messageId}`)
        Setupdatemsg(res.data.messages.message)
        Seteditpopup(true)
    }

    const Deletesubmit = async () => {
        socket = io('', {
            path: '/api/socket/io',
        });
        const res = await axios.delete(`/api/message?msgId=${messageId}`)
        if (res.data.message === 'success') {
            Setdeletepopup(false)
            onDeleteSuccess()
            socket.emit('deleteMessage', data)
        }
    }

    return (
        <>
            <div className={`${deletepopup || editpopup ? 'hidden' : ''} bg-gradient-to-b from-gray-700 via-gray-600 to-gray-500 z-90 border-1 border-white/30  rounded-lg flex flex-col animate-fadeIn`} onClick={(e) => e.stopPropagation()}>
                <button className='w-full h-[50%] px-10 hover:bg-black/30 py-5 flex justify-center items-center text-white text-[18px] font-semibold
         border-b-1 border-white/40' onClick={editButton}>
                    Edit Message
                </button>
                <button onClick={() => Setdeletepopup(true)}
                    className='w-full h-[50%] px-10 py-5 hover:bg-black/30 flex justify-center items-center text-white text-[18px] font-semibold'>
                    Delete Message
                </button>
            </div>

            {
                deletepopup && (
                    <div className='bg-gradient-to-b animate-fadeIn from-gray-700 via-gray-600 to-gray-500 z-90 border-1 border-white/30  rounded-lg flex flex-col p-5' onClick={(e) => e.stopPropagation()}>
                        <div className='text-white/90 font-semibold text-[16px] text-center'>Are you Sure Delete the <br /> Message</div>
                        <div className='flex justify-center items-center gap-4 mt-2'>
                            <button onClick={() => Setdeletepopup(false)} className='px-5 py-1 bg-white/60 hover:bg-white/50 text-black rounded-lg '>No</button>
                            <button onClick={Deletesubmit} className='px-7 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg '> Yes</button>
                        </div>
                    </div>
                )
            }
            {
                editpopup && (
                    <div className='bg-gradient-to-b animate-fadeIn from-gray-700 via-gray-600 to-gray-500 z-90 border-1 border-white/30  rounded-lg flex flex-col p-5' onClick={(e) => e.stopPropagation()}>
                        <h1 className="relative z-50 mb-4 text-xl font-bold text-white/90 text-center">
                            Edit Message !
                        </h1>
                        <input onChange={(e) => Setupdatemsg(e.target.value)}
                            type="text" value={updatemsg} className="bg-black text-white w-50 h-10 rounded-md pl-2" />
                        <button onClick={() => Editsubmit(updatemsg)}
                            className="rounded-lg border border-white/40 px-6 py-1 mt-4 font-semibold text-gray-300 bg-blue-900 hover:bg-blue-950">
                            Submit
                        </button>
                    </div>
                )
            }
        </>
    )
}

export default Messageoption