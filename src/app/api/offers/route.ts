
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Offer from "@/models/Offer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const offers = await Offer.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select(
        "label heading description imageUrl buttonText buttonLink order"
      )
      .lean();

    return NextResponse.json(
      offers.map((offer) => ({
        id: String(offer._id),
        label: offer.label,
        heading: offer.heading,
        description: offer.description,
        imageUrl: offer.imageUrl,
        buttonText: offer.buttonText,
        buttonLink: offer.buttonLink,
        order: offer.order,
      })),
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Public offers GET failed:", error);

    return NextResponse.json(
      { message: "Unable to load offers." },
      { status: 500 }
    );
  }
}
