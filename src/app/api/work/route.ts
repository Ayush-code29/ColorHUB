
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Work from "@/models/Work";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const items = await Work.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const result = items.map((item) => ({
      id: String(item._id),
      title: item.title,
      colorName: item.colorName,
      category: item.category,
      brandName: item.brandName,
      imageUrl: item.imageUrl,
      order: item.order,
    }));

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Public Our Work API error:", error);

    return NextResponse.json(
      { message: "Unable to load Our Work gallery." },
      { status: 500 }
    );
  }
}
