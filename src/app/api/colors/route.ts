
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import PaintColor from "@/models/PaintColor";
import Brand from "@/models/Brand";
import { INITIAL_COLORS } from "@/data/initialData";
import { ensureDefaultBrands } from "@/lib/brandHelpers";

export const runtime = "nodejs";

async function migrateLegacyColors() {
  const asian = await Brand.findOne({
    normalizedName: "asian paints",
  }).lean();

  const birla = await Brand.findOne({
    normalizedName: "birla opus",
  }).lean();

  if (!asian || !birla) return;

  const legacyColors = await PaintColor.find({
    $or: [
      { brand: { $type: "string" } },
      { category: { $nin: ["emulsive", "other"] } },
    ],
  }).lean();

  for (const color of legacyColors) {
    const oldBrand = typeof color.brand === "string" ? color.brand : "";

    const brandId =
      oldBrand.toLowerCase() === "asian paints" ? asian._id : birla._id;

    await PaintColor.updateOne(
      { _id: color._id },
      {
        $set: {
          brand: brandId,
          category: color.category === "other" ? "other" : "emulsive",
        },
      }
    );
  }
}

function serializeColor(color: any) {
  const brand =
    color.brand && typeof color.brand === "object" ? color.brand : null;

  return {
    ...color,
    id: color.id,
    brand: brand?.name ?? (typeof color.brand === "string" ? color.brand : ""),
    brandId: brand?._id ? String(brand._id) : "",
  };
}

export async function GET() {
  try {
    await connectDB();
    await ensureDefaultBrands();
    await migrateLegacyColors();

    let colors = await PaintColor.find()
      .populate("brand", "name")
      .sort({ createdAt: -1 })
      .lean();

    if (colors.length === 0) {
      const brands = await Brand.find({
        normalizedName: {
          $in: ["asian paints", "birla opus"],
        },
      }).lean();

      const brandByName = new Map(
        brands.map((brand) => [brand.name, brand._id])
      );

      const seed = INITIAL_COLORS.filter(
        (color) => color.brand === "Asian Paints"
      ).map((color) => ({
        ...color,
        brand: brandByName.get("Asian Paints"),
        category: color.category === "other" ? "other" : "emulsive",
      }));

      if (seed.length) {
        await PaintColor.insertMany(seed);
      }

      colors = await PaintColor.find()
        .populate("brand", "name")
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json(colors.map(serializeColor));
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

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const hex = typeof body.hex === "string" ? body.hex.toUpperCase() : "";
    const price = Number(body.pricePer4L);
    const category = body.category;
    const finish = body.finish;
    const brandName = typeof body.brand === "string" ? body.brand.trim() : "";

    if (!name || !code || !/^#[0-9A-F]{6}$/.test(hex)) {
      return NextResponse.json(
        { message: "Valid name, code, and hex colour are required." },
        { status: 400 }
      );
    }

    if (
      body.pricePer4L === "" ||
      body.pricePer4L == null ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        { message: "Enter a valid non-negative price." },
        { status: 400 }
      );
    }

    if (
      !["emulsive", "other"].includes(category) ||
      !["Matte", "Satin", "Gloss", "Texture", "Eggshell"].includes(finish)
    ) {
      return NextResponse.json(
        { message: "Invalid category or finish." },
        { status: 400 }
      );
    }

    await connectDB();
    await ensureDefaultBrands();

    const brand = await Brand.findOne({
      normalizedName: brandName.toLocaleLowerCase("en"),
    });

    if (!brand) {
      return NextResponse.json(
        { message: "Select a valid brand." },
        { status: 400 }
      );
    }

    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${randomUUID().slice(0, 8)}`;

    const created = await PaintColor.create({
      id,
      name,
      code,
      brand: brand._id,
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

    const populated = await PaintColor.findById(created._id)
      .populate("brand", "name")
      .lean();

    return NextResponse.json(serializeColor(populated), { status: 201 });
  } catch (error) {
    console.error("Failed to create colour:", error);

    return NextResponse.json(
      { message: "Unable to add colour. Please check the submitted data." },
      { status: 500 }
    );
  }
}
