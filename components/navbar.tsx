import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "View Products", href: "/products" },
  { label: "Customise Your Product", href: "/customise" },
  { label: "Track Your Order", href: "/track-order" },
  { label: "About the Founders", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

const Navbar = () => {
  return (
    <div className="w-screen h-20 bg-background">
      {/* <div className="w-[95vw] max-w-7xl h-[10vh] mx-auto flex items-center justify-between gap-4 px-6 border fixed top-3 right-1/2 left-1/2 -translate-x-1/2 rounded-full backdrop-blur-3xl bg-white/10 border-white/20 z-50"> */}
      <div className="w-[95vw] max-w-7xl h-[10vh] mx-auto flex items-center justify-between gap-4 px-6 fixed top-3 right-1/2 left-1/2 -translate-x-1/2 rounded-full z-50 backdrop-blur-md bg-gradient-to-b from-white/60 to-white/20 border border-white/80 shadow-lg shadow-[#946A2B]/10">
        <Link href="/" className="shrink-0">
          {/* <Image
            src="/logo.png"
            alt="Chic A Boo"
            width={60}
            height={60}
            priority
          /> */}
        </Link>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="flex lg:hidden items-center gap-3 overflow-x-auto max-w-[55vw] scrollbar-none">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
