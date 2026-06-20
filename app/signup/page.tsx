"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, Mail, Key, Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (!agreeTerms) {
      toast({
        title: "Validation Error",
        description: "You must agree to the Terms of Service.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registration successful!",
        description: "Your account has been created (static demo).",
      });
    }, 1200);
  };

  const handleGoogleSignUp = () => {
    toast({
      title: "Google Authentication",
      description: "Redirecting to Google OAuth signup (static demo)...",
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
              Create<br />Account
            </h1>
            <p className="text-sm font-bold text-muted-foreground max-w-sm">
              Start visualizing your weeks, tracking milestones, and taking control of your life calendar today.
            </p>
          </div>

          {/* New Premium Neobrutalism Vector Illustration */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 bg-secondary neo-border-thick neo-shadow-lg flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full p-4 text-black select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back Card (Orange) */}
              <g transform="translate(35, 40) rotate(-6)">
                <rect x="0" y="0" width="95" height="90" rx="12" fill="#000" />
                <rect x="-3" y="-3" width="95" height="90" rx="12" fill="#FF9100" stroke="currentColor" strokeWidth="3" />
                {/* Heart Icon */}
                <path d="M47.5 50 C43 40 30 40 30 50 C30 60 47.5 70 47.5 70 C47.5 70 65 60 65 50 C65 40 52 40 47.5 50 Z" fill="#FF5B87" stroke="currentColor" strokeWidth="2.5" />
              </g>

              {/* Middle Card (Pink) */}
              <g transform="translate(60, 50) rotate(8)">
                <rect x="0" y="0" width="100" height="85" rx="12" fill="#000" />
                <rect x="-3" y="-3" width="100" height="85" rx="12" fill="#FF5B87" stroke="currentColor" strokeWidth="3" />
                {/* Stars inside middle card */}
                <path d="M25 25 L27 30 L32 31 L27 32 L25 37 L23 32 L18 31 L23 30 Z" fill="#FFD43B" stroke="currentColor" strokeWidth="1.5" />
                <path d="M75 55 L77 60 L82 61 L77 62 L75 67 L73 62 L68 61 L73 60 Z" fill="#FFD43B" stroke="currentColor" strokeWidth="1.5" />
              </g>

              {/* Front Card (Green/Rocket Launcher) */}
              <g transform="translate(45, 60) rotate(-2)">
                <rect x="0" y="0" width="105" height="95" rx="12" fill="#000" />
                <rect x="-3" y="-3" width="105" height="95" rx="12" fill="#52D167" stroke="currentColor" strokeWidth="3.5" />
                
                {/* Flag Milestone */}
                <g transform="translate(15, 20)">
                  {/* Flagpole */}
                  <line x1="10" y1="5" x2="10" y2="60" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Flag flag */}
                  <path d="M10 5 L40 15 L10 25 Z" fill="#FFD43B" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  {/* Star on Flag */}
                  <path d="M22 13 L23 15 L25 15.5 L23 16 L22 18 L21 16 L19 15.5 L21 15 Z" fill="#254ACF" />
                </g>

                {/* Flying Rocket representation (cute style) */}
                <g transform="translate(58, 25) rotate(45)">
                  {/* Rocket body shadow */}
                  <rect x="4" y="4" width="22" height="38" rx="8" fill="#000" />
                  {/* Rocket body */}
                  <rect x="0" y="0" width="22" height="38" rx="8" fill="#FAF5E6" stroke="currentColor" strokeWidth="3" />
                  {/* Nose cone */}
                  <path d="M0 10 L11 -5 L22 10 Z" fill="#FF5B87" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                  {/* Wings */}
                  <path d="M-6 25 L0 15 L0 35 Z" fill="#FF9100" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M28 25 L22 15 L22 35 Z" fill="#FF9100" stroke="currentColor" strokeWidth="2.5" />
                  {/* Flame */}
                  <path d="M5 38 L11 50 L17 38 Z" fill="#FFD43B" stroke="currentColor" strokeWidth="2" />
                </g>
              </g>

              {/* Decorative stars */}
              <g transform="translate(145, 30)">
                <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" fill="#FFD43B" stroke="currentColor" strokeWidth="2" />
              </g>
              <g transform="translate(25, 145)">
                <circle cx="6" cy="6" r="6" fill="#22B8CF" stroke="currentColor" strokeWidth="2" />
              </g>
            </svg>
            <div className="absolute top-2 left-2 bg-[#52D167] text-black font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              JOIN US
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
              <UserPlus className="w-6 h-6 stroke-[3px]" />
              SIGN UP
            </h2>

            {/* Google Authentication Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, x: 4, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignUp}
              className="w-full bg-[#FFD43B] text-black font-extrabold neo-border neo-shadow p-3.5 flex items-center justify-center gap-3 cursor-pointer select-none mb-6"
            >
              {/* Custom flat Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>SIGN UP WITH GOOGLE</span>
            </motion.button>

            {/* Separator */}
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t-3 border-black"></div>
              <span className="flex-shrink mx-4 font-black uppercase text-xs tracking-wider">OR USE EMAIL</span>
              <div className="flex-grow border-t-3 border-black"></div>
            </div>

            {/* Email Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="font-extrabold text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 stroke-[2.5px]" />
                  FULL NAME
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neo-border bg-white text-black font-bold p-3 focus-visible:ring-black"
                  required
                />
              </div>

              <div className="space-y-1">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="password" className="font-extrabold text-sm flex items-center gap-1.5">
                    <Key className="w-4 h-4 stroke-[2.5px]" />
                    PASSWORD
                  </Label>
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

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="font-extrabold text-sm flex items-center gap-1.5">
                    <Key className="w-4 h-4 stroke-[2.5px]" />
                    CONFIRM PASSWORD
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="neo-border bg-white text-black font-bold p-3 focus-visible:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded-md border-3 border-black text-primary focus:ring-0 checked:bg-primary cursor-pointer accent-black shrink-0"
                  required
                />
                <label htmlFor="agree" className="font-bold text-xs cursor-pointer select-none leading-normal">
                  I AGREE TO THE{" "}
                  <Link href="/terms" className="underline font-black hover:text-[#FF5B87]">
                    TERMS OF SERVICE
                  </Link>{" "}
                  AND{" "}
                  <Link href="/privacy" className="underline font-black hover:text-[#FF5B87]">
                    PRIVACY POLICY
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, x: 4, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#FF5B87] text-black font-extrabold neo-border neo-shadow p-4 flex items-center justify-center gap-2 cursor-pointer select-none pt-4"
              >
                <span>{isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}</span>
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center text-xs font-bold">
              <span>ALREADY HAVE AN ACCOUNT? </span>
              <Link href="/signin" className="underline font-black hover:text-[#FF5B87]">
                SIGN IN HERE
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
