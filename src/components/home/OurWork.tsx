
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  LoaderCircle,
  Palette,
} from "lucide-react";

type WorkItem = {
  id: string;
  title: string;
  colorName: string;
  category: string;
  brandName: string;
  imageUrl: string;
  order: number;
};

type OurWorkProps = {
  onSelectBrand: (brand: string) => void;
};

const demoItems: WorkItem[] = [
  {
    id: "demo-1",
    title: "Warm & Welcoming",
    colorName: "Sandstone Beige",
    category: "emulsion",
    brandName: "Asian Paints",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    order: 1,
  },
  {
    id: "demo-2",
    title: "Modern Calm",
    colorName: "Sage Whisper",
    category: "emulsion",
    brandName: "Birla Opus",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    order: 2,
  },
  {
    id: "demo-3",
    title: "Elegant Living",
    colorName: "Ivory Mist",
    category: "acrylic",
    brandName: "Asian Paints",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
    order: 3,
  },
  {
    id: "demo-4",
    title: "Earthy Retreat",
    colorName: "Terracotta Glow",
    category: "distemper",
    brandName: "Birla Opus",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
    order: 4,
  },
  {
    id: "demo-5",
    title: "Contemporary Luxe",
    colorName: "Stone Grey",
    category: "enamel",
    brandName: "Asian Paints",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85",
    order: 5,
  },
  {
    id: "demo-6",
    title: "Fresh Perspective",
    colorName: "Olive Haze",
    category: "cement",
    brandName: "Birla Opus",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    order: 6,
  },
];

const categoryLabels: Record<string, string> = {
  emulsion: "Emulsion",
  enamel: "Enamel",
  distemper: "Distemper",
  acrylic: "Acrylic",
  cement: "Cement",
};

export default function OurWork({ onSelectBrand }: OurWorkProps) {
  const [items, setItems] = useState<WorkItem[]>(demoItems);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadItems() {
      try {
        const response = await fetch("/api/work", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load gallery");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid gallery response");
        }

        setItems(data.length > 0 ? data : demoItems);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Our Work gallery:", error);
          setItems(demoItems);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadItems();

    return () => controller.abort();
  }, []);

  function moveCarousel(direction: number) {
    const track = trackRef.current;
    if (!track) return;

    const firstCard =
      track.querySelector<HTMLElement>("[data-work-card]");

    const cardWidth =
      firstCard?.getBoundingClientRect().width ?? 340;

    track.scrollBy({
      left: direction * (cardWidth + 20),
      behavior: "smooth",
    });
  }

  function viewShades(brandName: string) {
    onSelectBrand(brandName);

    requestAnimationFrame(() => {
      document
        .getElementById("colours-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  }

  return (
    <section
      id="our-work"
      aria-labelledby="our-work-heading"
      className="overflow-hidden bg-[#f7f5f0] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-900/10 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
              <Palette size={14} />
              Crafted spaces
            </div>

            <h2
              id="our-work-heading"
              className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
            >
              Our Work<span className="text-amber-600">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Discover beautiful spaces, inspiring colours and
              finishes from trusted paint brands.
            </p>
          </div>

          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous projects"
              onClick={() => moveCarousel(-1)}
              className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-950 hover:text-white"
            >
              <ArrowLeft size={19} />
            </button>

            <button
              type="button"
              aria-label="Next projects"
              onClick={() => moveCarousel(1)}
              className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-white transition hover:bg-amber-700"
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
            <LoaderCircle size={14} className="animate-spin" />
            Loading gallery...
          </div>
        )}

        <div
          ref={trackRef}
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 scroll-smooth sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <article
              key={item.id}
              data-work-card
              className="group w-[82vw] max-w-[390px] shrink-0 snap-start overflow-hidden rounded-[1.6rem] border border-black/5 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.14)] sm:w-[340px] lg:w-[370px]"
            >
              <div className="relative h-[250px] overflow-hidden bg-slate-200 sm:h-[275px]">
                <img
                  src={item.imageUrl}
                  alt={`${item.colorName} paint project`}
                  loading={index < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  Project {String(index + 1).padStart(2, "0")}
                </span>

                <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800">
                  {categoryLabels[item.category?.toLowerCase()] ||
                    item.category}
                </span>

                <button
                  type="button"
                  onClick={() => viewShades(item.brandName)}
                  aria-label={`Explore ${item.brandName} shades`}
                  className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-950 transition hover:rotate-45 hover:bg-amber-500"
                >
                  <ArrowUpRight size={19} />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
                  {item.brandName}
                </p>

                <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-slate-950">
                  {item.colorName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.title}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs font-medium text-slate-500">
                    Colour inspiration
                  </span>

                  <button
                    type="button"
                    onClick={() => viewShades(item.brandName)}
                    className="shrink-0 text-xs font-bold text-slate-900 transition-colors hover:text-amber-700"
                  >
                    View shades ↗
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-2 flex justify-center gap-3 sm:hidden">
          <button
            type="button"
            aria-label="Previous projects"
            onClick={() => moveCarousel(-1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 bg-white"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            aria-label="Next projects"
            onClick={() => moveCarousel(1)}
            className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
