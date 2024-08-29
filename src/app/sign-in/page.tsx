"use client";

import { useAuth } from "@/providers/AuthContext";
import { supabaseClient } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignIn: NextPage = () => {
  const { session } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    router.push("/");
  }, [session]);

  return (
    <Auth supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa }} />
  );
};

export default SignIn;