import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import PaintColor from "@/models/PaintColor";
import Brand from "@/models/Brand";
import { INITIAL_COLORS } from "@/data/initialData";
import { ensureDefaultBrands } from "@/lib/brandHelpers";

export const runtime = "nodejs";

const PAINT_CATEGORIES = [
  "emulsion",
  "enamel",
  "distemper",
  "acrylic",
  "cement",
] as const;

type PaintCategory = (typeof PAINT_CATEGORIES)[number];

const PAINT_FINISHES = [
  "Matte",
  "Satin",
  "Gloss",
  "Texture",
  "Eggshell",
] as const;

type PaintFinish = (typeof PAINT_FINISHES)[number];

function normalizeCategory(value: unknown): PaintCategory {
  if (typeof value !== "string") {
    return "acrylic";
  }

  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "emulsion":
    case "emulsive":
    case "interior":
    case "wall":
    case "other":
      return "emulsion";

    case "enamel":
    case "wood":
    case "metal":
      return "enamel";

    case "distemper":
      return "distemper";

    case "cement":
    case "exterior":
      return "cement";

    case "acrylic":
    case "texture":
      return "acrylic";

    default:
      return "acrylic";
  }
}

function parseCategory(value: unknown): PaintCategory | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return PAINT_CATEGORIES.includes(normalized as PaintCategory)
    ? (normalized as PaintCategory)
    : null;
}

function parseFinish(value: unknown): PaintFinish | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  const finishMap: Record<string, PaintFinish> = {
    matte: "Matte",
    satin: "Satin",
    gloss: "Gloss",
    texture: "Texture",
    eggshell: "Eggshell",
  };

  return finishMap[normalized] ?? null;
}

async function migrateLegacyColors() {
  const asian = await Brand.findOne({
    normalizedName: "asian paints",
  }).lean();

  const birla = await Brand.findOne({
    normalizedName: "birla opus",
  }).lean();

  const legacyColors = await PaintColor.find({
    $or: [
      { brand: { $type: "string" } },
      { category: { $nin: PAINT_CATEGORIES } },
      { category: { $exists: false } },
    ],
  }).lean();

  for (const color of legacyColors) {
    const update: Record<string, unknown> = {
      category: normalizeCategory(color.category),
    };

    if (typeof color.brand === "string") {
      const oldBrand = color.brand.trim().toLowerCase();

      if (oldBrand === "asian paints" && asian) {
        update.brand = asian._id;
      } else if (oldBrand === "birla opus" && birla) {
        update.brand = birla._id;
      } else {
        // Preserve unknown brand references while normalizing category.
        await PaintColor.updateOne(
          { _id: color._id },
          { $set: update }
        );

        continue;
      }
    }

    await PaintColor.updateOne(
      { _id: color._id },
      { $set: update }
    );
  }
}

function serializeColor(color: any) {
  const brand =
    color?.brand && typeof color.brand === "object"
      ? color.brand
      : null;

  return {
    ...color,
    id: color.id,
    brand:
      brand?.name ??
      (typeof color?.brand === "string" ? color.brand : ""),
    brandId: brand?._id ? String(brand._id) : "",
    category: normalizeCategory(color?.category),
  };
}

/**
 * Resolve a brand using either its MongoDB ID or its name.
 * This supports dropdowns that submit either value format.
 */
async function findSelectedBrand(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const selectedValue = value.trim();

  if (mongoose.isValidObjectId(selectedValue)) {
    const brandById = await Brand.findById(selectedValue);

    if (brandById) {
      return brandById;
    }
  }

  const normalizedName = selectedValue
    .toLocaleLowerCase("en")
    .replace(/\s+/g, " ");

  return Brand.findOne({
    normalizedName,
  });
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
        category: normalizeCategory(color.category),
      }));

      if (seed.length > 0) {
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

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const code =
      typeof body.code === "string" ? body.code.trim() : "";

    const hex =
      typeof body.hex === "string"
        ? body.hex.trim().toUpperCase()
        : "";

    const category = parseCategory(body.category);
    const finish = parseFinish(body.finish);

    const price =
      body.pricePer4L === "" || body.pricePer4L == null
        ? NaN
        : Number(body.pricePer4L);

    if (!name || !code || !/^#[0-9A-F]{6}$/.test(hex)) {
      return NextResponse.json(
        {
          message:
            "Valid name, code, and hex colour are required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { message: "Enter a valid non-negative price." },
        { status: 400 }
      );
    }

    if (!category || !finish) {
      return NextResponse.json(
        {
          message: "Invalid category or finish.",
          allowedCategories: PAINT_CATEGORIES,
          allowedFinishes: PAINT_FINISHES,
          received: {
            category: body.category ?? null,
            finish: body.finish ?? null,
          },
        },
        { status: 400 }
      );
    }

    await connectDB();
    await ensureDefaultBrands();

    // Accept either the MongoDB brand ID or the brand name.
    const brand = await findSelectedBrand(body.brand);

    if (!brand) {
      return NextResponse.json(
        {
          message:
            "Selected brand was not found. Refresh the page and select the brand again.",
          receivedBrand: body.brand ?? null,
        },
        { status: 400 }
      );
    }

    const slug = name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const id = slug + "-" + randomUUID().slice(0, 8);

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
        typeof body.description === "string"
          ? body.description.trim()
          : "",
      roomImage:
        typeof body.roomImage === "string"
          ? body.roomImage.trim()
          : "",
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

    return NextResponse.json(
      serializeColor(populated),
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create colour:", error);

    return NextResponse.json(
      {
        message:
          "Unable to add colour. Please check the submitted data.",
      },
      { status: 500 }
    );
  }
}
