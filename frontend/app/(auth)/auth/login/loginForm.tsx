"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { post } from "@/lib/api";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        let jwt: string;

        try {
            jwt = await post<string>("/users/login", { email, password });
        } catch (requestError) {
            if (isAxiosError(requestError) && requestError.response?.status === 401) {
                setError("The email or password is incorrect. Please try again.");
                return;
            }

            throw requestError;
        }

        if (!jwt) {
            throw new Error("Login response did not include a JWT.");
        }

        document.cookie = `jwt=${encodeURIComponent(jwt)}; Path=/; Max-Age=86400; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;

        setEmail("");
        setPassword("");
        setError("");
        
        router.push("/dashboard");
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
            {error && (
                <p role="alert" className="text-sm font-medium text-red-600">
                    {error}
                </p>
            )}
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
    );
}
