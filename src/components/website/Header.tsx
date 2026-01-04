import React, { useState, useEffect } from "react";
import { Truck, Menu, X, User, Phone, Home, ChevronDown } from "lucide-react";
import { throttle } from "../../utils/performance";
import { NotificationCenter } from "./NotificationCenter";

interface HeaderProps {
  onGetPrice: () => void;
  onShowLogin: (tab: "customer" | "driver" | "admin") => void;
  onShowCallback?: () => void;
}

export function Header({
  onGetPrice,
  onShowLogin,
  onShowCallback,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [logoClickTimer, setLogoClickTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    // Throttled scroll handler for better performance
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 10);
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  // Triple-click on logo opens Admin login
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (logoClickTimer) {
      clearTimeout(logoClickTimer);
    }

    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    if (newCount === 3) {
      // Triple click detected - open Admin login
      onShowLogin("admin");
      setLogoClickCount(0);
      setLogoClickTimer(null);
    } else {
      // Wait for next click (within 500ms)
      const timer = setTimeout(() => {
        if (newCount === 1) {
          // Single click - scroll to home
          scrollToSection("home");
        }
        setLogoClickCount(0);
      }, 500);
      setLogoClickTimer(timer);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-lg shadow-2xl"
          : "bg-slate-900"
      }`}
    >
      <div className="min-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-3 flex-shrink-0 group"
            onClick={handleLogoClick}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Truck className="w-10 h-10 text-blue-400 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent leading-tight">
                ShiftMyHome
              </span>
              <span className="text-xs text-slate-300 leading-tight text-center hidden sm:block">
                Your move made simple
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Optimized */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-white/90 hover:text-white transition-colors font-medium cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-white/90 hover:text-white transition-colors font-medium cursor-pointer"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection("our-story")}
              className="text-white/90 hover:text-white transition-colors font-medium cursor-pointer"
            >
              Our Story
            </button>
            <button
              onClick={() => scrollToSection("coverage")}
              className="text-white/90 hover:text-white transition-colors font-medium cursor-pointer"
            >
              Coverage
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="text-white/90 hover:text-white transition-colors font-medium cursor-pointer"
            >
              Reviews
            </button>
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Notification Center */}
            <NotificationCenter />

            <button
              onClick={() => onShowLogin("customer")}
              className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white transition-colors font-medium cursor-pointer"
              aria-label="Customer Sign In"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={onShowCallback}
              className="hidden xl:flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white transition-colors font-medium border border-white/20 rounded-full hover:bg-white/10 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              Call Me
            </button>
            <button
              onClick={onGetPrice}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
              aria-label="Get Quote"
            >
              Get Quote
            </button>
            <button
              onClick={() => onShowLogin("driver")}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
              aria-label="Driver Portal"
            >
              Driver Portal
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("services")}
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection("our-story")}
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                Our Story
              </button>
              <button
                onClick={() => scrollToSection("coverage")}
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                Coverage
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                Reviews
              </button>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    onShowLogin("customer");
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2.5 text-white border border-white/20 hover:bg-white/10 rounded-full transition-all font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onGetPrice();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold"
                >
                  Get Quote
                </button>
                <button
                  onClick={() => {
                    onShowLogin("driver");
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold"
                >
                  Driver Portal
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
