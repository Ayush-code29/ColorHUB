
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import Work from "@/models/Work";
import {
  deleteWorkImage,
  uploadWorkImage,
} from "@/lib/cloudinaryWork";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const categories = [
  "emulsion",
  "enamel",
  "distemper",
  "acrylic",
  "cement",
];

function serialize(item: any) {
  return {
    id: String(item._id),
    title: item.title,
    colorName: item.colorName,
    category: item.category,
    brandName: item.brandName,
    imageUrl: item.imageUrl,
    imagePublicId: item.imagePublicId || "",
    isActive: item.isActive,
    order: item.order,
  };
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: "Admin login required." },
      { status: 401 }
    );
  }

  let newPublicId = "";

  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid gallery item ID." },
        { status: 400 }
      );
    }

    const form = await request.formData();

    const title = String(form.get("title") || "").trim();
    const colorName = String(form.get("colorName") || "").trim();
    const category = String(form.get("category") || "");
    const brandName = String(form.get("brandName") || "").trim();
    const order = Number(form.get("order") || 0);
    const isActive = form.get("isActive") !== "false";
    const image = form.get("image");

    if (
      !title ||
      !colorName ||
      !brandName ||
      !categories.includes(category) ||
      !Number.isFinite(order)
    ) {
      return NextResponse.json(
        { message: "Please fill all fields with valid values." },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await Work.findById(id);

    if (!item) {
      return NextResponse.json(
        { message: "Gallery item not found." },
        { status: 404 }
      );
    }

    let uploaded: {
      imageUrl: string;
      imagePublicId: string;
    } | null = null;

    if (image instanceof File && image.size > 0) {
      if (
        !/^image\/(jpeg|png|webp|avif)$/.test(image.type) ||
        image.size > 5 * 1024 * 1024
      ) {
        return NextResponse.json(
          { message: "Use JPG, PNG, WEBP or AVIF up to 5 MB." },
          { status: 400 }
        );
      }

      uploaded = await uploadWorkImage(image);
      newPublicId = uploaded.imagePublicId;
    }

    const oldPublicId = item.imagePublicId || "";

    item.title = title;
    item.colorName = colorName;
    item.category = category;
    item.brandName = brandName;
    item.order = order;
    item.isActive = isActive;

    if (uploaded) {
      item.imageUrl = uploaded.imageUrl;
      item.imagePublicId = uploaded.imagePublicId;
    }

    await item.save();

    if (uploaded && oldPublicId) {
      try {
        await deleteWorkImage(oldPublicId);
      } catch (cleanupError) {
        // The record has been updated; log cleanup failures for later review.
        console.error("Old image cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(serialize(item.toObject()));
  } catch (error) {
    console.error("Admin Our Work PATCH error:", error);

    if (newPublicId) {
      try {
        await deleteWorkImage(newPublicId);
      } catch (cleanupError) {
        console.error("New image cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update gallery item.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: "Admin login required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid gallery item ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await Work.findById(id);

    if (!item) {
      return NextResponse.json(
        { message: "Gallery item not found." },
        { status: 404 }
      );
    }

    await Work.deleteOne({ _id: item._id });

    if (item.imagePublicId) {
      try {
        await deleteWorkImage(item.imagePublicId);
      } catch (cleanupError) {
        console.error(
          "Gallery item deleted but Cloudinary cleanup failed:",
          cleanupError
        );
      }
    }

    return NextResponse.json({ message: "Gallery item deleted." });
  } catch (error) {
    console.error("Admin Our Work DELETE error:", error);

    return NextResponse.json(
      { message: "Unable to delete gallery item." },
      { status: 500 }
    );
  }
}
