"use client";
import React, { useState } from "react";
import { FileUpload } from "../../../../component/ui/fileedit";

export default function FileEdit({onCancel} : {onCancel:()=>void}) {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (filess: File[]) => {
    console.log(files)
    setFiles(filess);
  };

  return (
    <div className="w-full h-[100vh] flex absolute justify-center items-center bg-gradient-to-r from-gray-700 to-gray-600  min-h-96 border border-dashed border-neutral-200 rounded-lg">
      <FileUpload onChange={handleFileUpload} onCancel={onCancel} />
    </div>
  );
}
 