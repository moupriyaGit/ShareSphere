"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IRequirement } from "@/types";
import {
  AlertTriangle,
  Building2,
  MapPin,
  Tag,
  CheckCircle,
  ArrowRight,
  Info,
  X,
} from "lucide-react";

interface RequirementCardProps {
  requirement: IRequirement;
}

export default function RequirementCard({ requirement }: RequirementCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const needed = requirement.quantityNeeded || 1;
  const received = requirement.quantityReceived || 0;
  const percentage = Math.min(Math.round((received / needed) * 100), 100);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return {
          bg: "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-400/30",
          dot: "bg-red-500 animate-pulse",
          label: "Critical Urgency",
        };
      case "High":
        return {
          bg: "bg-orange-50 text-orange-700 border-orange-200",
          dot: "bg-orange-500",
          label: "High Urgency",
        };
      case "Medium":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          label: "Medium",
        };
      default:
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          label: "Low Urgency",
        };
    }
  };

  const urgencyBadge = getUrgencyBadge(requirement.urgency || "Medium");

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        <div>
          {/* Top row: Category and Urgency */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Tag className="w-3 h-3 mr-1 text-emerald-600" />
              {requirement.category}
            </span>

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${urgencyBadge.bg}`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${urgencyBadge.dot}`}
              ></span>
              {urgencyBadge.label}
            </span>
          </div>

          {/* Item Name */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition">
            {requirement.itemName}
          </h3>

          {/* NGO & Location */}
          <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 font-medium text-gray-700">
              <Building2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">
                {requirement.ngoName || "Community Partner NGO"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{requirement.location}</span>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {requirement.description}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-gray-700 font-semibold">
              {received} / {needed} received
            </span>
            <span className="text-emerald-700 font-bold">{percentage}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                percentage >= 100
                  ? "bg-emerald-600"
                  : percentage > 50
                  ? "bg-emerald-500"
                  : "bg-emerald-400"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {/* View Need Button */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 text-xs font-bold hover:bg-emerald-50 transition flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              View Need
            </button>
            <Link
              href={`/donate?category=${encodeURIComponent(
                requirement.category
              )}&item=${encodeURIComponent(requirement.itemName)}`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200"
            >
              Donate Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Dialog for View Need */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                {requirement.category}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${urgencyBadge.bg}`}
              >
                {urgencyBadge.label}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              {requirement.itemName}
            </h2>

            <div className="mt-4 p-4 rounded-2xl bg-cream-100 border border-cream-300/40 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-gray-900">
                  {requirement.ngoName || "Community Partner NGO"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{requirement.location}</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400">
                About this requirement
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {requirement.description}
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-gray-600">
                  Requirement Goal: {needed} units
                </span>
                <span className="text-emerald-700">
                  {received} received ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <Link
                href={`/donate?category=${encodeURIComponent(
                  requirement.category
                )}&item=${encodeURIComponent(requirement.itemName)}`}
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-200 flex items-center gap-2"
              >
                Donate Items
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

