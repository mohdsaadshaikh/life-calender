"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, Mail, Key, Eye, EyeOff, UserPlus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { OTPInput } from "@/components/ui/otp-input";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().min(1, "Email is required.").email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [hasVerificationError, setHasVerificationError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setErrors({});

    const result = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const parts = name.split(" ");
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";

      console.log("Initiating password signup for:", email);
      const res = await signUp.password({
        emailAddress: email,
        password: password,
        firstName,
        lastName,
      });
      console.log("Signup password result:", res);
      console.log("Current signUp state:", {
        id: signUp.id,
        status: signUp.status,
        unverifiedFields: signUp.unverifiedFields,
        missingFields: signUp.missingFields,
      });

      if (res?.error) {
        setIsLoading(false);
        let errMsg = res.error.message || "Failed to create account.";
        if (res.error.code === "form_password_validation_failed" || errMsg.toLowerCase().includes("password")) {
          if (errMsg.toLowerCase().includes("not strong") || errMsg.toLowerCase().includes("too weak") || errMsg.toLowerCase().includes("common")) {
            errMsg = "This password is too common or weak. Please choose a different, more secure password.";
          }
          setErrors((prev) => ({ ...prev, password: errMsg }));
        } else if (errMsg.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: errMsg }));
        } else {
          toast({
            title: "Registration Error",
            description: errMsg,
            variant: "destructive",
          });
        }
        return;
      }

      // Send the email verification code
      console.log("Dispatching email verification code...");
      const verifyRes = await signUp.verifications.sendEmailCode();
      console.log("Email verification dispatch result:", verifyRes);
      if (verifyRes?.error) {
        setIsLoading(false);
        toast({
          title: "Verification Error",
          description: verifyRes.error.message || "Failed to send verification email.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(false);
      toast({
        title: "Code Sent",
        description: "Please check your email for the verification code.",
      });
    } catch (err: any) {
      setIsLoading(false);
      toast({
        title: "Registration Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async (e?: React.FormEvent | string) => {
    if (e && typeof e !== "string") {
      e.preventDefault();
    }
    const codeToVerify = typeof e === "string" ? e : verificationCode;

    if (!signUp) return;
    if (!codeToVerify) {
      toast({
        title: "Validation Error",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    try {
      const res = await signUp.verifications.verifyEmailCode({
        code: codeToVerify,
      });

      if (res?.error) {
        setVerifying(false);
        setHasVerificationError(true);
        toast({
          title: "Verification Error",
          description: res.error.message || "Incorrect verification code.",
          variant: "destructive",
        });
        return;
      }

      if (signUp.status === "complete") {
        setIsVerified(true);
        setVerifying(false);
        toast({
          title: "Account Created!",
          description: "Your account has been successfully verified and created.",
        });
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            const url = decorateUrl("/calendar/onboarding");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      } else {
        setVerifying(false);
        toast({
          title: "Status Update",
          description: `Verification status: ${signUp.status}. Please check other requirements.`,
        });
      }
    } catch (err: any) {
      setVerifying(false);
      setHasVerificationError(true);
      toast({
        title: "Verification Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignUp = async () => {
    if (!signUp) return;
    try {
      console.log("Initiating Google Sign Up SSO...");
      const res = await signUp.sso({
        strategy: "oauth_google",
        redirectUrl: "/calendar/onboarding",
        redirectCallbackUrl: "/sso-callback",
      });
      console.log("SSO result:", res);
      if (res?.error) {
        toast({
          title: "Google Authentication Error",
          description: res.error.message || "Failed to initiate Google sign up.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("SSO catch error:", err);
      toast({
        title: "Google Authentication Error",
        description: err.message || "Failed to initiate Google sign up.",
        variant: "destructive",
      });
    }
  };

  if (
    signUp &&
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address")
  ) {
    return (
      <main className="relative min-h-screen horizons-bg flex flex-col items-center justify-center p-4 md:p-8">
        {/* Home link */}
        <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
          <Logo />
        </Link>

        <div className="w-full max-w-xl mt-12 md:mt-0 space-y-6">
          {/* Heading and Subheading */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider horizons-logo-text leading-tight">
              Verify Email
            </h1>
            <p className="text-sm font-bold text-muted-foreground max-w-md mx-auto">
              We sent a verification code to your email. Enter it below to activate your account.
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-card neo-border-thick neo-shadow-xl p-6 md:p-10 text-black">
              <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
                <div className="space-y-4 flex flex-col items-center">
                  <OTPInput
                    value={verificationCode}
                    onChange={(val) => {
                      setVerificationCode(val);
                      setHasVerificationError(false);
                      if (val.length === 6 && !verifying && !isVerified) {
                        handleVerify(val);
                      }
                    }}
                    disabled={verifying}
                    status={isVerified ? "success" : verifying ? "verifying" : hasVerificationError ? "error" : "idle"}
                  />
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => signUp.verifications.sendEmailCode()}
                  className="text-xs font-black uppercase underline hover:text-[#FF5B87] bg-transparent border-0 cursor-pointer"
                >
                  Resend Verification Code
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen horizons-bg flex flex-col items-center justify-center p-4 md:p-8">
      {/* Home link */}
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <Logo />
      </Link>

      <div className="w-full max-w-xl mt-12 md:mt-0 space-y-6">
        {/* Heading and Subheading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider horizons-logo-text leading-tight">
            Create Account
          </h1>
          <p className="text-sm font-bold text-muted-foreground max-w-md mx-auto">
            Start visualizing your weeks, tracking milestones, and taking control of your life calendar today.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card neo-border-thick neo-shadow-xl p-6 md:p-10 text-black">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <UserPlus className="w-6 h-6 stroke-[3px]" />
              SIGN UP
            </h2>

            {/* Google Authentication Button */}
            <motion.button
              type="button"
              disabled={isLoading || !signUp || fetchStatus === "fetching"}
              whileHover={{ scale: 1.02, x: 4, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignUp}
              className="w-full bg-primary text-black font-extrabold neo-border neo-shadow p-3.5 flex items-center justify-center gap-3 cursor-pointer select-none mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Custom flat Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
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
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className="neo-border bg-white text-black font-bold p-3 focus-visible:ring-black"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-extrabold mt-1 uppercase tracking-wide">
                    {errors.name}
                  </p>
                )}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className="neo-border bg-white text-black font-bold p-3 focus-visible:ring-black"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-extrabold mt-1 uppercase tracking-wide">
                    {errors.email}
                  </p>
                )}
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
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
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
                  {errors.password && (
                    <p className="text-xs text-red-500 font-extrabold mt-1 uppercase tracking-wide">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="font-extrabold text-sm flex items-center gap-1.5">
                    <Key className="w-4 h-4 stroke-[2.5px]" />
                    CONFIRM PASSWORD
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      className="neo-border bg-white text-black font-bold p-3 pr-10 focus-visible:ring-black"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 font-extrabold mt-1 uppercase tracking-wide">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* CAPTCHA Widget */}
              <div id="clerk-captcha" className="mt-2" />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !signUp || fetchStatus === "fetching"}
                whileHover={{ scale: 1.02, x: 4, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#FF5B87] text-black font-extrabold neo-border neo-shadow p-4 flex items-center justify-center gap-2 cursor-pointer select-none pt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
