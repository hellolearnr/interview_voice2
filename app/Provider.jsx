"use client";
import { supabase } from '@/Services/SupabaseClient';
import React ,{useEffect, useState, useContext} from 'react'
import { userDetailContext } from '@/context/UserDetailContext';

function Provider  ({children})  {

    const [user, setUser] = useState();

    useEffect(() => {
        createNewUser();
        
        // Add auth state change listener for debugging
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth state changed:", event);
            console.log("Session:", session);
            if (event === 'SIGNED_IN') {
                console.log("User signed in, session user:", session?.user);
                createNewUser(); // Re-run user creation/lookup
            }
        });
        
        // Cleanup subscription on unmount
        return () => {
            subscription?.unsubscribe();
        };
    }, [])
    
    const createNewUser =  () => {
        console.log("createNewUser function called");
        
        supabase.auth.getUser().then(async({data:{user}}) => {
            console.log("Supabase auth user:", user);
            console.log("Auth user last sign in:", user?.last_sign_in_at);
            console.log("User metadata name:", user?.user_metadata?.name);
            console.log("User metadata picture:", user?.user_metadata?.picture);

            // Logic to check if user exists
            let { data: users, error } = await supabase
             .from('users')
             .select('*')
             .eq('email', user?.email)
            
             console.log("Users from DB:", users);
             console.log("DB users length:", users?.length);
             
             // Check if we have a user and what their last_login is
             if (users && users.length > 0) {
                 console.log("Existing user last_login:", users[0]?.last_login);
             }
             
             // if not exists, create a new user
             if(users?.length === 0) {
                console.log("Creating new user in database");
                const { data, error } =  await supabase.from('users')
                .insert([
                  { email: user?.email, 
                    name: user?.user_metadata?.name,
                    picture: user?.user_metadata?.picture,
                    last_login: new Date().toISOString() // Add last_login timestamp
                     }
                ])
                console.log("Inserted data:", data);
                console.log("Insert error:", error);
                if (data && data.length > 0) {
                    setUser(data[0]);
                    console.log("User set in context (new):", data[0]);
                }
                return data;
             } 
             setUser(users[0]);
             console.log("User set in context (existing):", users[0]);
        }).catch(error => {
            console.error("Error in createNewUser:", error);
        });
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
