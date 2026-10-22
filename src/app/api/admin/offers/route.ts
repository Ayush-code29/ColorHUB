
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { uploadOfferImage } from "@/lib/cloudinaryOffers";
import Offer from "@/models/Offer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: "Admin login required." },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const offers = await Offer.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      offers.map((offer) => ({
        id: String(offer._id),
        label: offer.label,
        heading: offer.heading,
        description: offer.description,
        imageUrl: offer.imageUrl,
        buttonText: offer.buttonText,
        buttonLink: offer.buttonLink,
        isActive: offer.isActive,
        order: offer.order,
        createdAt: offer.createdAt,
      }))
    );
  } catch (error) {
    console.error("Admin offers GET failed:", error);

    return NextResponse.json(
      { message: "Unable to load offers." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: "Admin login required." },
      { status: 401 }
    );
  }

  let uploadedPublicId: string | undefined;

  try {
    const form = await request.formData();

    const image = form.get("image");
    const label = String(form.get("label") || "").trim();
    const heading = String(form.get("heading") || "").trim();
    const description = String(
      form.get("description") || ""
    ).trim();
    const buttonText = String(
      form.get("buttonText") || ""
    ).trim();
    const buttonLink = String(
      form.get("buttonLink") || ""
    ).trim();
    const orderValue = Number(form.get("order") || 0);
    const isActive = form.get("isActive") !== "false";

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { message: "Please select an offer image." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (
      !image.type.startsWith("image/") ||
      !allowedTypes.includes(image.type)
    ) {
      return NextResponse.json(
        { message: "Upload a JPG, PNG, WEBP, or AVIF image." },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    if (
      !label ||
      label.length > 60 ||
      !heading ||
      heading.length > 140 ||
      !description ||
      description.length > 400 ||
      !buttonText ||
      buttonText.length > 40 ||
      !buttonLink ||
      buttonLink.length > 500
    ) {
      return NextResponse.json(
        {
          message:
            "Complete all offer fields within their allowed lengths.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(orderValue)) {
      return NextResponse.json(
        { message: "Display order must be a valid number." },
        { status: 400 }
      );
    }

    const uploaded = await uploadOfferImage(image);
    uploadedPublicId = uploaded.imagePublicId;

    await connectDB();

    const offer = await Offer.create({
      ...uploaded,
      label,
      heading,
      description,
      buttonText,
      buttonLink,
      isActive,
      order: orderValue,
    });

    return NextResponse.json(
      {
        id: String(offer._id),
        label: offer.label,
        heading: offer.heading,
        description: offer.description,
        imageUrl: offer.imageUrl,
        buttonText: offer.buttonText,
        buttonLink: offer.buttonLink,
        isActive: offer.isActive,
        order: offer.order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin offer POST failed:", error);

    if (uploadedPublicId) {
      try {
        const { deleteCloudinaryImage } = await import(
          "@/lib/cloudinaryOffers"
        );

        await deleteCloudinaryImage(uploadedPublicId);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded offer image:",
          cleanupError
        );
      }
    }

    const message =
      error instanceof Error &&
      error.message.includes("Cloudinary")
        ? error.message
        : "Unable to create offer.";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
