'use client'
import React, { useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSession } from 'next-auth/react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { ToastContainer, toast } from 'react-toastify';
interface Archieveprops {
    userId: string;
    onAllDeletesuccess: () => void;
}

export default function Menumain({ userId , onAllDeletesuccess }: Archieveprops) {

    const [openPopup, SetopenPopup] = useState<boolean>(false)
    const [archeivepopup, Setarcheivepopup] = useState<boolean>(false)
    const [Clearallpopup, Setclearallpopup] = useState<boolean>(false)
    const [value, setValue] = React.useState('');
    const { data: session } = useSession()

    const Clearallmessage = async() =>{
        const res = await fetch("/api/message/Allmessage", {
          method: "DELETE",
          body: JSON.stringify({ Myid:session?.user.id , UserId : userId }),
        });
        if(res.ok){
            Setclearallpopup(false)
            onAllDeletesuccess()
        }
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = await fetch('/api/archieve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: session?.user.id,
                archievedUserid: userId,
                category: value
            })
        })
        if (res.ok) {
            Setarcheivepopup(false)
            toast('Archieved success')
        } else {
            alert('error')
        }
    };

    return (
        <div className='m-4'>
            <ToastContainer />
            <BsThreeDotsVertical className='h-6 w-6' onClick={() => SetopenPopup(true)} />
            {
                archeivepopup ?
                    <div>
                        <div onClick={() => Setarcheivepopup(false)} className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
                            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-80 flex flex-col pt-8">
                                <p className='text-lg tracking-wider font-semibold text-center text-black'>Where should it be<br /> Archieved</p>
                                <div className='mt-4 flex flex-col justify-center items-center w-full gap-1'>
                                    <form onSubmit={handleSubmit}>
                                        <FormControl>

                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                defaultValue="female"
                                                name="radio-buttons-group"
                                                value={value}
                                                onChange={handleRadioChange}
                                            >
                                                <FormControlLabel value="All" control={<Radio />} label="Unarchieve" className='text-black' />
                                                <FormControlLabel value="Family" control={<Radio />} label="Family" className='text-black' />
                                                <FormControlLabel value="Friends" control={<Radio />} label="Friends" className='text-black' />
                                                <FormControlLabel value="Archieve" control={<Radio />} label="Archieve" className='text-black mb-3' />
                                            </RadioGroup>
                                        </FormControl>
                                        <button className='send-btn mb-4 h-10 w-40'>Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    : ''
            }
            {
                openPopup ?
                    <div>
                        <div onClick={() => SetopenPopup(false)} className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
                            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-80 flex flex-col pt-8">
                                <p className='text-lg tracking-wider text-center font-semibold text-black'>choose you want</p>
                                <div className='mt-6 flex flex-col justify-center items-center w-full gap-1'>
                                    <div onClick={() => { SetopenPopup(false); Setclearallpopup(true) }} className='w-[100%] h-15 bg-gray-200 hover:bg-gray-300 justify-center items-center flex text-black border-b-1 border-t-1 border-gray-300'>Clear All Messages</div>
                                    <div onClick={() => { SetopenPopup(false); Setarcheivepopup(true) }} className='w-[100%] h-15 bg-gray-200 hover:bg-gray-300 justify-center items-center flex text-black'>Archeive</div>
                                </div>
                            </div>
                        </div>
                    </div> : ''
            }
            {
                Clearallpopup ?
                    <div>
                        <div onClick={() => Setclearallpopup(false)} className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
                            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-80 flex flex-col pt-8">
                                <p className='text-lg tracking-wider text-center font-semibold text-black'>Clear All Messages?</p>
                                <div className='my-6 flex justify-center items-center w-full gap-5'>
                                    <button onClick={() => Setclearallpopup(false)} className='bg-gray-400 h-10 flex justify-center items-center w-25 rounded-3xl text-white'>No</button>
                                    <button onClick={Clearallmessage} className='bg-red-400 h-10 flex justify-center items-center w-25 rounded-3xl text-white'>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div> : ''
            }
        </div>
    )
}