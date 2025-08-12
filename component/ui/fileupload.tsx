import { cn } from "@/app/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import '../../src/app/Mainpage/Image/page.css'

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
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()
  const { data: session } = useSession()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFiles(selectedFile ? selectedFile : null)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      }
      reader.readAsDataURL(selectedFile);
      }
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const { getRootProps, isDragActive } = useDropzone({
      multiple: false,
      noClick: true,
      onDropRejected: (error) => {
        console.log(error);
      },
    });

    const SubmitImage = async (e:React.FormEvent) => {
      e.preventDefault()
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const res = await fetch("/api/image", {
      method: "PUT",
      body: JSON.stringify({base64Image,email:session?.user?.email}),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/Chatbody/Body");
    } else {
      const data = await res.json();
      console.log(data.message);
    }
      }
      if(files){
      reader.readAsDataURL(files);
      }
    }

    const Skipbutton =async (e:React.FormEvent) => {
      e.preventDefault()
      const res = await fetch("/api/register/empty", {
      method: "POST",
      body: JSON.stringify({email:session?.user?.email}),
      headers: { "Content-Type": "application/json" },
    });
    if(res.ok){
      router.push("/Chatbody/Body");
    }else {
      const data = await res.json();
      console.log(data.message);
    }
    }

    return (
      <div className="w-full" {...getRootProps()}>
        <motion.div
          whileHover="animate"
          className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="relative z-20 font-sans font-bold text-neutral-700 text-base">
              Upload file
            </p>
            <p className="relative z-20 font-sans font-normal text-neutral-600 text-center text-base mt-2">
              Drag or drop your files here or click to upload
            </p>
            <div className="relative w-full mt-10 max-w-xl mx-auto">

              {!files ? (
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
                    "relative group-hover/file:shadow-2xl z-40 bg-white flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {isDragActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-neutral-600 flex flex-col items-center"
                    >
                      Drop it
                      <IconUpload className="h-4 w-4 text-neutral-600" />
                    </motion.p>
                  ) : (
                    <IconUpload className="h-4 w-4 text-neutral-600" />
                  )}
                </motion.div>
              ) :
                <motion.div
                  onClick={handleClick}
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  style={{ backgroundImage: `url(${URL.createObjectURL(files)})` }}
                  className={cn(
                    "relative group-hover/file:shadow-2xl z-40 bg-cover bg-white flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {isDragActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-neutral-600 flex flex-col items-center"
                    >
                      Drop it
                      <IconUpload className="h-4 w-4 text-neutral-600" />
                    </motion.p>
                  ) : (
                    <IconUpload className="h-4 w-4 text-neutral-600" />
                  )}
                </motion.div>}

              {files ? (
                <motion.div
                  variants={secondaryVariant}
                  className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                ></motion.div>
              ) :
                <motion.div
                  variants={secondaryVariant}
                  className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                ></motion.div>}

            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <button className="beautiful-button rounded-lg borderpx-4 py-1 mt-6 text-black/90"
              onClick={SubmitImage}>
              Submit
            </button>
          </div>
        </motion.div>
        <button onClick={Skipbutton} className="w-full text-white/70 mt-6 hover:text-white/90 font-semibold">Skip</button>
      </div>
    );
  };

  export function GridPattern() {
    const columns = 41;
    const rows = 11;
    return (
      <div className="flex bg-gray-100 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: columns }).map((_, col) => {
            const index = row * columns + col;
            return (
              <div
                key={`${col}-${row}`}
                className={`w-10 h-10 flex shrink-0 rounded-[2px] ${index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                  }`}
              />
            );
          })
        )}
      </div>
    );
  }
