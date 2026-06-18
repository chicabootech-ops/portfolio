"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingFlow } from "@/components/sections/onboarding/onboarding-flow";
import { AccountPageSkeleton } from "@/components/sections/account/account-page-skeleton";
import { useAuth } from "@/components/providers/auth-provider";

export function OnboardingPageClient() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login?next=/onboarding");
      return;
    }
    if (user.profile_completed) {
      router.replace("/account");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <AccountPageSkeleton />;
  }

  if (user.profile_completed) {
    return <AccountPageSkeleton />;
  }

  return <OnboardingFlow />;
}
