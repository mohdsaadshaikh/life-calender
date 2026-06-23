"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Mail, ArrowLeft, Send, Key, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { OTPInput } from "@/components/ui/otp-input";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email address."),
});

const resetSchema = z.object({
  code: z.string().min(6, "Verification code must be 6 characters."),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState<"email" | "reset">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setErrors({});
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setErrors({ email: result.error.errors[0]?.message || "Invalid email" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn.create({
        identifier: email,
      });

      if (res?.error) {
        setIsLoading(false);
        const errMsg = res.error.message || "Failed to start password reset.";
        if (errMsg.toLowerCase().includes("email") || errMsg.toLowerCase().includes("identifier")) {
          setErrors({ email: errMsg });
        } else {
          toast({
            title: "Reset Error",
            description: errMsg,
            variant: "destructive",
          });
        }
        return;
      }

      const sendRes = await signIn.resetPasswordEmailCode.sendCode();
      if (sendRes?.error) {
        setIsLoading(false);
        toast({
          title: "Reset Error",
          description: sendRes.error.message || "Failed to send reset code.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(false);
      setStep("reset");
      toast({
        title: "Code Sent!",
        description: "Please check your email for the 6-digit verification code.",
      });
    } catch (err: any) {
      setIsLoading(false);
      toast({
        title: "Reset Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyCode = async (codeToVerify: string) => {
    if (!signIn) return;
    setIsVerifyingCode(true);
    setErrors((prev) => ({ ...prev, code: "" }));
    try {
      const verifyRes = await signIn.resetPasswordEmailCode.verifyCode({
        code: codeToVerify,
      });

      if (verifyRes?.error) {
        setIsVerifyingCode(false);
        const errMsg = verifyRes.error.message || "Incorrect verification code.";
        setErrors((prev) => ({ ...prev, code: errMsg }));
        return;
      }

      setIsCodeVerified(true);
      setIsVerifyingCode(false);
    } catch (err: any) {
      setIsVerifyingCode(false);
      const errMsg = err.message || "Failed to verify code.";
      setErrors((prev) => ({ ...prev, code: errMsg }));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setErrors({});

    if (!isCodeVerified) {
      setErrors((prev) => ({ ...prev, code: "Please enter a valid verification code." }));
      return;
    }

    const result = resetSchema.safeParse({ code, newPassword, confirmPassword });
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
      const submitRes = await signIn.resetPasswordEmailCode.submitPassword({
        password: newPassword,
      });

      if (submitRes?.error) {
        setIsLoading(false);
        let errMsg = submitRes.error.message || "Failed to update password.";
        if (submitRes.error.code === "form_password_validation_failed" || errMsg.toLowerCase().includes("password")) {
          if (errMsg.toLowerCase().includes("not strong") || errMsg.toLowerCase().includes("too weak") || errMsg.toLowerCase().includes("common")) {
            errMsg = "This password is too common or weak. Please choose a different, more secure password.";
          }
          setErrors((prev) => ({ ...prev, newPassword: errMsg }));
        } else {
          toast({
            title: "Reset Error",
            description: errMsg,
            variant: "destructive",
          });
        }
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            const url = decorateUrl("/calendar");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
        toast({
          title: "Password Reset Success!",
          description: "Your password has been successfully updated.",
        });
      } else {
        setIsLoading(false);
        toast({
          title: "Status Update",
          description: `Reset status: ${signIn.status}. Please complete the flow.`,
        });
      }
    } catch (err: any) {
      setIsLoading(false);
      toast({
        title: "Reset Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

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
            {step === "email" ? "Recover Account" : "Reset Password"}
          </h1>
          <p className="text-sm font-bold text-muted-foreground max-w-md mx-auto">
            {step === "email"
              ? "Enter your email below and we will send you a verification code to recover your account access."
              : "Enter the code sent to your email and your new password below to reset your password."}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card neo-border-thick neo-shadow-xl p-6 md:p-10 text-black">


            {step === "email" ? (
              <form onSubmit={handleSendCode} className="space-y-5 text-left">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-extrabold text-sm flex items-center gap-1">
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

                <motion.button
                  type="submit"
                  disabled={isLoading || !signIn || fetchStatus === "fetching"}
                  whileHover={{ scale: 1.02, x: 4, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#52D167] text-black font-extrabold neo-border neo-shadow p-4 flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 stroke-[2.5px]" />
                  <span>{isLoading ? "SENDING CODE..." : "SEND CODE"}</span>
                </motion.button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5 text-left">
                <div className="space-y-2">

                  <OTPInput
                    value={code}
                    onChange={(val) => {
                      setCode(val);
                      if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                      if (val.length === 6 && !isVerifyingCode && !isCodeVerified) {
                        handleVerifyCode(val);
                      } else if (val.length < 6) {
                        setIsCodeVerified(false);
                      }
                    }}
                    disabled={isLoading}
                    status={isCodeVerified ? "success" : isVerifyingCode ? "verifying" : errors.code ? "error" : "idle"}
                  />

                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="font-extrabold text-sm flex items-center gap-1">
                    <Key className="w-4 h-4 stroke-[2.5px]" />
                    NEW PASSWORD
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
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
                  {errors.newPassword && (
                    <p className="text-xs text-red-500 font-extrabold mt-1 uppercase tracking-wide">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-extrabold text-sm flex items-center gap-1">
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

                <motion.button
                  type="submit"
                  disabled={isLoading || !signIn || fetchStatus === "fetching"}
                  whileHover={{ scale: 1.02, x: 4, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#FF5B87] text-black font-extrabold neo-border neo-shadow p-4 flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? "RESETTING PASSWORD..." : "RESET PASSWORD"}</span>
                </motion.button>
              </form>
            )}

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
      </div>
    </main>
  );
}
