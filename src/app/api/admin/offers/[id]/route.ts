
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { deleteCloudinaryImage } from "@/lib/cloudinaryOffers";
import Offer from "@/models/Offer";

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
        { message: "Invalid offer ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const offer = await Offer.findById(id);

    if (!offer) {
      return NextResponse.json(
        { message: "Offer not found." },
        { status: 404 }
      );
    }

    await Offer.deleteOne({ _id: offer._id });

    try {
      await deleteCloudinaryImage(offer.imagePublicId);
    } catch (cloudinaryError) {
      console.error(
        "Offer deleted from MongoDB, but Cloudinary cleanup failed:",
        cloudinaryError
      );

      return NextResponse.json({
        message:
          "Offer deleted, but its Cloudinary image could not be removed. Check server logs.",
        cloudinaryCleanupFailed: true,
      });
    }

    return NextResponse.json({
      message: "Offer deleted successfully.",
    });
  } catch (error) {
    console.error("Admin offer DELETE failed:", error);

    return NextResponse.json(
      { message: "Unable to delete offer." },
      { status: 500 }
    );
  }
}
