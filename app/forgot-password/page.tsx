"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Mail, ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Reset link sent!",
        description: "If an account exists, you will receive a password reset email shortly (static demo).",
      });
    }, 1200);
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card neo-border-thick neo-shadow-xl p-6 md:p-8 text-black text-center">
          {/* Custom Neobrutalism Vector Illustration (Magnifying Glass focusing on Key Envelop) */}
          <div className="mx-auto w-40 h-40 bg-[#FFD43B] neo-border neo-shadow mb-6 flex items-center justify-center overflow-hidden relative">
            <svg
              viewBox="0 0 150 150"
              className="w-full h-full p-4 text-black select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Envelop/Mail Shadow */}
              <rect x="25" y="45" width="80" height="55" rx="6" fill="#000" />
              {/* Envelop/Mail Body */}
              <rect x="21" y="41" width="80" height="55" rx="6" fill="#FAF5E6" stroke="currentColor" strokeWidth="3.5" />
              
              {/* Envelop flap lines */}
              <path d="M21 41 L61 71 L101 41" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
              
              {/* Sparking stars */}
              <path d="M115 25 L117 30 L122 31 L117 32 L115 37 L113 32 L108 31 L113 30 Z" fill="#FF5B87" stroke="currentColor" strokeWidth="1.5" />

              {/* Magnifying Glass */}
              <g transform="translate(45, 30)">
                {/* Thick handle shadow */}
                <line x1="38" y1="38" x2="62" y2="62" stroke="#000" strokeWidth="9" strokeLinecap="round" />
                {/* Handle */}
                <line x1="35" y1="35" x2="58" y2="58" stroke="#FF5B87" strokeWidth="7" strokeLinecap="round" />
                <line x1="35" y1="35" x2="58" y2="58" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                
                {/* Glass frame shadow */}
                <circle cx="20" cy="20" r="22" fill="none" stroke="#000" strokeWidth="6" />
                {/* Glass frame */}
                <circle cx="17" cy="17" r="22" fill="#22B8CF" stroke="currentColor" strokeWidth="4.5" />
                
                {/* Key inside lens */}
                <g transform="translate(7, 7)">
                  <circle cx="5" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="8" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="12" y1="5" x2="12" y2="10" stroke="currentColor" strokeWidth="2" />
                  <line x1="15" y1="5" x2="15" y2="10" stroke="currentColor" strokeWidth="2" />
                </g>
              </g>
            </svg>
            <div className="absolute bottom-1 right-1 bg-[#FF5B87] text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-black">
              FIND
            </div>
          </div>

          <h2 className="text-2xl font-black uppercase tracking-wider mb-2">FORGOT PASSWORD</h2>
          <p className="text-xs font-bold text-muted-foreground mb-6">
            Enter your email below and we will send you a secure link to recover your account access.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, x: 4, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#52D167] text-black font-extrabold neo-border neo-shadow p-4 flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <Send className="w-4 h-4 stroke-[2.5px]" />
              <span>{isLoading ? "SENDING LINK..." : "SEND RESET LINK"}</span>
            </motion.button>
          </form>

          {/* Back to sign in */}
          <div className="mt-6 flex justify-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 text-xs font-black uppercase hover:underline underline-offset-2 hover:text-[#FF5B87]"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3px]" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
