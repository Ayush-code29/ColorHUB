
import HeroSlide from "@/models/HeroSlide";
import HeroSlideSeed from "@/models/HeroSlideSeed";
import { DEFAULT_HERO_SLIDES } from "@/lib/defaultHeroSlides";

export async function ensureDefaultHeroSlides() {
  const seedKey = "default-hero-slides-v1";

  const existingSeed = await HeroSlideSeed.findOne({
    key: seedKey,
    completed: true,
  }).lean();

  if (existingSeed) {
    return;
  }

  try {
    await HeroSlideSeed.create({
      key: seedKey,
      completed: false,
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      return;
    }

    throw error;
  }

  try {
    for (const slide of DEFAULT_HERO_SLIDES) {
      await HeroSlide.updateOne(
        { defaultKey: slide.defaultKey },
        {
          $setOnInsert: {
            ...slide,
            imagePublicId: "",
            source: "default",
            isActive: true,
          },
        },
        { upsert: true }
      );
    }

    await HeroSlideSeed.updateOne(
      { key: seedKey },
      { $set: { completed: true } }
    );
  } catch (error) {
    await HeroSlideSeed.deleteOne({
      key: seedKey,
      completed: false,
    });

    throw error;
  }
}
