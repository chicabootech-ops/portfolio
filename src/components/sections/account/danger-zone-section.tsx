"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "./shared/section-card";

export function DangerZoneSection() {
  return (
    <SectionCard title="Danger Zone">
      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
        <p className="font-medium text-foreground">Close account</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Self-serve account deletion is not available yet. Email us and we will close
          your account and revoke active sessions.
        </p>
        <Button type="button" variant="outline" className="mt-4 h-11 min-h-[44px] rounded-full" asChild>
          <a href="mailto:hello@chicaboo.co?subject=Close%20my%20Chic%20A%20Boo%20account">
            <Mail size={16} aria-hidden />
            Request account closure
          </a>
        </Button>
      </div>
    </SectionCard>
  );
}
