"use client";
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from '@/Services/SupabaseClient';

function Login () {
  const signInWithGoogle = async() => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    // Logic for signing in with Google will go here
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      }
    );
    if(error) {
      console.error('Error signing in with Google:', error.message);
    }
  } 
    
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='flex flex-col items-center border rounded-2xl'>
        <Image src={"/logo.png"} alt="Logo Image" width={400} height={100}
        className='w-[180px]' />
      
      
      <div className='flex flex-col items-center'>
        <Image src={"/login.png"} alt="Login Image" width={600} height={400}
        className='w-[400px] h-[250px] rounded-2xl' />
      

      <h2 className='text-2xl font-bold text-center mt-5'>Welcome Back</h2>
      <p className='text-gray-500 text-center'>Please login to continue</p>
      <Button className='mt-7 w-full'
      onClick={signInWithGoogle}>
        Login with Google</Button>
    </div>
    </div>
    </div>
  )
}

export default Login
