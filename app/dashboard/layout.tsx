"use client";

import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SideNav from "../ui/dashboard/sidenav";



export default function DashboardLayout ({
  children, 
  } : {
    children :React.ReactNode;
  }) {
    const { status} = useSession();
    const router = useRouter();
    
    useEffect(() => {
      if(status === 'unauthenticated') {
        router.push("/userAuth/login")
      }
    },[status , router]);

    if(status === 'loading') {
        return <div> Loading dashboard.....</div>
    }

    if(status === 'authenticated') {
        return (
          <SessionProvider>
            <div className=" flex h-screen flex-col md:flex-row md:overflow-hidden">
              <div className="w-full flex-none md:w-64">
                <SideNav/>
              </div>
              <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
            </SessionProvider>
        );
    }
}