
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import PaintColor from "@/models/PaintColor";
import Brand from "@/models/Brand";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function serializeColor(color: any) {
  const brand =
    color?.brand && typeof color.brand === "object" ? color.brand : null;

  return {
    ...color,
    brand: brand?.name ?? "",
    brandId: brand?._id ? String(brand._id) : "",
  };
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: "Admin login required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const allowedFields = [
      "name",
      "code",
      "hex",
      "category",
      "finish",
      "pricePer4L",
      "description",
      "roomImage",
      "wallMaskType",
      "isPopular",
      "isNew",
      "isActive",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field];
      }
    }

    if (Object.prototype.hasOwnProperty.call(body, "brand")) {
      if (typeof body.brand !== "string" || !body.brand.trim()) {
        return NextResponse.json(
          { message: "Select a valid brand." },
          { status: 400 }
        );
      }

      await connectDB();

      const brand = await Brand.findOne({
        normalizedName: body.brand.trim().toLocaleLowerCase("en"),
      }).lean();

      if (!brand) {
        return NextResponse.json(
          { message: "Select a valid brand." },
          { status: 400 }
        );
      }

      updates.brand = brand._id;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json(
        { message: "No valid fields were supplied." },
        { status: 400 }
      );
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      return NextResponse.json(
        { message: "Name cannot be empty." },
        { status: 400 }
      );
    }

    if (
      updates.hex !== undefined &&
      (typeof updates.hex !== "string" ||
        !/^#[0-9a-fA-F]{6}$/.test(updates.hex))
    ) {
      return NextResponse.json(
        { message: "Invalid hex colour." },
        { status: 400 }
      );
    }

    if (
      updates.category !== undefined &&
      !["emulsive", "other"].includes(String(updates.category))
    ) {
      return NextResponse.json(
        { message: "Invalid category." },
        { status: 400 }
      );
    }

    if (updates.pricePer4L !== undefined) {
      const price = Number(updates.pricePer4L);

      if (
        updates.pricePer4L === "" ||
        updates.pricePer4L == null ||
        !Number.isFinite(price) ||
        price < 0
      ) {
        return NextResponse.json(
          { message: "Invalid price." },
          { status: 400 }
        );
      }

      updates.pricePer4L = price;
    }

    await connectDB();

    const updated = await PaintColor.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("brand", "name")
      .lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Colour not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeColor(updated));
  } catch (error) {
    console.error("Failed to update colour:", error);

    return NextResponse.json(
      { message: "Unable to update colour." },
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

    await connectDB();

    const deleted = await PaintColor.findOneAndDelete({ id }).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Colour not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Colour deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete colour:", error);

    return NextResponse.json(
      { message: "Unable to delete colour." },
      { status: 500 }
    );
  }
}
