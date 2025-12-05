import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

// Minimalist hexagon logo icon
const HexLogo = ({ light = false }: { light?: boolean }) => (
  <svg
    width="32"
    height="36"
    viewBox="0 0 32 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={light ? "text-surface-dark-foreground" : "text-foreground"}
    aria-hidden="true"
  >
    {/* Outer hexagon */}
    <path
      d="M16 1L30 9.5V26.5L16 35L2 26.5V9.5L16 1Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    {/* Inner hexagon */}
    <path
      d="M16 8L24 13V23L16 28L8 23V13L16 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Center dot */}
    <circle cx="16" cy="18" r="2" fill="currentColor" />
  </svg>
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = !scrolled && !mobileMenuOpen;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isTransparent 
          ? "bg-transparent border-b border-transparent" 
          : "bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm"
      }`}
      style={{
        backdropFilter: isTransparent ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: isTransparent ? 'none' : 'blur(12px)',
      }}
    >
      <nav
        className="section-padding py-4 flex items-center justify-between"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-3"
          aria-label="MINML Home"
        >
          <HexLogo light={isTransparent} />
          <span className={`text-xl font-semibold tracking-tight transition-colors ${
            isTransparent ? "text-surface-dark-foreground" : "text-foreground"
          }`}>
            MINML
          </span>
        </a>

        {/* Desktop Navigation - All on the right */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                isTransparent 
                  ? "text-surface-dark-foreground/80 hover:text-surface-dark-foreground" 
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className={`text-sm transition-colors underline underline-offset-4 ${
              isTransparent 
                ? "text-surface-dark-foreground/80 hover:text-surface-dark-foreground" 
                : "text-foreground/80 hover:text-foreground"
            }`}
          >
            Request demo
          </a>
          <Button variant={isTransparent ? "outline-light" : "icon"} size="icon" asChild>
            <a href="#demo" aria-label="Request a demo">
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`md:hidden p-2 -mr-2 ${isTransparent ? "text-surface-dark-foreground" : "text-foreground"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-background border-b border-border"
        >
          <div className="section-padding py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg text-foreground py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button variant="hero" className="mt-4" asChild>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)}>
                Request demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
