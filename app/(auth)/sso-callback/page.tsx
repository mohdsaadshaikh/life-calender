"use client";

import { AuthenticateWithRedirectCallback, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader } from "@/components/ui/loader";

export default function SSOCallbackPage() {
  return (
    <>
      <ClerkLoading>
        <Loader message="Finishing authentication..." fullScreen={true} />
      </ClerkLoading>

      <ClerkLoaded>
        <AuthenticateWithRedirectCallback
          signUpForceRedirectUrl="/calendar/onboarding"
          signInForceRedirectUrl="/calendar"
        />
      </ClerkLoaded>
    </>
  );
}
