import React from "react";
import Link from "next/link";
import { HeartHandshake, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-gray-300 border-t border-forest-900/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">
                Share<span className="text-emerald-400">Sphere</span>
              </span>
            </Link>
            <p className="text-emerald-100/80 text-sm font-medium italic">
              &ldquo;Give what you can. Reach who needs it.&rdquo;
            </p>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              ShareSphere is a social-impact donation platform bridging the gap
              between compassionate donors and verified NGOs. Turning unused items
              into immediate relief and dignified support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-emerald-400 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="text-gray-400 hover:text-emerald-400 transition"
                >
                  Explore Urgent Needs
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-gray-400 hover:text-emerald-400 transition"
                >
                  Donate Items
                </Link>
              </li>
              <li>
                <Link
                  href="/donor/dashboard"
                  className="text-gray-400 hover:text-emerald-400 transition"
                >
                  Donor Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/ngo/dashboard"
                  className="text-gray-400 hover:text-emerald-400 transition"
                >
                  NGO Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Organization / Join */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Join Our Network
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Are you an NGO providing community relief? Register with
              ShareSphere to list real-time needs and connect with community donors.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-block px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition"
              >
                Register as an NGO
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-forest-900/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} ShareSphere. Built for Social Impact.</p>
          <p className="flex items-center gap-1 text-gray-400">
            Powered by Next.js & MongoDB with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}

