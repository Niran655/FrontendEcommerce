"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const next = params.get("next") || "/dashboard";

    async function completeLogin() {
      if (!token) {
        router.replace("/login?error=MissingToken");
        return;
      }

      try {
       
        window.localStorage.setItem("token", token);

     
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      } catch (e) {
      
      }

   
      login({ token });
      router.replace(next);
    }

    completeLogin();
  }, [params, router, login]);

  return null;
}
