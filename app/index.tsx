import Layout from "@/components/ui/layout";
import Splash from "@/components/ui/splash";
import { useAuth } from "@/hooks/auth/useAuth";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const { auth, isLoading } = useAuth();
  const hasRedirected = useRef(false);
  const [minTimePassed, setMinTimePassed] = useState(false);



  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (isLoading) return;
    if (!minTimePassed) return;
    if (hasRedirected.current) return;

    hasRedirected.current = true;

    if (!auth) {
      router.replace("/auth/login");
      return;
    }


    const role = auth?.user?.role?.role;

    switch (role) {
      case "store_owner":
        router.replace("/(store)");
        return;
      case "admin":
        router.replace("/(admin)");
        return;
      case "delivery_man":
        router.replace("/(delivery)");
        return;
      case "user":
        router.replace("/account");
        return;
      default:
        router.replace("/auth/login");
        return;
    }

  }, [auth, isLoading, minTimePassed]);
  return (
    <Layout>
      <Splash />
    </Layout>
  );
}

