"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Calendar, ArrowRight, Sparkles, Heart, Clock } from "lucide-react";
import { useLifeCalendarStore } from "@/lib/life-calendar-store";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";

interface OnboardingModalProps {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { initializeCalendar, setSettings, settings } = useLifeCalendarStore();
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState("");
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [month, setMonth] = useState<Date>(new Date());

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setMonth((currentMonth) => {
      const newMonth = new Date(currentMonth);
      newMonth.setFullYear(parseInt(year));
      return newMonth;
    });
  };

  const steps = [
    {
      icon: Sparkles,
      title: "WELCOME TO LIFE CALENDAR",
      subtitle: "Visualize your entire life, week by week",
      color: "bg-primary",
    },
    {
      icon: Calendar,
      title: "WHEN WERE YOU BORN?",
      subtitle: "Enter your birth date to start mapping your journey",
      color: "bg-secondary",
    },
    {
      icon: Clock,
      title: "SET YOUR HORIZON",
      subtitle: "How many years do you want to visualize?",
      color: "bg-accent",
    },
    {
      icon: Heart,
      title: "YOU'RE ALL SET!",
      subtitle: "Start documenting your life's moments",
      color: "bg-chart-4",
    },
  ];

  const handleNext = () => {
    if (step === 1 && !birthDate) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      initializeCalendar(new Date(birthDate));
      setSettings({ lifeExpectancy });
      onComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/80 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        key={step}
        initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.8, rotate: 5, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`${currentStep.color} neo-border neo-shadow-xl w-full max-w-md p-8`}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="bg-card neo-border neo-shadow w-20 h-20 mx-auto mb-6 flex items-center justify-center"
        >
          <currentStep.icon className="w-10 h-10" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-center mb-2"
        >
          {currentStep.title}
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8 opacity-80"
        >
          {currentStep.subtitle}
        </motion.p>

        {/* Step-specific content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="neo-border neo-shadow bg-card font-mono text-lg p-4 w-full text-center hover:bg-card"
                  >
                    {birthDate
                      ? format(new Date(birthDate), "PPP")
                      : "Pick your birth date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="center">
                  <div className="">
                    <Select
                      value={selectedYear}
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {Array.from(
                          { length: new Date().getFullYear() - 1900 + 1 },
                          (_, i) => new Date().getFullYear() - i,
                        ).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CalendarComponent
                      mode="single"
                      selected={birthDate ? new Date(birthDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setBirthDate(date.toISOString().split("T")[0]);
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      month={month}
                      onMonthChange={(date) => {
                        setMonth(date);
                        setSelectedYear(date.getFullYear().toString());
                      }}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="bg-card neo-border neo-shadow p-6">
                <div className="text-center mb-4">
                  <span className="text-5xl font-bold">{lifeExpectancy}</span>
                  <span className="text-xl ml-2">YEARS</span>
                </div>
                <Slider
                  value={[lifeExpectancy]}
                  onValueChange={([value]) => setLifeExpectancy(value)}
                  min={50}
                  max={120}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm font-mono opacity-70">
                  <span>50</span>
                  <span>120</span>
                </div>
              </div>
              <p className="text-center text-sm mt-4 opacity-70">
                This creates {lifeExpectancy * 52} weeks to track
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i === step ? 1.2 : 1 }}
              className={`w-3 h-3 neo-border ${i === step ? "bg-foreground" : i < step ? "bg-card" : "bg-transparent"}`}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.button
          whileHover={{ scale: 1.05, x: 8, y: -8 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={step === 1 && !birthDate}
          className="w-full bg-card neo-border neo-shadow-lg p-4 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {step === steps.length - 1 ? "START MY CALENDAR" : "NEXT"}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
