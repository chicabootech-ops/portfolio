import type { Metadata } from "next";
import { LoginSection } from "@/components/sections/auth";

export const metadata: Metadata = {
  title: "Sign In | Chic A Boo",
  description: "Sign in to your Chic A Boo account to manage orders and preferences.",
};

export default function LoginPage() {
  return <LoginSection />;
}
