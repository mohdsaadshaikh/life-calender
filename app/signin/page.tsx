"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Key, Mail, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SignInPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in (static demo).",
      });
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Google Authentication",
      description: "Redirecting to Google OAuth (static demo)...",
    });
  };

  return (
    <main className="relative min-h-screen horizons-bg flex flex-col items-center justify-center p-4 md:p-8">
      {/* Home link */}
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-card neo-border neo-shadow flex items-center gap-2 px-4 py-2 font-bold hover:bg-secondary transition-colors"
        >
          <Calendar className="w-5 h-5 text-black" />
          <span>LIFE CALENDAR</span>
        </motion.div>
      </Link>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 md:mt-0">
        {/* Left Side: Premium Illustration (lg: 5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider horizons-logo-text leading-tight">
              Welcome<br />Back
            </h1>
            <p className="text-sm font-bold text-muted-foreground max-w-sm">
              Sign in to access your custom weeks tracker, milestones leaderboard, and dashboard.
            </p>
          </div>

          {/* New Premium Neobrutalism Vector Illustration */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 bg-accent neo-border-thick neo-shadow-lg flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full p-4 text-black select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back Card (Pink) */}
              <g transform="translate(30, 45) rotate(-8)">
                <rect x="0" y="0" width="100" height="90" rx="12" fill="#000" />
                <rect x="-3" y="-3" width="100" height="90" rx="12" fill="#FF5B87" stroke="currentColor" strokeWidth="3" />
                {/* Simulated grid inside back card */}
                <line x1="15" y1="20" x2="85" y2="20" stroke="currentColor" strokeWidth="2.5" />
                <line x1="15" y1="35" x2="85" y2="35" stroke="currentColor" strokeWidth="2.5" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="2.5" />
                {/* Star shape */}
                <path d="M50 60 L52 65 L57 66 L52 67 L50 72 L48 67 L43 66 L48 65 Z" fill="#FFD43B" stroke="currentColor" strokeWidth="1.5" />
              </g>

              {/* Middle Card (Cyan) */}
              <g transform="translate(65, 55) rotate(6)">
                <rect x="0" y="0" width="95" height="85" rx="12" fill="#000" />
                <rect x="-3" y="-3" width="95" height="85" rx="12" fill="#22B8CF" stroke="currentColor" strokeWidth="3" />
                {/* Heart */}
                <path d="M47.5 55 C43 45 30 45 30 55 C30 65 47.5 75 47.5 75 C47.5 75 65 65 65 55 C65 45 52 45 47.5 55 Z" fill="#FF5B87" stroke="currentColor" strokeWidth="2.5" />
                {/* Little lines */}
                <circle cx="20" cy="20" r="4" fill="currentColor" />
                <circle cx="35" cy="20" r="4" fill="currentColor" />
                <circle cx="50" cy="20" r="4" fill="currentColor" />
              </g>

              {/* Front Card (Yellow/Unlock key) */}
              <g transform="translate(45, 65) rotate(-2)">
                <rect x="0" y="0" width="105" height="90" rx="12" fill="#000" />
                <rect x="-3" y="-3" width="105" height="90" rx="12" fill="#FFD43B" stroke="currentColor" strokeWidth="3.5" />
                
                {/* Check list */}
                <rect x="15" y="20" width="12" height="12" rx="3" fill="#52D167" stroke="currentColor" strokeWidth="2" />
                <line x1="35" y1="26" x2="85" y2="26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                
                {/* Unlock Key design */}
                <g transform="translate(25, 45)">
                  {/* Key loop */}
                  <circle cx="15" cy="15" r="10" fill="#FAF5E6" stroke="currentColor" strokeWidth="3" />
                  {/* Smiley face inside loop */}
                  <circle cx="12" cy="13" r="1" fill="currentColor" />
                  <circle cx="18" cy="13" r="1" fill="currentColor" />
                  <path d="M11 17 Q15 20 19 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                  {/* Key shaft */}
                  <line x1="25" y1="15" x2="55" y2="15" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Key teeth */}
                  <rect x="42" y="15" width="6" height="8" fill="currentColor" />
                  <rect x="50" y="15" width="6" height="8" fill="currentColor" />
                </g>
              </g>

              {/* Pop star decorations */}
              <g transform="translate(150, 25)">
                <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" fill="#FF9100" stroke="currentColor" strokeWidth="2" />
              </g>
              <g transform="translate(20, 20)">
                <circle cx="8" cy="8" r="8" fill="#52D167" stroke="currentColor" strokeWidth="2" />
              </g>
            </svg>
            <div className="absolute top-2 left-2 bg-[#FFD43B] text-black font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              SECURE
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form (lg: 7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7"
        >
          <div className="bg-card neo-border-thick neo-shadow-xl p-6 md:p-10 text-black">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <LogIn className="w-6 h-6 stroke-[3px]" />
              SIGN IN
            </h2>

            {/* Google Authentication Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, x: 4, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              className="w-full bg-[#FFD43B] text-black font-extrabold neo-border neo-shadow p-3.5 flex items-center justify-center gap-3 cursor-pointer select-none mb-6"
            >
              {/* Custom flat Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </motion.button>

            {/* Separator */}
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t-3 border-black"></div>
              <span className="flex-shrink mx-4 font-black uppercase text-xs tracking-wider">OR USE EMAIL</span>
              <div className="flex-grow border-t-3 border-black"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-extrabold text-sm flex items-center gap-1.5">
                  <Mail className="w-4 h-4 stroke-[2.5px]" />
                  EMAIL ADDRESS
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neo-border bg-white text-black font-bold p-3 focus-visible:ring-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="font-extrabold text-sm flex items-center gap-1.5">
                    <Key className="w-4 h-4 stroke-[2.5px]" />
                    PASSWORD
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-black uppercase hover:underline text-primary-foreground underline-offset-2"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="neo-border bg-white text-black font-bold p-3 pr-10 focus-visible:ring-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-5 h-5 rounded-md border-3 border-black text-primary focus:ring-0 checked:bg-primary cursor-pointer accent-black"
                />
                <label htmlFor="remember" className="font-bold text-xs cursor-pointer select-none">
                  REMEMBER MY SESSION
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, x: 4, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#FF5B87] text-black font-extrabold neo-border neo-shadow p-4 flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <span>{isLoading ? "SIGNING IN..." : "SIGN IN"}</span>
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center text-xs font-bold">
              <span>DON&apos;T HAVE AN ACCOUNT? </span>
              <Link href="/signup" className="underline font-black hover:text-[#FF5B87]">
                SIGN UP HERE
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
