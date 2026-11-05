import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  deleteHeroImage,
  uploadHeroImage,
} from "@/lib/cloudinaryHero";
import HeroSlide from "@/models/HeroSlide";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

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

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  let newPublicId = "";

  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { message: "Admin login required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid hero image ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const slide = await HeroSlide.findById(id);

    if (!slide) {
      return NextResponse.json(
        { message: "Hero image not found." },
        { status: 404 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // Visibility-only JSON request
    if (contentType.includes("application/json")) {
      const body = await request.json();

      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { message: "Invalid visibility value." },
          { status: 400 }
        );
      }

      slide.isActive = body.isActive;
      await slide.save();

      return NextResponse.json({
        message: "Hero image visibility updated.",
        slide: serializeSlide(slide),
        isActive: slide.isActive,
      });
    }

    // Edit form-data request
    const form = await request.formData();

    const title = String(form.get("title") ?? slide.title).trim();
    const subtitle = String(
      form.get("subtitle") ?? slide.subtitle
    ).trim();
    const accentShade = String(
      form.get("accentShade") ?? slide.accentShade
    ).trim();
    const accentHex = String(
      form.get("accentHex") ?? slide.accentHex
    ).trim();
    const order = Number(form.get("order") ?? slide.order);

    const activeValue = form.get("isActive");
    const isActive =
      activeValue === null
        ? slide.isActive
        : activeValue === "true";

    const imageValue = form.get("image");
    const image =
      imageValue instanceof File && imageValue.size > 0
        ? imageValue
        : null;

    if (!title || title.length > 140 || subtitle.length > 400) {
      return NextResponse.json(
        { message: "Please enter a valid heading and subtitle." },
        { status: 400 }
      );
    }

    if (accentShade.length > 80) {
      return NextResponse.json(
        { message: "Featured shade must be 80 characters or less." },
        { status: 400 }
      );
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(accentHex)) {
      return NextResponse.json(
        { message: "Invalid accent colour." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(order) || order < 0) {
      return NextResponse.json(
        { message: "Display order must be a non-negative integer." },
        { status: 400 }
      );
    }

    if (image) {
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
    }

    const oldPublicId = slide.imagePublicId || "";

    if (image) {
      const uploaded = await uploadHeroImage(image);

      newPublicId = uploaded.imagePublicId;
      slide.imageUrl = uploaded.imageUrl;
      slide.imagePublicId = uploaded.imagePublicId;
      slide.source = "upload";
      slide.defaultKey = null;
    }

    slide.title = title;
    slide.subtitle = subtitle;
    slide.accentShade = accentShade;
    slide.accentHex = accentHex;
    slide.order = order;
    slide.isActive = isActive;

    await slide.save();

    // Delete old Cloudinary image only after successful DB save.
    if (image && oldPublicId) {
      try {
        await deleteHeroImage(oldPublicId);
      } catch (error) {
        console.error("Old Cloudinary image cleanup failed:", error);
      }
    }

    newPublicId = "";

    return NextResponse.json({
      message: "Hero image updated successfully.",
      slide: serializeSlide(slide),
      isActive: slide.isActive,
    });
  } catch (error) {
    console.error("Hero image PATCH failed:", error);

    if (newPublicId) {
      try {
        await deleteHeroImage(newPublicId);
      } catch (cleanupError) {
        console.error("New image cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update hero image.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: Context
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { message: "Admin login required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid hero image ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const slide = await HeroSlide.findById(id);

    if (!slide) {
      return NextResponse.json(
        { message: "Hero image not found." },
        { status: 404 }
      );
    }

    const publicId = slide.imagePublicId || "";

    await HeroSlide.deleteOne({ _id: slide._id });

    if (publicId) {
      try {
        await deleteHeroImage(publicId);
      } catch (error) {
        console.error("Cloudinary cleanup failed:", error);

        return NextResponse.json({
          message:
            "Image removed from the website, but Cloudinary cleanup failed.",
        });
      }
    }

    return NextResponse.json({
      message: "Hero image deleted successfully.",
    });
  } catch (error) {
    console.error("Hero image DELETE failed:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete hero image.",
      },
      { status: 500 }
    );
  }
}