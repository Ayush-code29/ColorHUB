
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import PaintColor from "@/models/PaintColor";
import { INITIAL_COLORS } from "@/data/initialData";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    let colors = await PaintColor.find()
      .sort({ createdAt: -1 })
      .lean();

    if (colors.length === 0) {
      await PaintColor.insertMany(INITIAL_COLORS);
      colors = await PaintColor.find()
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json(colors);
  } catch (error) {
    console.error("Failed to fetch colours:", error);

    return NextResponse.json(
      { message: "Unable to load the colour catalogue." },
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

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const code =
      typeof body.code === "string" ? body.code.trim() : "";

    const hex =
      typeof body.hex === "string" ? body.hex : "";

    const price = Number(body.pricePer4L);

    if (!name || !code || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
      return NextResponse.json(
        { message: "Valid name, code, and hex colour are required." },
        { status: 400 }
      );
    }

    if (
      body.pricePer4L === "" ||
      body.pricePer4L === null ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        { message: "Enter a valid non-negative price." },
        { status: 400 }
      );
    }

    const brand = body.brand;
    const category = body.category;
    const finish = body.finish;

    if (
      ![
        "Asian Paints",
        "Berger",
        "Dulux",
        "Nerolac",
        "JSW",
        "Indigo",
        "Other",
      ].includes(brand) ||
      !["Interior", "Exterior", "Wall", "Wood", "Metal", "Texture"].includes(
        category
      ) ||
      !["Matte", "Satin", "Gloss", "Texture", "Eggshell"].includes(
        finish
      )
    ) {
      return NextResponse.json(
        { message: "Invalid brand, category, or finish." },
        { status: 400 }
      );
    }

    await connectDB();

    const id =
      `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-` +
      randomUUID().slice(0, 8);

    const created = await PaintColor.create({
      id,
      name,
      code,
      brand,
      hex,
      category,
      finish,
      pricePer4L: price,
      description:
        typeof body.description === "string" ? body.description.trim() : "",
      roomImage:
        typeof body.roomImage === "string" ? body.roomImage.trim() : "",
      wallMaskType: body.wallMaskType,
      isPopular: body.isPopular === true,
      isNew: body.isNew === true,
      isActive: body.isActive !== false,
      rating: 5,
      reviewsCount: 0,
    });

    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (error) {
    console.error("Failed to create colour:", error);

    return NextResponse.json(
      { message: "Unable to add colour. Please check the submitted data." },
      { status: 500 }
    );
  }
}
