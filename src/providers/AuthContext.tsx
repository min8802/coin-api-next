"use client";

import { supabaseClient } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextProps {
  session: Session | null;
  profile: Profile | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); //index.d.ts

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
        const {data, error} = await supabaseClient.from("profiles").select("*").eq("user_id", session?.user.id);
    
        if(error) {
            console.error("profile error",error);
        } else {
            if(data.length === 1) setProfile(data[0]);
        }
    };

    if(!session) return;

    fetchProfile();

  },[session])

  return (//밑에서 value로 다른페이지에 value전달
    <AuthContext.Provider value={{ session, profile }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};