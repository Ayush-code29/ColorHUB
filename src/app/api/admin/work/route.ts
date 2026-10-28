
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import Work from "@/models/Work";
import { uploadWorkImage } from "@/lib/cloudinaryWork";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const categories = [
  "emulsion",
  "enamel",
  "distemper",
  "acrylic",
  "cement",
] as const;

const demoProjects = [
  {
    title: "Warm & Welcoming",
    colorName: "Sandstone Beige",
    category: "emulsion",
    brandName: "Asian Paints",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    order: 1,
  },
  {
    title: "Modern Calm",
    colorName: "Sage Whisper",
    category: "emulsion",
    brandName: "Birla Opus",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    order: 2,
  },
  {
    title: "Elegant Living",
    colorName: "Ivory Mist",
    category: "acrylic",
    brandName: "Asian Paints",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
    order: 3,
  },
  {
    title: "Earthy Retreat",
    colorName: "Terracotta Glow",
    category: "distemper",
    brandName: "Birla Opus",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
    order: 4,
  },
  {
    title: "Contemporary Luxe",
    colorName: "Stone Grey",
    category: "enamel",
    brandName: "Asian Paints",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85",
    order: 5,
  },
  {
    title: "Fresh Perspective",
    colorName: "Olive Haze",
    category: "cement",
    brandName: "Birla Opus",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    order: 6,
  },
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

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: "Admin login required." },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    if ((await Work.countDocuments()) === 0) {
      await Work.insertMany(
        demoProjects.map((project) => ({
          ...project,
          imagePublicId: "",
          isActive: true,
        }))
      );
    }

    const items = await Work.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(items.map(serialize), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Admin Our Work GET error:", error);

    return NextResponse.json(
      { message: "Unable to load gallery items." },
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

  let uploadedPublicId = "";

  try {
    const form = await request.formData();

    const image = form.get("image");
    const title = String(form.get("title") || "").trim();
    const colorName = String(form.get("colorName") || "").trim();
    const category = String(form.get("category") || "");
    const brandName = String(form.get("brandName") || "").trim();
    const order = Number(form.get("order") || 0);
    const isActive = form.get("isActive") !== "false";

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { message: "Please select a project image." },
        { status: 400 }
      );
    }

    if (
      !/^image\/(jpeg|png|webp|avif)$/.test(image.type) ||
      image.size > 5 * 1024 * 1024
    ) {
      return NextResponse.json(
        { message: "Use JPG, PNG, WEBP or AVIF up to 5 MB." },
        { status: 400 }
      );
    }

    if (
      !title ||
      !colorName ||
      !brandName ||
      !categories.includes(category as (typeof categories)[number]) ||
      !Number.isFinite(order)
    ) {
      return NextResponse.json(
        { message: "Please fill all fields with valid values." },
        { status: 400 }
      );
    }

    const uploaded = await uploadWorkImage(image);
    uploadedPublicId = uploaded.imagePublicId;

    await connectDB();

    const item = await Work.create({
      title,
      colorName,
      category,
      brandName,
      order,
      isActive,
      ...uploaded,
    });

    return NextResponse.json(serialize(item.toObject()), {
      status: 201,
    });
  } catch (error) {
    console.error("Admin Our Work POST error:", error);

    if (uploadedPublicId) {
      try {
        const { deleteWorkImage } = await import("@/lib/cloudinaryWork");
        await deleteWorkImage(uploadedPublicId);
      } catch (cleanupError) {
        console.error("Uploaded image cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to add gallery item.",
      },
      { status: 500 }
    );
  }
}
