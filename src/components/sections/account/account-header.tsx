"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Crown,
  Mail,
  Pencil,
  Phone,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AccountProfile } from "@/types/account";
import type { AuthUser } from "@/types/auth";

type AccountHeaderProps = {
  user: AuthUser;
  profile: AccountProfile;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatMemberSince(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function AccountHeader({ user, profile }: AccountHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-white via-white to-secondary/40 p-5 shadow-md md:p-6"
      id="profile"
      aria-label="Account profile"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 size-28 rounded-full bg-secondary/60 blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-xl font-semibold text-primary-foreground shadow-md md:size-20 md:text-2xl"
            aria-hidden
          >
            {getInitials(user.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground md:text-2xl">
                {user.name}
              </h1>
              {profile.isPremium ? (
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Crown size={12} aria-hidden />
                  Premium
                </Badge>
              ) : null}
              {profile.loyaltyLevel ? (
                <Badge variant="outline" className="gap-1">
                  <Sparkles size={12} aria-hidden />
                  {profile.loyaltyLevel} Member
                </Badge>
              ) : null}
            </div>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail size={14} aria-hidden />
              {user.email}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone size={14} aria-hidden />
              {profile.phone}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {user.is_verified ? (
                <Badge variant="success" className="gap-1">
                  <BadgeCheck size={12} aria-hidden />
                  Email verified
                </Badge>
              ) : (
                <Badge variant="warning">Email not verified</Badge>
              )}
              {profile.phoneVerified ? (
                <Badge variant="success" className="gap-1">
                  <BadgeCheck size={12} aria-hidden />
                  Phone verified
                </Badge>
              ) : (
                <Badge variant="warning">Phone not verified</Badge>
              )}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Member since {formatMemberSince(user.created_at)}
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 min-h-[44px] w-full shrink-0 rounded-full sm:w-auto"
        >
          <Link href="/account#profile">
            <Pencil size={16} aria-hidden />
            Edit Profile
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
