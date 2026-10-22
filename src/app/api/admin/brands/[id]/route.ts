
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import Brand from "@/models/Brand";
import PaintColor from "@/models/PaintColor";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _request: NextRequest,
  context: Context
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
        { message: "Invalid brand ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const brand = await Brand.findById(id).lean();

    if (!brand) {
      return NextResponse.json(
        { message: "Brand not found." },
        { status: 404 }
      );
    }

    const paintCount = await PaintColor.countDocuments({
      brand: brand._id,
    });

    if (paintCount > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete ${brand.name} because ${paintCount} paint colour(s) still use this brand. Reassign or delete those colours first.`,
        },
        { status: 409 }
      );
    }

    await Brand.deleteOne({ _id: brand._id });

    return NextResponse.json({
      message: "Brand deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete brand:", error);

    return NextResponse.json(
      { message: "Unable to delete brand." },
      { status: 500 }
    );
  }
}
