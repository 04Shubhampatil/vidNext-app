"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        alert(result?.error || "Login failed");
        return;
      }
      router.push("/uploadvideos");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-zinc-400">Sign in to your account</p>
        </div>

        <form onSubmit={handlesubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-zinc-900 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            <span className="relative z-10 flex items-center justify-center font-semibold text-base">
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-8">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Create one now
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
