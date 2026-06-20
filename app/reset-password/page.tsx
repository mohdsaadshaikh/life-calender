"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Key, Eye, EyeOff, ShieldAlert, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
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

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset. You can now log in (static demo).",
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
          {/* Custom Neobrutalism Vector Illustration (Shield protecting a Key) */}
          <div className="mx-auto w-40 h-40 bg-[#52D167] neo-border neo-shadow mb-6 flex items-center justify-center overflow-hidden relative">
            <svg
              viewBox="0 0 150 150"
              className="w-full h-full p-4 text-black select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Shield Body Shadow */}
              <path d="M75 125 C30 110 25 35 25 35 L75 20 L125 35 C125 35 120 110 75 125 Z" fill="#000" />
              {/* Shield Body */}
              <path d="M72 120 C32 106 27 36 27 36 L72 22 L117 36 C117 36 112 106 72 120 Z" fill="#FF5B87" stroke="currentColor" strokeWidth="4.5" />
              
              {/* Inner Key and padlock design */}
              <g transform="translate(48, 42)">
                {/* Padlock Body */}
                <rect x="0" y="20" width="55" height="42" rx="8" fill="#FAF5E6" stroke="currentColor" strokeWidth="3.5" />
                {/* Padlock Shackle */}
                <path d="M12 20 V8 C12 0 43 0 43 8 V20" stroke="currentColor" strokeWidth="3.5" fill="none" />
                {/* Key hole */}
                <circle cx="27.5" cy="38" r="4.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                <path d="M25 40 L30 40 L32 52 L23 52 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
              </g>

              {/* Sparking stars */}
              <path d="M125 45 L127 50 L132 51 L127 52 L125 57 L123 52 L118 51 L123 50 Z" fill="#FFD43B" stroke="currentColor" strokeWidth="1.5" />
              <path d="M25 115 L27 120 L32 121 L27 122 L25 127 L23 122 L18 121 L23 120 Z" fill="#FFD43B" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div className="absolute top-1 left-1 bg-[#FFD43B] text-black font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-black">
              SHIELD
            </div>
          </div>

          <h2 className="text-2xl font-black uppercase tracking-wider mb-2">RESET PASSWORD</h2>
          <p className="text-xs font-bold text-muted-foreground mb-6">
            Enter a new strong password below to secure your life calendar details.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-extrabold text-sm flex items-center gap-1.5">
                <Key className="w-4 h-4 stroke-[2.5px]" />
                NEW PASSWORD
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-extrabold text-sm flex items-center gap-1.5">
                <Key className="w-4 h-4 stroke-[2.5px]" />
                CONFIRM NEW PASSWORD
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, x: 4, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#FF9100] text-black font-extrabold neo-border neo-shadow p-4 flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <Check className="w-4 h-4 stroke-[3px]" />
              <span>{isLoading ? "UPDATING PASSWORD..." : "UPDATE PASSWORD"}</span>
            </motion.button>
          </form>

          {/* Back to sign in */}
          <div className="mt-6 flex justify-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 text-xs font-black uppercase hover:underline underline-offset-2 hover:text-[#FF5B87]"
            >
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
