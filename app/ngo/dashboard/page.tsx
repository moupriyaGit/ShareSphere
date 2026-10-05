"use client";

import React, { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { IRequirement, DonationCategory, RequirementUrgency } from "@/types";
import {
  Building2,
  PlusCircle,
  RefreshCw,
  Target,
  CheckCircle2,
  PackageCheck,
  AlertCircle,
  Inbox,
  X,
  MapPin,
  Tag,
} from "lucide-react";

const CATEGORIES: DonationCategory[] = [
  "Food",
  "Clothes",
  "Books",
  "Stationery",
  "Blankets",
  "Essentials",
  "Other",
];

const URGENCIES: RequirementUrgency[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export default function NgoDashboard() {
  const [requirements, setRequirements] = useState<IRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Requirement Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [ngoName, setNgoName] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<DonationCategory>("Clothes");
  const [quantityNeeded, setQuantityNeeded] = useState<number | string>(50);
  const [quantityReceived, setQuantityReceived] = useState<number | string>(0);
  const [urgency, setUrgency] = useState<RequirementUrgency>("High");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

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
      const msg =
        err instanceof Error ? err.message : "Error connecting to database.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();

    // Check logged in user
    const stored = localStorage.getItem("sharesphere_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u && u.name) setNgoName(u.name);
      } catch {
        // ignore
      }
    }
  }, []);

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      let ngoId = "";
      const stored = localStorage.getItem("sharesphere_user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (u && u._id) ngoId = u._id;
        } catch {
          // ignore
        }
      }

      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ngoId,
          ngoName: ngoName.trim() || "Community Partner NGO",
          itemName: itemName.trim(),
          category,
          quantityNeeded: Number(quantityNeeded),
          quantityReceived: Number(quantityReceived) || 0,
          urgency,
          location: location.trim(),
          description: description.trim(),
          status: "Active",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create requirement.");
      }

      // Success
      setFormSuccess("Requirement created successfully! 🎯");
      // Reset form
      setItemName("");
      setQuantityNeeded(50);
      setQuantityReceived(0);
      setDescription("");
      setLocation("");
      setIsModalOpen(false);

      // Refresh list
      fetchRequirements();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics
  const activeRequirements = requirements.filter(
    (r) => r.status === "Active"
  ).length;

  const totalReceived = requirements.reduce(
    (acc, curr) => acc + (curr.quantityReceived || 0),
    0
  );

  const fulfilledCount = requirements.filter(
    (r) =>
      r.status === "Fulfilled" ||
      (r.quantityReceived >= r.quantityNeeded && r.quantityNeeded > 0)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950">
            NGO Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your organization&apos;s urgent item requirements and track
            donation fulfillments.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          size="md"
          className="self-start sm:self-auto flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Requirement
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label="Active Requirements"
          value={activeRequirements}
          description="Needs currently open for community donations"
          icon={<Target className="w-6 h-6" />}
          variant="emerald"
        />
        <StatsCard
          label="Donations Received"
          value={totalReceived}
          description="Total item units received across all needs"
          icon={<PackageCheck className="w-6 h-6" />}
          variant="amber"
        />
        <StatsCard
          label="Requirements Fulfilled"
          value={fulfilledCount}
          description="Target goals completely fulfilled"
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="cream"
        />
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Requirements Overview
          </h2>
          <button
            onClick={fetchRequirements}
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
              Loading NGO requirements...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto my-8">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-800">{error}</p>
            <button
              onClick={fetchRequirements}
              className="mt-4 px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : requirements.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs my-6">
            <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-emerald-700 mx-auto mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No requirements created yet
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Publish your first requirement so donors in the community know
              exactly what supplies are needed.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Create Requirement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req) => {
              const needed = req.quantityNeeded || 1;
              const received = req.quantityReceived || 0;
              const pct = Math.min(Math.round((received / needed) * 100), 100);

              const isUrgent =
                req.urgency === "Critical" || req.urgency === "High";

              return (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <Tag className="w-3 h-3 mr-1 text-emerald-600" />
                        {req.category}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isUrgent
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        Urgency: {req.urgency}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">
                      {req.itemName}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{req.ngoName || "Partner NGO"}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{req.location}</span>
                    </div>

                    <p className="mt-3 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {req.description}
                    </p>
                  </div>

                  {/* Progress Info */}
                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700">
                        {received} / {needed} received
                      </span>
                      <span className="font-bold text-emerald-700">
                        {pct}% fulfilled
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Requirement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800">
                New NGO Listing
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create New Requirement
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Post an item need that community donors can view and fulfill.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRequirement} className="space-y-4">
              <FormInput
                label="Organization / NGO Name"
                placeholder="e.g. Hope Community Centre"
                required
                value={ngoName}
                onChange={(e) => setNgoName(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Item Name Needed"
                  placeholder="e.g. Winter Clothes, Notebooks"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />

                <div className="w-full flex flex-col gap-1.5">
                  <label
                    htmlFor="ngo-category-select"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                  >
                    Category <span className="text-emerald-600">*</span>
                  </label>
                  <select
                    id="ngo-category-select"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as DonationCategory)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput
                  label="Quantity Needed"
                  type="number"
                  min={1}
                  required
                  value={quantityNeeded}
                  onChange={(e) => setQuantityNeeded(e.target.value)}
                />

                <FormInput
                  label="Already Received"
                  type="number"
                  min={0}
                  value={quantityReceived}
                  onChange={(e) => setQuantityReceived(e.target.value)}
                />

                <div className="w-full flex flex-col gap-1.5">
                  <label
                    htmlFor="ngo-urgency-select"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                  >
                    Urgency <span className="text-emerald-600">*</span>
                  </label>
                  <select
                    id="ngo-urgency-select"
                    value={urgency}
                    onChange={(e) =>
                      setUrgency(e.target.value as RequirementUrgency)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600"
                  >
                    {URGENCIES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <FormInput
                label="Delivery / Centre Location"
                placeholder="e.g. Sector 14, Gurugram or NGO Center Address"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <div className="w-full flex flex-col gap-1.5">
                <label
                  htmlFor="ngo-description-input"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                >
                  Description & Context <span className="text-emerald-600">*</span>
                </label>
                <textarea
                  id="ngo-description-input"
                  required
                  rows={3}
                  placeholder="Explain why these items are needed and who they will benefit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Button type="submit" size="md" isLoading={submitting}>
                  Publish Requirement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

