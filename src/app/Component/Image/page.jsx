"use client";
import React, { useState } from "react";
import { FileUpload } from "../ui/file-upload";
import Toast from '../ui/Toast'
import { IoIosWarning } from "react-icons/io";
import { MdCloudDone } from "react-icons/md";

export default function FileUploadDemo() {

  const [files, setFiles] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [showToast2, setShowToast2] = useState(false);
  const [showToast3, setShowToast3] = useState(false);
  const [spin, Setspin] = useState(false)

  const handleFileUpload = (files) => {
    setFiles(files);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {showToast ? <Toast message={<div className='flex justify-center items-center gap-2'><IoIosWarning className='text-red-500 text-lg' />
        <span className='text-white/90'>Please select Image</span></div>} onClose={() => setShowToast(false)} /> : ''}

      {showToast2 ? <Toast message={<div className='flex justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
        <span className='text-white/90'>Image Skipped</span></div>} onClose={() => setShowToast2(false)} /> : ''}

      {showToast3 ? <Toast message={<div className='flex justify-center items-center gap-2'><MdCloudDone className='text-green-500 text-lg' />
        <span className='text-white/90'>Image Successfully Added</span></div>} onClose={() => setShowToast3(false)} /> : ''}

      {spin ? <div className='absolute z-50 w-full bg-black/20 flex justify-center items-center h-screen'>
        <div className="w-8 h-8 border-4 border-white border-dashed rounded-full animate-spin"></div></div> : ''}

      <div className="absolute w-[90%] top-1/20 left-1/2 h-[200px] bg-white/60 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div
        className="w-full mx-auto min-h-96 border border-dashed bg-black border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileUpload} setShowToast={setShowToast} setShowToast2={setShowToast2} setShowToast3={setShowToast3} Setspin={Setspin} />
      </div>
    </div>
  );
}
