"use client";

import { OnboardingModal } from "@/components/life-calendar/onboarding-modal";
import { useRouter } from "next/navigation";

export default function OnboardingStandalonePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F6F0E5] horizons-bg p-4">
      <OnboardingModal
        onComplete={() => {
          router.push("/calendar");
        }}
      />
    </main>
  );
}
