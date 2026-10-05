"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartHandshake,
  Menu,
  X,
  Compass,
  Gift,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { IUser } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    // Read user from localStorage if logged in
    const checkUser = () => {
      const stored = localStorage.getItem("sharesphere_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    window.addEventListener("sharesphere_auth_change", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("sharesphere_auth_change", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sharesphere_user");
    setCurrentUser(null);
    window.dispatchEvent(new Event("sharesphere_auth_change"));
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore Needs" },
    { href: "/donate", label: "Donate" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-forest-700 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl sm:text-2xl text-forest-900 tracking-tight flex items-center gap-1">
                Share<span className="text-emerald-600">Sphere</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest -mt-1 hidden sm:block">
                Social Impact
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-emerald-700 bg-emerald-50/80 font-semibold"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {currentUser && (
              <Link
                href={
                  currentUser.role === "ngo"
                    ? "/ngo/dashboard"
                    : "/donor/dashboard"
                }
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pathname.includes("/dashboard")
                    ? "text-emerald-700 bg-emerald-50/80 font-semibold"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {currentUser.role === "ngo" ? "NGO Dashboard" : "Donor Dashboard"}
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900">
                    {currentUser.name}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 capitalize">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm shadow-emerald-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? "text-emerald-700 bg-emerald-50 font-semibold"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {currentUser ? (
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link
                href={
                  currentUser.role === "ngo"
                    ? "/ngo/dashboard"
                    : "/donor/dashboard"
                }
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50"
              >
                <LayoutDashboard className="w-5 h-5" />
                {currentUser.role === "ngo"
                  ? "NGO Dashboard"
                  : "Donor Dashboard"}
              </Link>
              <div className="px-3 py-2 flex items-center justify-between text-sm text-gray-500">
                <span>
                  Signed in as <strong>{currentUser.name}</strong> ({currentUser.role})
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 font-semibold text-xs underline"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

