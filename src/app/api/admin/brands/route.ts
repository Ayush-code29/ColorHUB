
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import Brand from "@/models/Brand";
import { ensureDefaultBrands } from "@/lib/brandHelpers";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    await ensureDefaultBrands();

    const brands = await Brand.find().sort({ name: 1 }).lean();

    return NextResponse.json(
      brands.map((brand) => ({
        id: String(brand._id),
        name: brand.name,
        tagline: brand.tagline ?? "",
        logoUrl: brand.logoUrl ?? "",
        accentColor: brand.accentColor ?? "#D97706",
        popularSeries: brand.popularSeries ?? "",
        shadesCount: 0,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch brands:", error);

    return NextResponse.json(
      { message: "Unable to load brands." },
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

    const tagline =
      typeof body.tagline === "string" ? body.tagline.trim() : "";

    if (!name || name.length > 80) {
      return NextResponse.json(
        { message: "Brand name is required and must be at most 80 characters." },
        { status: 400 }
      );
    }

    if (!tagline || tagline.length > 180) {
      return NextResponse.json(
        { message: "Brand tagline is required and must be at most 180 characters." },
        { status: 400 }
      );
    }

    const logoUrl =
      typeof body.logoUrl === "string" ? body.logoUrl.trim() : "";

    const popularSeries =
      typeof body.popularSeries === "string"
        ? body.popularSeries.trim()
        : "";

    const accentColor =
      typeof body.accentColor === "string" &&
      /^#[0-9a-fA-F]{6}$/.test(body.accentColor)
        ? body.accentColor
        : "#D97706";

    await connectDB();

    const normalizedName = name.toLocaleLowerCase("en");

    const existing = await Brand.findOne({ normalizedName }).lean();

    if (existing) {
      return NextResponse.json(
        { message: "A brand with this name already exists." },
        { status: 409 }
      );
    }

    const brand = await Brand.create({
      name,
      normalizedName,
      tagline,
      logoUrl,
      accentColor,
      popularSeries,
    });

    return NextResponse.json(
      {
        id: String(brand._id),
        name: brand.name,
        tagline: brand.tagline,
        logoUrl: brand.logoUrl,
        accentColor: brand.accentColor,
        popularSeries: brand.popularSeries,
        shadesCount: 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create brand:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "A brand with this name already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Unable to create brand." },
      { status: 500 }
    );
  }
}
