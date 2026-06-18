import type { Metadata } from "next";
import { AccountPage } from "@/components/sections/account";

export const metadata: Metadata = {
  title: "My Account | Chic A Boo",
  description: "Manage your Chic A Boo profile, orders, addresses, and preferences.",
};

export default function AccountRoutePage() {
  return <AccountPage />;
}
