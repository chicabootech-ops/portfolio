"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

const HIDDEN_NAV_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
]);

export function ConditionalNavbar() {
  const pathname = usePathname();

  if (HIDDEN_NAV_ROUTES.has(pathname)) {
    return null;
  }

  return <Navbar />;
}
