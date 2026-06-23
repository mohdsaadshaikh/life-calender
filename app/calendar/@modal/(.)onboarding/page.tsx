"use client";

import { OnboardingModal } from "@/components/life-calendar/onboarding-modal";
import { useRouter } from "next/navigation";

export default function OnboardingModalPage() {
  const router = useRouter();

  return (
    <OnboardingModal
      onComplete={() => {
        router.push("/calendar");
      }}
    />
  );
}
