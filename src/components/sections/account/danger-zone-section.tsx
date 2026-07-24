"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
} from "@/components/ui/dialog";
import { AuthFormField, authInputClassName } from "@/components/sections/auth/auth-form-field";
import { useAuth } from "@/components/providers/auth-provider";
import { deleteAccount } from "@/lib/account/api";
import { SectionCard } from "./shared/section-card";

export function DangerZoneSection() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setIsDeleting(true);
    try {
      await deleteAccount(password);
      await logout();
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete account");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <SectionCard title="Danger Zone">
        <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-destructive" size={20} />
            <div className="flex-1">
              <p className="font-medium text-foreground">Delete account</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Permanently deactivate your account. This action cannot be undone.
              </p>
              <Button
                type="button"
                variant="destructive"
                className="mt-4 h-11 min-h-[44px] rounded-full"
                onClick={() => setOpen(true)}
              >
                <Trash2 size={16} />
                Delete my account
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete your account?"
        description="This will revoke all sessions and soft-delete your profile. You will not be able to sign in again."
      >
        {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
        <AuthFormField label="Enter your password" id="delete-password">
          <input
            id="delete-password"
            type="password"
            className={authInputClassName}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </AuthFormField>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="button" variant="destructive" disabled={!password || isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting…" : "Confirm deletion"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
