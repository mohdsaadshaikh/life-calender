import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  status?: "idle" | "verifying" | "success" | "error";
}

export function OTPInput({ value, onChange, length = 6, disabled = false, status = "idle" }: OTPInputProps) {
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = Array(length).fill("");
    for (let i = 0; i < Math.min(value.length, length); i++) {
      arr[i] = value[i];
    }
    return arr;
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync internal digits with outer value prop
  useEffect(() => {
    const valDigits = value.split("").slice(0, length);
    const newDigits = Array(length).fill("");
    for (let i = 0; i < length; i++) {
      newDigits[i] = valDigits[i] || "";
    }
    if (newDigits.join("") !== digits.join("")) {
      setDigits(newDigits);
    }
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    // Only allow alphanumeric characters
    const cleanVal = val.replace(/[^0-9a-zA-Z]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    const combined = newDigits.join("");
    onChange(combined);

    // Auto-focus next input if filled
    if (cleanVal && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      } else if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedText = e.clipboardData
      .getData("text")
      .trim()
      .replace(/[^0-9a-zA-Z]/g, "")
      .slice(0, length);

    if (pastedText) {
      const newDigits = Array(length).fill("");
      for (let i = 0; i < pastedText.length; i++) {
        newDigits[i] = pastedText[i];
      }
      setDigits(newDigits);
      onChange(newDigits.join(""));

      // Focus the next empty slot or the last digit
      const focusIndex = Math.min(pastedText.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center items-center w-full my-2">
      <div className="flex gap-2 sm:gap-3 items-center">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
              return;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9a-zA-Z]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            disabled={disabled || status === "success"}
            className={cn(
              "w-[42px] h-[42px] sm:w-[52px] sm:h-[56px]",
              "text-center text-xl sm:text-2xl font-black bg-white border-[3px] rounded-lg",
              "focus-visible:outline-none transition-all font-mono",
              status === "success" && "border-[#22C55E] text-[#22C55E] bg-[#F0FDF4] shadow-[3px_3px_0px_0px_#22C55E]",
              status === "error" && "border-[#EF4444] text-[#EF4444] bg-[#FEF2F2] shadow-[3px_3px_0px_0px_#EF4444]",
              status === "idle" && "border-black text-black focus:translate-y-[-2px] focus:shadow-[3px_3px_0px_0px_#000000] active:translate-y-[-2px] active:shadow-[3px_3px_0px_0px_#000000]",
              disabled && status !== "success" && "opacity-50 cursor-not-allowed"
            )}
          />
        ))}
      </div>

      {/* Live status indicator to the right of inputs */}
      {(status === "verifying" || status === "success" || status === "error") && (
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          className="flex-shrink-0"
        >
          {status === "verifying" && (
            <div className="w-[42px] h-[42px] sm:w-[52px] sm:h-[56px] flex items-center justify-center bg-white border-[3px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000000]">
              <svg className="animate-spin h-6 w-6 text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          {status === "success" && (
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-[42px] h-[42px] sm:w-[52px] sm:h-[56px] flex items-center justify-center bg-[#22C55E] border-[3px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000000]"
            >
              <svg className="h-6 w-6 text-white stroke-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              animate={{ x: [0, -4, 4, -4, 4, 0] }}
              transition={{ duration: 0.5 }}
              className="w-[42px] h-[42px] sm:w-[52px] sm:h-[56px] flex items-center justify-center bg-[#EF4444] border-[3px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000000]"
            >
              <svg className="h-6 w-6 text-white stroke-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
