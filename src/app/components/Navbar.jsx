"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 inset-x-0 h-16 bg-black/50 backdrop-blur-xl border-b border-white/10 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Logo */}
                <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:to-white transition-all">
                            VidFlow
                        </span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-white" : "text-zinc-400 hover:text-white"}`}
                    >
                        Explore
                    </Link>

                    {session ? (
                        <>
                            <Link
                                href="/uploadvideos"
                                className={`text-sm font-medium transition-colors ${pathname === "/uploadvideos" ? "text-indigo-400" : "text-zinc-400 hover:text-indigo-400"}`}
                            >
                                Upload
                            </Link>
                            <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                                <span className="text-sm text-zinc-400 hidden sm:block">
                                    {session.user?.email}
                                </span>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6 ml-2">
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}
