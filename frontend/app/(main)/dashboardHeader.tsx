"use client";
import Link from "next/link";
import { useEffect } from "react";

import { get } from "@/lib/api";


export default function DashboardHeader() {

    const fetchUserData = async () => {
        try {
        const response = await get("/users/me");
        console.log("User data:", response);
        } catch (error) {
        console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 md:px-10">
          <div>
            <p className="text-sm text-slate-500">Personal banking</p>
            <p className="font-semibold">Good morning, Alex</p>
          </div>
          <Link href="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Sign out</Link>
        </header>
    )
}