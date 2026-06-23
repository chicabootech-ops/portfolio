"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, User, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { shopCategories } from "@/data/categories";
import { mainNavLinks, siteConfig } from "@/config/site";
import { UserAccountDropdown } from "./user-account-dropdown";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchEditable, setSearchEditable] = useState(false);
  const [mobileSearchEditable, setMobileSearchEditable] = useState(false);

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl border-b border-border/30 shadow-sm">
        
        {/* 1. Announcement Bar */}
        <div className="w-full bg-secondary py-1.5 flex justify-center items-center px-4">
          <p className="text-xs font-medium text-secondary-foreground tracking-wide text-center">
            {siteConfig.announcement}
          </p>
        </div>

        {/* 2. Main Utility Row (Logo, Search, Icons) */}
        <div className="max-w-7xl w-full mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-6">
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-primary transition-colors p-1"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
            <button className="text-foreground hover:text-primary transition-colors md:hidden">
              <Search size={20} />
            </button>
          </div>

          {/* Brand Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <span className="font-serif italic text-primary text-2xl md:text-3xl font-medium tracking-wide">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            role="search"
            className="hidden md:flex relative w-full max-w-md mx-auto group"
            onSubmit={(e) => e.preventDefault()}
            autoComplete="off"
          >
            <input
              id="site-search"
              name="q"
              type="search"
              enterKeyHint="search"
              placeholder={siteConfig.searchPlaceholder}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              readOnly={!searchEditable}
              onFocus={() => setSearchEditable(true)}
              data-lpignore="true"
              data-1p-ignore
              aria-label="Search products"
              className="w-full bg-white/60 border border-border/40 rounded-full py-2.5 pl-5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-1.5 rounded-full hover:opacity-90 transition-opacity"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </form>

          {/* User Utilities */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            {!isLoading && user ? (
              <UserAccountDropdown />
            ) : (
              <Link
                href="/login"
                className="flex text-foreground hover:text-primary transition-colors"
                aria-label="Sign in"
              >
                <User size={22} strokeWidth={1.5} />
              </Link>
            )}
            <Link href="/wishlist" className="hidden sm:flex text-foreground hover:text-primary transition-colors">
              <Heart size={22} strokeWidth={1.5} />
            </Link>
            <Link href="/cart" className="relative flex text-foreground hover:text-primary transition-colors group">
              <ShoppingBag size={22} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                2
              </span>
            </Link>
          </div>
        </div>

        {/* 3. Unified Navigation Row with Dropdown */}
        <nav className="hidden lg:flex w-full border-t border-border/20 bg-white/20">
          <div className="max-w-5xl mx-auto w-full px-6 flex justify-between items-center h-14">
            
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>

            {/* SHOP DROPDOWN */}
            <div className="group relative h-full flex items-center">
              <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors h-full">
                Shop <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* The Dropdown Menu Box */}
              <div className="absolute top-[calc(100%-4px)] left-1/2 -translate-x-1/2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 w-56 bg-white/95 backdrop-blur-xl border border-border/30 shadow-xl rounded-2xl p-2 flex flex-col z-50">
                {shopCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/40 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>

            {mainNavLinks
              .filter((link) => link.href !== "/")
              .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}

          </div>
        </nav>
      </header>

      {/* 4. Unified Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[108px] left-0 w-full h-[calc(100vh-108px)] bg-background/95 backdrop-blur-xl border-t border-border/30 z-40 lg:hidden flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
          
          <form
            role="search"
            className="relative w-full mb-6 md:hidden"
            onSubmit={(e) => e.preventDefault()}
            autoComplete="off"
          >
            <input
              id="site-search-mobile"
              name="q"
              type="search"
              enterKeyHint="search"
              placeholder="Search products..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              readOnly={!mobileSearchEditable}
              onFocus={() => setMobileSearchEditable(true)}
              data-lpignore="true"
              data-1p-ignore
              aria-label="Search products"
              className="w-full bg-white border border-border/40 rounded-xl py-3 pl-4 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
          </form>

          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Shop</p>
          <div className="flex flex-col gap-1 mb-6 border-l-2 border-primary/20 pl-4">
            {shopCategories.map((category) => (
              <Link key={category.href} href={category.href} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary py-1.5 transition-colors">
                {category.label}
              </Link>
            ))}
          </div>

          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Menu</p>
          <div className="flex flex-col gap-1 mb-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary py-2 border-b border-border/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto border-t border-border/30 pt-6">
            {!isLoading && user ? (
              <UserAccountDropdown onNavigate={() => setIsMobileMenuOpen(false)} />
            ) : (
              <div className="flex gap-6">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 font-medium text-foreground"
                >
                  <User size={20} /> Sign In
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 font-medium text-foreground"
                >
                  <Heart size={20} /> Wishlist
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}