import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Donation from "@/models/Donation";
import Requirement from "@/models/Requirement";

export async function GET() {
  try {
    await connectToDatabase();

    const existingUsers = await User.countDocuments();
    const existingDonations = await Donation.countDocuments();
    const existingRequirements = await Requirement.countDocuments();

    if (existingRequirements === 0) {
      await Requirement.insertMany([
        {
          ngoId: "hope-centre-01",
          ngoName: "Hope Community Centre",
          itemName: "Winter Clothes & Thermal Sweaters",
          category: "Clothes",
          quantityNeeded: 50,
          quantityReceived: 30,
          description:
            "Warm woolens, jackets, and thermal wear needed for elderly residents and children living in temporary shelters ahead of winter.",
          location: "Indiranagar, Bengaluru",
          urgency: "High",
          status: "Active",
        },
        {
          ngoId: "vidya-trust-02",
          ngoName: "Vidya Jyoti Education Trust",
          itemName: "School Notebooks & Geometry Sets",
          category: "Stationery",
          quantityNeeded: 120,
          quantityReceived: 45,
          description:
            "Ruled notebooks, pens, pencils, and basic geometry sets for underprivileged 5th-8th grade school students.",
          location: "Sector 14, Gurugram",
          urgency: "Medium",
          status: "Active",
        },
        {
          ngoId: "annapurna-03",
          ngoName: "Annapurna Relief Kitchen",
          itemName: "Dry Rations (Rice, Dal, Cooking Oil)",
          category: "Food",
          quantityNeeded: 200,
          quantityReceived: 80,
          description:
            "Unopened packets of grains, pulses, and oil to prepare hot community meals for daily wage worker families.",
          location: "Dharavi, Mumbai",
          urgency: "Critical",
          status: "Active",
        },
        {
          ngoId: "literacy-hub-04",
          ngoName: "Community Literacy Project",
          itemName: "Children Storybooks & Encyclopedias",
          category: "Books",
          quantityNeeded: 80,
          quantityReceived: 65,
          description:
            "Gently used English & regional language illustrated storybooks for a free public reading room.",
          location: "Alwarpet, Chennai",
          urgency: "Low",
          status: "Active",
        },
        {
          ngoId: "shelter-care-05",
          ngoName: "Safe Shelter Foundation",
          itemName: "Thick Fleece Blankets",
          category: "Blankets",
          quantityNeeded: 100,
          quantityReceived: 20,
          description:
            "Durable winter blankets for night shelter occupants and street dwellers.",
          location: "Kashmere Gate, Old Delhi",
          urgency: "Critical",
          status: "Active",
        },
      ]);
    }

    if (existingDonations === 0) {
      await Donation.insertMany([
        {
          donorName: "Ananya Roy",
          itemName: "Adult Winter Jackets (Size M/L)",
          category: "Clothes",
          quantity: 15,
          description:
            "Clean, sanitized, and neatly packed insulated winter jackets in excellent condition.",
          location: "Koramangala, Bengaluru",
          status: "Listed",
        },
        {
          donorName: "Vikas Mehra",
          itemName: "Unused Spiral Notebooks & Pens",
          category: "Stationery",
          quantity: 40,
          description:
            "Unused 200-page notebook sets and blue ballpoint pen packets.",
          location: "Cyber City, Gurugram",
          status: "Listed",
        },
        {
          donorName: "Pooja & Friends",
          itemName: "Sealed Basmati Rice & Lentils (10kg packs)",
          category: "Food",
          quantity: 25,
          description:
            "Fresh pantry surplus, factory sealed with 8+ months before expiry.",
          location: "Andheri West, Mumbai",
          status: "Listed",
        },
      ]);
    }

    if (existingUsers === 0) {
      await User.create([
        {
          name: "Hope Community Centre",
          email: "ngo@hopecentre.org",
          password: "password123",
          role: "ngo",
        },
        {
          name: "Rahul Verma",
          email: "donor@example.com",
          password: "password123",
          role: "donor",
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Database checked and seeded with sample data if empty! 🌱",
      stats: {
        users: await User.countDocuments(),
        donations: await Donation.countDocuments(),
        requirements: await Requirement.countDocuments(),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Seeding failed";
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}

