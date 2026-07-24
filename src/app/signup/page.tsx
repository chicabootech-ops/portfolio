import type { Metadata } from "next";
import { SignupSection } from "@/components/sections/auth";

export const metadata: Metadata = {
  title: "Create Account | Chic A Boo",
  description: "Join Chic A Boo to save favourites, track orders, and customise gifts.",
};

export default function SignupPage() {
  return <SignupSection />;
}
