"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatsCard from "@/components/StatsCard";
import DonationCard from "@/components/DonationCard";
import { IDonation } from "@/types";
import {
  Gift,
  PlusCircle,
  RefreshCw,
  Package,
  Layers,
  CheckCircle2,
  Inbox,
  AlertCircle,
} from "lucide-react";

export default function DonorDashboard() {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/donations");
      const data = await res.json();
      if (res.ok && data.success) {
        setDonations(data.data || []);
      } else {
        throw new Error(data.error || "Failed to load donations.");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error connecting to database.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Compute metrics
  const totalDonations = donations.length;
  const activeDonations = donations.filter(
    (d) => d.status === "Listed" || d.status === "Matched"
  ).length;
  const totalItemsDonated = donations.reduce(
    (acc, curr) => acc + (curr.quantity || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950">
            Donor Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your shared items and their status from listing to delivery.
          </p>
        </div>

        <Link
          href="/donate"
          className="self-start sm:self-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Donation
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label="Total Donations"
          value={totalDonations}
          description="Total donation requests logged"
          icon={<Gift className="w-6 h-6" />}
          variant="cream"
        />
        <StatsCard
          label="Active Donations"
          value={activeDonations}
          description="Currently listed or in matching"
          icon={<Layers className="w-6 h-6" />}
          variant="emerald"
        />
        <StatsCard
          label="Items Donated"
          value={totalItemsDonated}
          description="Individual items put to meaningful use"
          icon={<Package className="w-6 h-6" />}
          variant="amber"
        />
      </div>

      {/* Donations List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Listed Donations</h2>
          <button
            onClick={fetchDonations}
            disabled={loading}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-emerald-50 transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-600">
              Fetching donations from MongoDB...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto my-8">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-800">{error}</p>
            <button
              onClick={fetchDonations}
              className="mt-4 px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : donations.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs my-6">
            <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-emerald-700 mx-auto mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No donations listed yet
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              You haven&apos;t created any item donations yet. Start giving by creating
              your first donation.
            </p>
            <Link
              href="/donate"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Donation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <DonationCard key={donation._id} donation={donation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

