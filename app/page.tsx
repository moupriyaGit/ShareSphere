"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Gift,
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
  Package,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import RequirementCard from "@/components/RequirementCard";
import { IRequirement } from "@/types";

export default function HomePage() {
  const [stats, setStats] = useState({
    donationsCount: 120,
    ngosCount: 24,
    itemsShared: 680,
  });
  const [urgentNeeds, setUrgentNeeds] = useState<IRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        // Fetch donations count
        const donRes = await fetch("/api/donations");
        let totalDonations = 0;
        let totalItems = 0;
        if (donRes.ok) {
          const donData = await donRes.json();
          if (donData.success && Array.isArray(donData.data)) {
            totalDonations = donData.data.length;
            totalItems = donData.data.reduce(
              (acc: number, item: { quantity?: number }) =>
                acc + (item.quantity || 1),
              0
            );
          }
        }

        // Fetch requirements
        const reqRes = await fetch("/api/requirements");
        let activeReqs: IRequirement[] = [];
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (reqData.success && Array.isArray(reqData.data)) {
            activeReqs = reqData.data;
          }
        }

        // Fetch NGOs count
        const userRes = await fetch("/api/users?role=ngo");
        let ngoTotal = 0;
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success && Array.isArray(userData.data)) {
            ngoTotal = userData.data.length;
          }
        }

        setStats({
          donationsCount: Math.max(totalDonations, 100),
          ngosCount: Math.max(ngoTotal, 20),
          itemsShared: Math.max(totalItems, 500),
        });

        // Pick urgent needs
        setUrgentNeeds(activeReqs.slice(0, 3));
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-emerald-50/60 via-cream-100/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6 border border-emerald-200/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Social-Impact Item Donation Platform
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-forest-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Give what you can. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-forest-700 to-emerald-800">
              Reach who needs it.
            </span>
          </h1>

          {/* Tagline / Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ShareSphere connects your donations with NGOs and communities that
            need them the most. Transparent, dignified, and direct social impact.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/donate"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Donate Now
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 text-forest-900 font-bold text-base border-2 border-emerald-600/20 hover:border-emerald-600 shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-emerald-600" />
              Explore Needs
            </Link>
          </div>

          {/* Platform Pillars */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified NGOs & Partners
            </div>
            <div className="flex items-center justify-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              Zero Platform Commission
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              End-to-End Tracking
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 mb-2">
            Seamless Process
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-forest-950">
            How It Works
          </p>
          <p className="mt-3 text-gray-600 text-sm">
            Turning kindness into swift action in three clear milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mb-6">
              01
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Donate Items
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              List the usable items you wish to give away — clothes, food, books,
              blankets, or everyday essentials with quantities and location.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mb-6">
              02
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Find the Right Need
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Verified NGOs publish specific item requirements with urgency
              levels, preventing waste and ensuring items reach the right hands.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mb-6">
              03
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Make an Impact
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Items are handed over to NGOs for direct distribution to families,
              shelters, and children, completing the loop of social good.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-forest-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 mb-2">
              Our Footprint
            </h3>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              Growing Impact Across Communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <StatsCard
              variant="forest"
              label="Donations"
              value={`${stats.donationsCount}+`}
              description="Contributions listed by generous donors"
              icon={<Gift className="w-6 h-6" />}
            />
            <StatsCard
              variant="forest"
              label="Active NGOs"
              value={`${stats.ngosCount}+`}
              description="Verified community organizations on board"
              icon={<Users className="w-6 h-6" />}
            />
            <StatsCard
              variant="forest"
              label="Items Shared"
              value={`${stats.itemsShared}+`}
              description="Essential goods channeled to where needed"
              icon={<Package className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* Urgent Needs Preview (if available) */}
      {urgentNeeds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-red-600">
                Immediate Attention
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Urgent NGO Requirements
              </h2>
            </div>
            <Link
              href="/explore"
              className="text-emerald-700 hover:text-emerald-800 font-bold text-sm flex items-center gap-1.5"
            >
              View all needs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgentNeeds.map((req) => (
              <RequirementCard key={req._id} requirement={req} />
            ))}
          </div>
        </section>
      )}

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <div className="bg-cream-100 border border-cream-300/50 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col items-center">
          <h2 className="text-3xl font-extrabold text-forest-950">
            Have usable items sitting idle?
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl text-sm leading-relaxed">
            Turn your unused clothes, blankets, books, or pantry items into a
            lifeline for someone in your city today.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition"
            >
              Start Donating
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

