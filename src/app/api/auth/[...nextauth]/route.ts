import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDB } from "@/app/lib/mongodb";
import { User } from '../../../../../component/Schema/Userschema'
import bcrypt from "bcryptjs";

const handler = NextAuth({
  secret:process.env.NEXTAUTH_SECRET,
  providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
  }),

  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials) {
      await connectToDB();

      const user = await User.findOne({email:credentials?.email});
      if(!user) throw new Error('email not found');

      const isMatch = await bcrypt.compare( credentials?.password || '', user.password);
      if(!isMatch) throw new Error('incorrect password');

      return { id: user._id, email: user.email, name:user.name , nickname:user.nickname }
    }
  })
],
callbacks: {
  async signIn({user, account}){
    await connectToDB();

    if(account?.provider === 'google'){
      const existingUser = await User.findOne({email:user.email});

      if (!existingUser) {
        await User.create({
          name:user.name,
          email:user.email
        })
      }
    }
    return true;
  },
  async session({ session }) {
    const dbUser = await User.findOne({ email : session.user?.email});
    if(session.user) {
    session.user.id = dbUser._id;
    session.user.nickname = dbUser.nickname ;
    session.user.image = dbUser.image 
    }
    return session
  },
},
session:{
  strategy:'jwt',
},
})

export { handler as GET, handler as POST }