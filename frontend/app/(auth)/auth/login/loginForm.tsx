"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { post } from "@/lib/api";

export default function LoginForm() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const response = await post("/users/login", { email, password });

        if (response) {
        router.push("/dashboard");
        }
    };
    return (
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <label className="block text-sm font-medium">
            Email address
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
            </label>
            <label className="block text-sm font-medium">
            Password
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
            </label>
            <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm font-semibold text-cyan-700 hover:text-cyan-900">
                Forgot password?
            </Link>
            </div>
            <button
            type="submit"
            className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
            Sign in
            </button>
        </form>
    )

}
