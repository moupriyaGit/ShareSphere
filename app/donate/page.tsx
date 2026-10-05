"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { DonationCategory } from "@/types";
import {
  Gift,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Package,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES: DonationCategory[] = [
  "Food",
  "Clothes",
  "Books",
  "Stationery",
  "Blankets",
  "Essentials",
  "Other",
];

function DonateFormContent() {
  const searchParams = useSearchParams();

  const [donorName, setDonorName] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<DonationCategory>("Clothes");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if query params provided
    const queryCategory = searchParams.get("category") as DonationCategory | null;
    const queryItem = searchParams.get("item");
    if (queryCategory && CATEGORIES.includes(queryCategory)) {
      setCategory(queryCategory);
    }
    if (queryItem) {
      setItemName(queryItem);
    }

    // Prefill from logged in user if available
    const stored = localStorage.getItem("sharesphere_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u && u.name) setDonorName(u.name);
      } catch {
        // ignore
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      let donorId = "";
      const stored = localStorage.getItem("sharesphere_user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (u && u._id) donorId = u._id;
        } catch {
          // ignore
        }
      }

      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId,
          donorName: donorName.trim() || "Anonymous Donor",
          itemName: itemName.trim(),
          category,
          quantity: Number(quantity),
          description: description.trim(),
          location: location.trim(),
          status: "Listed",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit donation.");
      }

      // Success!
      setSuccessMessage(data.message || "Donation submitted successfully! 🎉");
      // Clear the form
      setItemName("");
      setQuantity(1);
      setDescription("");
      setLocation("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100/70 text-emerald-800 text-xs font-bold mb-2">
          <Gift className="w-3.5 h-3.5 text-emerald-600" />
          Make an Impact
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950">
          Donate Useful Items
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Every item you share finds a new purpose. Fill out the details below to
          list your donation for community NGOs to match and collect.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base">{successMessage}</h3>
              <p className="text-xs text-emerald-700 mt-1">
                Your donation is now listed and visible to NGOs and community
                coordinators.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/donor/dashboard"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
            >
              View in Dashboard
            </Link>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 shadow-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Submission failed</p>
            <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donor Name */}
          <FormInput
            label="Donor Name"
            placeholder="e.g. Rahul Sharma (or leave for anonymous)"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            helperText="Your name will be visible to coordinating NGOs."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Item Name */}
            <FormInput
              label="Item Name"
              placeholder="e.g. Winter Jackets, Rice 10kg, Math Books"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

            {/* Category */}
            <div className="w-full flex flex-col gap-1.5">
              <label
                htmlFor="category-select"
                className="text-sm font-semibold text-gray-700 flex items-center gap-1"
              >
                Category <span className="text-emerald-600">*</span>
              </label>
              <select
                id="category-select"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value as DonationCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 bg-white text-gray-800 text-sm shadow-sm transition-all duration-150 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Quantity */}
            <FormInput
              label="Quantity"
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              helperText="Number of items, sets, or packs you are donating."
            />

            {/* Location */}
            <FormInput
              label="Pickup Location"
              placeholder="e.g. Indiranagar, Bengaluru or Area & City"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              helperText="Neighborhood/City where items can be picked up."
            />
          </div>

          {/* Description */}
          <div className="w-full flex flex-col gap-1.5">
            <label
              htmlFor="description-input"
              className="text-sm font-semibold text-gray-700 flex items-center gap-1"
            >
              Description & Condition <span className="text-emerald-600">*</span>
            </label>
            <textarea
              id="description-input"
              required
              rows={4}
              placeholder="Describe condition, sizes, expiry date (for food), or any special handling instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm transition-all duration-150 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              By submitting, you agree to make items available in good faith.
            </span>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={loading}
              className="w-full sm:w-auto"
            >
              Submit Donation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">
          Loading donation form...
        </div>
      }
    >
      <DonateFormContent />
    </Suspense>
  );
}

