import mongoose, { Schema, Model } from "mongoose";
import { IRequirement } from "@/types";

const RequirementSchema = new Schema<IRequirement>(
  {
    ngoId: {
      type: String,
      default: "",
    },
    ngoName: {
      type: String,
      default: "Community NGO",
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
    quantityNeeded: {
      type: Number,
      required: [true, "Quantity needed is required"],
      min: [1, "Quantity needed must be at least 1"],
    },
    quantityReceived: {
      type: Number,
      default: 0,
      min: 0,
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
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Active", "Fulfilled", "Cancelled"],
      default: "Active",
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

const Requirement: Model<IRequirement> =
  mongoose.models.Requirement ||
  mongoose.model<IRequirement>("Requirement", RequirementSchema);

export default Requirement;

