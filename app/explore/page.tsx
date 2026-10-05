"use client";

import React, { useEffect, useState, useMemo } from "react";
import RequirementCard from "@/components/RequirementCard";
import { IRequirement, DonationCategory, RequirementUrgency } from "@/types";
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Inbox,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES: ("All" | DonationCategory)[] = [
  "All",
  "Food",
  "Clothes",
  "Books",
  "Stationery",
  "Blankets",
  "Essentials",
  "Other",
];

const URGENCIES: ("All" | RequirementUrgency)[] = [
  "All",
  "Critical",
  "High",
  "Medium",
  "Low",
];

export default function ExplorePage() {
  const [requirements, setRequirements] = useState<IRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/requirements");
      const data = await res.json();
      if (res.ok && data.success) {
        setRequirements(data.data || []);
      } else {
        throw new Error(data.error || "Failed to load requirements.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching requirements.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const matchesCategory =
        selectedCategory === "All" || req.category === selectedCategory;
      const matchesUrgency =
        selectedUrgency === "All" || req.urgency === selectedUrgency;
      const matchesSearch =
        searchQuery.trim() === "" ||
        req.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.ngoName &&
          req.ngoName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        req.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesUrgency && matchesSearch;
    });
  }, [requirements, selectedCategory, selectedUrgency, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100/70 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Verified NGO Demands
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950">
            Explore Urgent Community Needs
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
            Browse verified item requests posted by partner NGOs. Choose a need,
            check progress, and donate to make an instant impact.
          </p>
        </div>

        <Link
          href="/donate"
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm shadow-emerald-200 transition"
        >
          + Donate an Item
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm mb-8 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by item name, NGO name, location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600 text-sm text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Urgency Filter Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label
              htmlFor="urgency-select"
              className="text-xs font-bold text-gray-400 uppercase tracking-wider"
            >
              Urgency:
            </label>
            <select
              id="urgency-select"
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {URGENCIES.map((u) => (
                <option key={u} value={u}>
                  {u === "All" ? "All Urgencies" : `${u} Urgency`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-gray-600">
            Loading requirements from MongoDB...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto my-12">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-red-900">
            Could not fetch requirements
          </h3>
          <p className="text-sm text-red-700 mt-2">{error}</p>
          <button
            onClick={fetchRequirements}
            className="mt-5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition"
          >
            Try Again
          </button>
        </div>
      ) : filteredRequirements.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs my-10">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-gray-400 mx-auto mb-4">
            <Inbox className="w-8 h-8 text-emerald-700" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            No donation requirements found yet.
          </h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {requirements.length > 0
              ? "No requirements match your current search or category filters. Try clearing filters."
              : "NGOs haven't published any requirements yet. Are you an NGO? Post your first requirement on your dashboard."}
          </p>
          {requirements.length > 0 ? (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedUrgency("All");
                setSearchQuery("");
              }}
              className="mt-6 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset Filters
            </button>
          ) : (
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/ngo/dashboard"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Go to NGO Dashboard
              </Link>
              <Link
                href="/donate"
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Donate Items
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 px-1">
            <span>
              Showing <strong>{filteredRequirements.length}</strong> active need
              {filteredRequirements.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequirements.map((req) => (
              <RequirementCard key={req._id} requirement={req} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

