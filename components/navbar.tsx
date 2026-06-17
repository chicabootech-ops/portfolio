"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, User, Heart, ShoppingBag } from "lucide-react";

// Mock data for categories to match an e-commerce structure
const categories = [
  { label: "Trending Flowers", href: "/category/trending" },
  { label: "Personalized Roses", href: "/category/personalized" },
  { label: "Bespoke Garlands", href: "/category/garlands" },
  { label: "Gifts for Her", href: "/category/gifts-her" },
  { label: "Corporate Gifting", href: "/category/corporate" },
  { label: "Track Order", href: "/track-order" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 flex flex-col bg-background/80 backdrop-blur-xl border-b border-border/30">
      
      {/* 1. Announcement Bar (Using your Blush Pink / Secondary color) */}
      <div className="w-full bg-secondary py-1.5 flex justify-center items-center px-4">
        <p className="text-xs font-medium text-secondary-foreground tracking-wide text-center">
          Crafting bespoke memories. Free delivery on orders over $100. ✨
        </p>
      </div>

      {/* 2. Main Utility Row (Logo, Search, Icons) */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-6">
        
        {/* Mobile Menu Toggle & Search (Visible on Mobile) */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button className="text-foreground hover:text-primary transition-colors md:hidden">
            <Search size={20} />
          </button>
        </div>

        {/* Brand Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <span className="font-serif italic text-primary text-2xl md:text-3xl font-medium tracking-wide">
            Chic A Boo
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex relative w-full max-w-md mx-auto group">
          <input 
            type="text" 
            placeholder="Find your perfect bouquet..." 
            className="w-full bg-white/50 border border-border/40 rounded-full py-2.5 pl-5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all shadow-sm"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-1.5 rounded-full hover:opacity-90 transition-opacity">
            <Search size={16} />
          </button>
        </div>

        {/* User Utilities (Account, Wishlist, Cart) */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <Link href="/account" className="hidden sm:flex text-foreground hover:text-primary transition-colors">
            <User size={22} strokeWidth={1.5} />
          </Link>
          <Link href="/wishlist" className="hidden sm:flex text-foreground hover:text-primary transition-colors">
            <Heart size={22} strokeWidth={1.5} />
          </Link>
          <Link href="/cart" className="relative flex text-foreground hover:text-primary transition-colors group">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {/* Cart Badge */}
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              2
            </span>
          </Link>
        </div>
      </div>

      {/* 3. Category Navigation Row (Desktop Only) */}
      <nav className="hidden lg:flex w-full border-t border-border/20 bg-white/30">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-center items-center gap-8 h-12">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* 4. Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[calc(100%)] left-0 w-full h-[100vh] bg-background/95 backdrop-blur-xl border-t border-border/30 lg:hidden flex flex-col p-6 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Mobile Search (If omitted from top bar on extra small screens) */}
          <div className="relative w-full mb-4 md:hidden">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-white border border-border/40 rounded-xl py-3 pl-4 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary py-2 border-b border-border/20 transition-colors"
            >
              {category.label}
            </Link>
          ))}
          
          {/* Mobile Utility Links */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-border/30">
            <Link href="/account" className="flex items-center gap-2 text-foreground font-medium">
              <User size={20} /> Account
            </Link>
            <Link href="/wishlist" className="flex items-center gap-2 text-foreground font-medium">
              <Heart size={20} /> Wishlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;