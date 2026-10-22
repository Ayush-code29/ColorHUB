
import Brand from "@/models/Brand";

export const DEFAULT_BRANDS = [
  {
    name: "Asian Paints",
    tagline: "Colour your world",
    logoUrl: "/brands/asian-paints.svg",
    accentColor: "#DC2626",
    popularSeries: "Royale Luxury Matt",
  },
  {
    name: "Birla Opus",
    tagline: "Beautifully crafted paints",
    logoUrl: "/brands/birla-opus.svg",
    accentColor: "#1D4ED8",
    popularSeries: "Interior & Exterior Paints",
  },
] as const;

export async function ensureDefaultBrands() {
  for (const item of DEFAULT_BRANDS) {
    const normalizedName = item.name.trim().toLocaleLowerCase("en");

    await Brand.updateOne(
      { normalizedName },
      {
        $setOnInsert: {
          ...item,
          normalizedName,
        },
      },
      { upsert: true }
    );
  }
}
