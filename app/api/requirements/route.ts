import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Requirement from "@/models/Requirement";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const ngoId = searchParams.get("ngoId");
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");
    const category = searchParams.get("category");

    const query: Record<string, unknown> = {};
    if (ngoId) query.ngoId = ngoId;
    if (status) query.status = status;
    if (urgency) query.urgency = urgency;
    if (category) query.category = category;

    const requirements = await Requirement.find(query).sort({
      urgency: -1,
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: requirements,
      count: requirements.length,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch requirements";
    console.error("GET /api/requirements error:", error);
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
      ngoId,
      ngoName,
      itemName,
      category,
      quantityNeeded,
      quantityReceived,
      description,
      location,
      urgency,
      status,
    } = body;

    // Validation
    if (
      !itemName ||
      !category ||
      !quantityNeeded ||
      !description ||
      !location
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: itemName, category, quantityNeeded, description, and location are required.",
        },
        { status: 400 }
      );
    }

    if (Number(quantityNeeded) <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity needed must be greater than zero.",
        },
        { status: 400 }
      );
    }

    const newRequirement = await Requirement.create({
      ngoId: ngoId || "community-ngo",
      ngoName: ngoName || "Community Partner NGO",
      itemName: itemName.trim(),
      category,
      quantityNeeded: Number(quantityNeeded),
      quantityReceived: Number(quantityReceived) || 0,
      description: description.trim(),
      location: location.trim(),
      urgency: urgency || "Medium",
      status: status || "Active",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Requirement created successfully! 🎯",
        data: newRequirement,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create requirement";
    console.error("POST /api/requirements error:", error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

