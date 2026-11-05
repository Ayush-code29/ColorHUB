import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  uploadHeroImage,
  deleteHeroImage,
} from "@/lib/cloudinaryHero";
import HeroSlide from "@/models/HeroSlide";
import { ensureDefaultHeroSlides } from "@/lib/seedHeroSlides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

function serializeSlide(slide: any) {
  return {
    id: String(slide._id),
    title: slide.title,
    subtitle: slide.subtitle,
    imageUrl: slide.imageUrl,
    accentShade: slide.accentShade,
    accentHex: slide.accentHex,
    isActive: slide.isActive,
    order: slide.order,
    source: slide.source || "upload",
  };
}

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { message: "Admin login required." },
        { status: 401 }
      );
    }

    await connectDB();
    await ensureDefaultHeroSlides();

    const slides = await HeroSlide.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json(slides.map(serializeSlide), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Admin hero GET failed:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load hero images.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let uploadedPublicId = "";

  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { message: "Admin login required. Please login again." },
        { status: 401 }
      );
    }

    await connectDB();
    await ensureDefaultHeroSlides();

    const form = await request.formData();

    const image = form.get("image");
    const title = String(form.get("title") || "").trim();
    const subtitle = String(form.get("subtitle") || "").trim();
    const accentShade = String(form.get("accentShade") || "").trim();
    const accentHex = String(form.get("accentHex") || "#B58A45").trim();
    const order = Number(form.get("order") || 0);
    const isActive = form.get("isActive") !== "false";

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { message: "Please select a hero image." },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { message: "Upload a JPG, PNG, WEBP or AVIF image." },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image size must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    if (!title || title.length > 140) {
      return NextResponse.json(
        { message: "Please enter a valid heading (maximum 140 characters)." },
        { status: 400 }
      );
    }

    if (subtitle.length > 400 || accentShade.length > 80) {
      return NextResponse.json(
        { message: "Subtitle or featured shade is too long." },
        { status: 400 }
      );
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(accentHex)) {
      return NextResponse.json(
        { message: "Please provide a valid accent colour." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(order) || order < 0) {
      return NextResponse.json(
        { message: "Display order must be a non-negative integer." },
        { status: 400 }
      );
    }

    const uploaded = await uploadHeroImage(image);
    uploadedPublicId = uploaded.imagePublicId;

    const slide = await HeroSlide.create({
      title,
      subtitle,
      imageUrl: uploaded.imageUrl,
      imagePublicId: uploaded.imagePublicId,
      accentShade,
      accentHex,
      order,
      isActive,
      source: "upload",
      defaultKey: null,
    });

    return NextResponse.json(
      {
        message: "Hero image uploaded successfully.",
        slide: serializeSlide(slide),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin hero POST failed:", error);

    if (uploadedPublicId) {
      try {
        await deleteHeroImage(uploadedPublicId);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to add hero image.",
      },
      { status: 500 }
    );
  }
}