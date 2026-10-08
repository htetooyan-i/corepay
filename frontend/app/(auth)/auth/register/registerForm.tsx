"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { post } from "@/lib/api";

export default function RegisterForm() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await post("/users/register", {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
        });

        router.push("/auth/login");
    };

    return (
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
            <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                    First name
                    <input
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        required
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                </label>
                <label className="block text-sm font-medium">
                    Last name
                    <input
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        required
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                    Email address
                    <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                </label>
                <label className="block text-sm font-medium">
                    Phone number
                    <input
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        type="tel"
                        name="phoneNumber"
                        autoComplete="tel"
                        inputMode="tel"
                        required
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                </label>
            </div>
            <label className="block text-sm font-medium">
                Password
                <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
            </label>
            <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
                Create account
            </button>
        </form>
    );
}