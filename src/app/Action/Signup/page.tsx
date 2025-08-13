"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../../../component/ui/label";
import { Input } from "../../../../component/ui/input";
import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { FcGoogle } from "react-icons/fc";
import './page.css'

export default function SignupFormDemo() {

  const router = useRouter()
  const [message,Setmessage] = useState('')
  const { data: session, status } = useSession()

  const handleGooglesigin = () => {
    signIn('google')
  }

  useEffect(() => {
    if (status === "authenticated") {
      if(session.user.image){
        router.push('/Chatbody/Body')
      }else if (session.user.nickname) {
        router.push('/Mainpage/Image')
      } else {
        router.push('/Mainpage/Nickname')
      }
    }
  }, [status,session?.user.image,session?.user.nickname,router])

  const [form, Setform] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    console.log(res)
    if (res.ok) {
      router.push("/Action/BackgroundLogin");
    } else {
      const data = await res.json();
      Setmessage(data.message);
    }
  };
  return (
    <div className="w-full md:h-[100vh] flex justify-between items-center">
      <div className="shadow-input mx-auto w-full max-w-lg bg-white p-6 rounded-2xl md:px-8 md:pt-4 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 underline underline-offset-2">
          Welcome to Signup Page
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstname">Name</Label>
              <Input onChange={(e) => Setform({ ...form, name: e.target.value })} id="name" type="text" required />
            </LabelInputContainer>

          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input onChange={(e) => Setform({ ...form, email: e.target.value })} id="email" placeholder="demo123@gmail.com" type="email" required />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input onChange={(e) => Setform({ ...form, password: e.target.value })} id="password" placeholder="••••••••" type="password" required />
          </LabelInputContainer>
          <p className="text-red-500 pb-3">{message}</p>
          <button className="button">
            Signup
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                clipRule="evenodd"
              ></path>
            </svg>
            <BottomGradient />
          </button>
        </form>
        <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

        <div className="flex flex-col space-y-4">
          <p className="text-blue-900 "><Link href='/'>Already Have An Account !</Link></p>
          <button
            onClick={handleGooglesigin}
            className="bg-blue-500 group/btn shadow-input relative flex h-12 w-full items-center justify-start space-x-2 rounded-md px-0.5 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <div className="bg-white w-[13%] h-[90%] rounded-md justify-center items-center flex">
              <FcGoogle className="h-5 w-5 text-neutral-800" />
            </div>
            <span className="text-md text-white">
              Sign in with Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
