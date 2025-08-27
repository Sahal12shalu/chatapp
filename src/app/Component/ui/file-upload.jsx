import { cn } from "@/app/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import './page.css'
import axios from "axios";

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 20,
        y: -20,
        opacity: 0.9,
    },
};

const secondaryVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};

export const FileUpload = ({
    onChange,
    setShowToast,
    setShowToast2,
    setShowToast3,
    Setspin
}) => {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const router = useRouter()
    const [base64, setBase64] = useState(null);
    const {data : session , status} = useSession()

    const formData = {
        id: session.user.id || '' ,
        image: 'A'
    }

    const formData2 = {
        id: session.user.id || '',
        image: base64
    }

    const Imagesubmit = async (e) => {
        if(status === 'loading') return;
        e.preventDefault()
        const res = await axios.put('/api/Signup/image', formData2)
        if (res.data.message === 'success') {
            setShowToast3(true)
            Setspin(true)
            setTimeout(() => {
                router.push('/Chatcomponent/Chatbody')
            }, 1000)
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

    const Skipbutton = async (e) => {
        if(status === 'loading') return;
        e.preventDefault()
        const res = await axios.put('/api/Signup/image', formData)
        if (res.data.message === 'success') {
            setShowToast2(true)
            Setspin(true)
            setTimeout(() => {
                router.push('/Chatcomponent/Chatbody')
            }, 1000)
        } else {
            alert(res.data.message)
        }
    }

    const handleFileChange = async (newFiles) => {
        setFiles(newFiles);
        onChange && onChange(newFiles);

        const base64List = await Promise.all(
            newFiles.map((file) => fileToBase64(file))
        );
        setBase64(base64List[0])
    };

    const Toastopen = () => {
        setShowToast(true)
    }

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const { getRootProps, isDragActive } = useDropzone({
        multiple: false,
        noClick: true,
        onDrop: handleFileChange,
        onDropRejected: (error) => {
            console.log(error);
        },
    });

    return (
        <div className="w-full" {...getRootProps()}>
            <motion.div
                whileHover="animate"
                className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden">
                <input
                    ref={fileInputRef}
                    id="file-upload-handle"
                    type="file"
                    onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
                    className="hidden" />
                <div
                    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                    <GridPattern />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p
                        className="relative z-20 font-sans font-bold text-black/90 text-base">
                        Upload file
                    </p>
                    <p
                        className="relative z-20 font-sans font-normal text-black/80 text-base mt-2">
                        Drag or drop your files here or click to upload
                    </p>
                    <div className="relative w-full mt-8 max-w-xl mx-auto">
                        {files.length > 0 && (
                            <div className="w-full flex flex-col justify-center items-center gap-5">
                                <motion.div
                                    onClick={handleClick}
                                    layoutId="file-upload"
                                    className="relative group-hover:file:shadow-2xl z-40 bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-lg overflow-hidden"
                                >
                                    {/* Image preview */}
                                    <img
                                        src={URL.createObjectURL(files[0])}
                                        alt="preview"
                                        className="object-cover w-full h-full"
                                    />
                                </motion.div>
                                <Button onClick={Imagesubmit} className="styledbutton" style={{ width: '130px', color: 'black' }} variant="contained">Submit</Button>
                            </div>
                        )}
                        {!files.length && (
                            <div className="w-full flex flex-col justify-center items-center gap-5">
                                <motion.div
                                    onClick={handleClick}
                                    layoutId="file-upload"
                                    variants={mainVariant}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    }}
                                    className={cn(
                                        "relative group-hover/file:shadow-2xl z-40 bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                                        "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                                    )}>
                                    {isDragActive ? (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-neutral-600 flex flex-col items-center">
                                            Drop it
                                            <IconUpload className="h-4 w-4 text-neutral-400" />
                                        </motion.p>
                                    ) : (
                                        <IconUpload className="h-4 w-4 text-neutral-300" />
                                    )}
                                </motion.div>
                                <Button onClick={Toastopen} className="styledbutton" style={{ width: '130px', color: 'black' }} variant="contained">Submit</Button>
                            </div>
                        )}

                        {!files.length && (
                            <motion.div
                                variants={secondaryVariant}
                                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"></motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
            <div className="w-full flex justify-center items-center">
                <button className="Btn my-3" onClick={Skipbutton}>
                    Not Now
                    <svg viewBox="0 0 320 512" className="svg">
                        <path
                            d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export function GridPattern() {
    const columns = 41;
    const rows = 11;
    return (
        <div
            className="flex bg-gray-100  shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
            {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: columns }).map((_, col) => {
                    const index = row * columns + col;
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-10 h-10 flex shrink-0 rounded-[2px] ${index % 2 === 0
                                ? "bg-gray-50 "
                                : "bg-gray-50  shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                                }`} />
                    );
                }))}
        </div>
    );
}
