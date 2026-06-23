"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  MapPin,
  Package,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useDisplayAvatar } from "@/hooks/useDisplayAvatar";
import type { AuthUser } from "@/types/auth";

const accountMenuItems = [
  { label: "Profile", href: "/account", icon: UserCircle },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
] as const;

function getDisplayName(user: AuthUser) {
  const trimmedName = user.name?.trim();
  if (trimmedName) {
    return trimmedName.split(" ")[0];
  }

  return user.email.split("@")[0];
}

function getInitials(user: AuthUser) {
  const trimmedName = user.name?.trim();
  if (trimmedName) {
    return trimmedName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return user.email.charAt(0).toUpperCase();
}

type UserAccountDropdownProps = {
  className?: string;
  onNavigate?: () => void;
};

export function UserAccountDropdown({
  className,
  onNavigate,
}: UserAccountDropdownProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }

  const displayName = getDisplayName(user);
  const { src: avatarSrc } = useDisplayAvatar(user.avatar_url);

  async function handleLogout() {
    setIsOpen(false);
    onNavigate?.();
    await logout();
    router.push("/");
    router.refresh();
  }

  function handleItemClick() {
    setIsOpen(false);
    onNavigate?.();
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-foreground transition-colors hover:text-primary"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {avatarSrc ? (
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border/50 shadow-sm">
            <Image src={avatarSrc} alt="" fill className="object-cover" unoptimized />
          </span>
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/50 bg-white/80 text-sm font-semibold text-primary shadow-sm">
            {getInitials(user)}
          </span>
        )}
        <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
        <ChevronDown
          size={16}
          className={`hidden transition-transform duration-200 sm:inline ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-60 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border/30 bg-white shadow-2xl"
        >
          <div className="border-b border-border/20 px-5 py-4">
            <p className="text-base font-semibold text-foreground">Your Account</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>

          <div className="flex flex-col py-2">
            {accountMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={handleItemClick}
                  className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary/40 hover:text-primary"
                >
                  <Icon size={20} strokeWidth={1.5} className="shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-border/20 py-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-4 px-5 py-3.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary/40 hover:text-primary"
            >
              <LogOut size={20} strokeWidth={1.5} className="shrink-0" />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
