
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import PaintColor from "@/models/PaintColor";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
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
    const body = await request.json();

    const allowedFields = [
      "name",
      "code",
      "brand",
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

    if (Object.keys(updates).length === 0) {
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

    if (updates.pricePer4L !== undefined) {
      const price = Number(updates.pricePer4L);

      if (
        updates.pricePer4L === "" ||
        updates.pricePer4L === null ||
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
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Colour not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
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
