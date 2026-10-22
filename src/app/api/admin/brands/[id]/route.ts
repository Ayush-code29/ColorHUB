
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import Brand from "@/models/Brand";
import PaintColor from "@/models/PaintColor";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

  const session = await mongoose.startSession();

  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid brand ID." },
        { status: 400 }
      );
    }

    await connectDB();

    let deletedBrandName = "";
    let deletedColorsCount = 0;

    await session.withTransaction(async () => {
      const brand = await Brand.findById(id).session(session);

      if (!brand) {
        throw new Error("BRAND_NOT_FOUND");
      }

      deletedBrandName = brand.name;

      // Remove every colour linked to this brand's MongoDB _id.
      const result = await PaintColor.deleteMany(
        { brand: brand._id },
        { session }
      );

      deletedColorsCount = result.deletedCount ?? 0;

      // Delete the brand only after deleting its colours.
      await Brand.deleteOne(
        { _id: brand._id },
        { session }
      );
    });

    return NextResponse.json({
      message: `Brand "${deletedBrandName}" and ${deletedColorsCount} associated colour(s) deleted successfully.`,
      deletedBrandId: id,
      deletedColorsCount,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "BRAND_NOT_FOUND") {
      return NextResponse.json(
        { message: "Brand not found." },
        { status: 404 }
      );
    }

    console.error("Failed to delete brand and its colours:", error);

    return NextResponse.json(
      {
        message:
          "Unable to delete brand and its colours. No partial deletion should be committed if the transaction fails.",
      },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}
