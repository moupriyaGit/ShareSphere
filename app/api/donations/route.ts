import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const donorId = searchParams.get("donorId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const query: Record<string, unknown> = {};
    if (donorId) query.donorId = donorId;
    if (status) query.status = status;
    if (category) query.category = category;

    const donations = await Donation.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: donations,
      count: donations.length,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch donations";
    console.error("GET /api/donations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      donorId,
      donorName,
      itemName,
      category,
      quantity,
      description,
      location,
      status,
    } = body;

    // Validation
    if (!itemName || !category || !quantity || !description || !location) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: itemName, category, quantity, description, and location are required.",
        },
        { status: 400 }
      );
    }

    if (Number(quantity) <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity must be greater than zero.",
        },
        { status: 400 }
      );
    }

    const newDonation = await Donation.create({
      donorId: donorId || "anonymous",
      donorName: donorName || "Anonymous Donor",
      itemName: itemName.trim(),
      category,
      quantity: Number(quantity),
      description: description.trim(),
      location: location.trim(),
      status: status || "Listed",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Donation submitted successfully! 🎉",
        data: newDonation,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create donation";
    console.error("POST /api/donations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

