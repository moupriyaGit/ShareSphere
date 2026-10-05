import React from "react";
import { IDonation } from "@/types";
import {
  Package,
  MapPin,
  Calendar,
  Layers,
  Tag,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface DonationCardProps {
  donation: IDonation;
}

export default function DonationCard({ donation }: DonationCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Food":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Clothes":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "Books":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Blankets":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Stationery":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Listed":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <Clock className="w-3.5 h-3.5 mr-1" />,
        };
      case "Matched":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Layers className="w-3.5 h-3.5 mr-1" />,
        };
      case "Delivered":
      case "Received":
        return {
          bg: "bg-emerald-600 text-white border-transparent",
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Clock className="w-3.5 h-3.5 mr-1" />,
        };
    }
  };

  const statusBadge = getStatusBadge(donation.status || "Listed");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(
              donation.category
            )}`}
          >
            <Tag className="w-3 h-3 mr-1" />
            {donation.category}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg}`}
          >
            {statusBadge.icon}
            {donation.status || "Listed"}
          </span>
        </div>

        {/* Title and details */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition">
          {donation.itemName}
        </h3>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {donation.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2.5 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium text-gray-700">
            <Package className="w-4 h-4 text-emerald-600" />
            Quantity:{" "}
            <strong className="text-gray-900 font-bold">
              {donation.quantity}
            </strong>
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {donation.location}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-400 pt-1">
          <span>By {donation.donorName || "Community Donor"}</span>
          {donation.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(donation.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

