import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import { ensureDefaultHeroSlides } from "@/lib/seedHeroSlides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    await ensureDefaultHeroSlides();

    const slides = await HeroSlide.find({
      isActive: true,
    })
      .sort({ order: 1, createdAt: 1 })
      .select(
        "title subtitle imageUrl accentShade accentHex order"
      )
      .lean();

    return NextResponse.json(
      slides.map((slide) => ({
        id: String(slide._id),
        title: slide.title,
        subtitle: slide.subtitle,
        image: slide.imageUrl,
        accentShade: slide.accentShade,
        accentHex: slide.accentHex,
        order: slide.order,
      })),
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Hero slides GET failed:", error);

    return NextResponse.json(
      { message: "Unable to load homepage images." },
      { status: 500 }
    );
  }
}