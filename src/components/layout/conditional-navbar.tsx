"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

const AUTH_ROUTES = new Set(["/login", "/signup"]);

export function ConditionalNavbar() {
  const pathname = usePathname();

  if (AUTH_ROUTES.has(pathname)) {
    return null;
  }

  return <Navbar />;
}
