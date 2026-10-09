"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { User } from "@/types/User";
import { get } from "@/lib/api";


export default function DashboardHeader() {

    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const fetchUserData = async () => {
        try {
        const response = await get<User>("/users/me");
        setUser(response);
        } catch (error) {
        console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSignOut = () => {
        document.cookie = "jwt=; Path=/; Max-Age=0; SameSite=Lax" + (window.location.protocol === "https:" ? "; Secure" : "");
        router.push("/auth/login");
    };

    return (
        <header className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm md:left-64 md:px-10">
          <div>
            <p className="text-sm text-slate-500">Personal banking</p>
            <p className="font-semibold">Good morning, {user?.firstName || ":)"}</p>
          </div>
          <button className="text-sm font-semibold text-slate-600 hover:text-slate-950" onClick={handleSignOut}>
            Sign out
          </button>
        </header>
    )
}