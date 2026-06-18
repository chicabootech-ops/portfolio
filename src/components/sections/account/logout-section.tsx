"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAuth } from "@/components/providers/auth-provider";

export function LogoutSection() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setOpen(false);
    }
  }

  return (
    <>
      <section className="pb-2" aria-label="Logout">
        <Button
          type="button"
          variant="destructive"
          onClick={() => setOpen(true)}
          className="h-12 min-h-[44px] w-full rounded-2xl text-base font-semibold"
        >
          <LogOut size={18} aria-hidden />
          Log Out
        </Button>
      </section>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Log out of Chic A Boo?"
        description="You'll need to sign in again to access your orders, wishlist, and saved addresses."
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="h-11 min-h-[44px] rounded-full"
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleLogout}
            className="h-11 min-h-[44px] rounded-full"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Yes, log out"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
