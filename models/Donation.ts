import mongoose, { Schema, Model } from "mongoose";
import { IDonation } from "@/types";

const DonationSchema = new Schema<IDonation>(
  {
    donorId: {
      type: String,
      default: "",
    },
    donorName: {
      type: String,
      default: "Anonymous Donor",
      trim: true,
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Clothes",
        "Books",
        "Stationery",
        "Blankets",
        "Essentials",
        "Other",
      ],
      required: [true, "Category is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "Listed",
        "Matched",
        "Accepted",
        "Picked Up",
        "Delivered",
        "Received",
      ],
      default: "Listed",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const Donation: Model<IDonation> =
  mongoose.models.Donation ||
  mongoose.model<IDonation>("Donation", DonationSchema);

export default Donation;

