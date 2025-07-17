"use client";
import { supabase } from '@/Services/SupabaseClient';
import React ,{useEffect, useState, useContext} from 'react'
import { userDetailContext } from '@/context/UserDetailContext';

function Provider  ({children})  {

    const [user, setUser] = useState();

    useEffect(() => {
        createNewUser();
    }, [])
    const createNewUser =  () => {

        supabase.auth.getUser().then(async({data:{user}}) => {

        console.log("Supabase auth user:", user);
        console.log("User metadata name:", user?.user_metadata?.name);
        console.log("User metadata picture:", user?.user_metadata?.picture);

        // Logic to check if user exists

    let { data: users, error } = await supabase
     .from('users')
     .select('*')
     .eq('email', user?.email)
    
     console.log("Users from DB:", users)
     // if not exists, create a new user
     if(users?.length === 0) {
        const { data, error } =  await supabase.from('users')
        .insert([
          { email: user?.email, 
            name: user?.user_metadata?.name,
            picture: user?.user_metadata?.picture
             }
        ])
        console.log("Inserted data:", data)
        setUser(data);
        return data;
     } 
     setUser(users[0]);
     console.log("User set in context:", users[0]);
    })
}
  return (
    <userDetailContext.Provider value={{user, setUser}}>
    <div>
      {children}
    </div>
    </userDetailContext.Provider>
  )
}

export default Provider

export const useUser = () => {
    const context = useContext(userDetailContext);
   
    return context;
}
