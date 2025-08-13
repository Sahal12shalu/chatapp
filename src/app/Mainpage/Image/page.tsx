"use client";
import React, { useState } from "react";
import { FileUpload } from "../../../../component/ui/fileupload";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (filess: File[]) => {
    console.log(files)
    setFiles(filess);
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-gradient-to-r from-gray-700 to-gray-600  min-h-96 border border-dashed border-neutral-200 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
