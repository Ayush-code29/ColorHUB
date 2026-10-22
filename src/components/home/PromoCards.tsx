
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

type Offer = {
  id: string;
  label: string;
  heading: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  order: number;
};

export default function PromoCards() {
  const { openConsultationModal } = useStore();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadOffers() {
      try {
        const response = await fetch("/api/offers", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load offers");
        }

        const data = await response.json();

        if (!cancelled) {
          setOffers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(
          "Unable to load homepage offers:",
          error
        );

        if (!cancelled) {
          setOffers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeIndex >= offers.length) {
      setActiveIndex(Math.max(0, offers.length - 1));
    }
  }, [activeIndex, offers.length]);

  if (loading) {
    return (
      <section
        id="offers-section"
        className="bg-white py-8"
      >
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-12 text-sm text-slate-400">
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Loading offers...
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  const previous = () => {
    setActiveIndex(
      (index) => (index - 1 + offers.length) % offers.length
    );
  };

  const next = () => {
    setActiveIndex(
      (index) => (index + 1) % offers.length
    );
  };

  function handleOfferClick(link: string) {
    if (/^(https?:\/\/|mailto:|tel:)/i.test(link)) {
      window.location.href = link;
      return;
    }

    if (
      link === "#consultation" ||
      link === "/consultation"
    ) {
      openConsultationModal();
      return;
    }

    if (link.startsWith("#")) {
      document
        .querySelector(link)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      return;
    }

    if (link.startsWith("/")) {
      window.location.href = link;
    }
  }

  const visibleOffers = Array.from(
    { length: Math.min(3, offers.length) },
    (_, offset) => offers[(activeIndex + offset) % offers.length]
  );

  return (
    <section
      id="offers-section"
      className="bg-white py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Offers &amp; Inspiration
          </p>

          {offers.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="mr-1 text-xs tabular-nums text-slate-400">
                {activeIndex + 1} / {offers.length}
              </span>

              <button
                type="button"
                onClick={previous}
                aria-label="Previous offer"
                className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next offer"
                className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleOffers.map((offer, visibleIndex) => (
            <article
              key={offer.id}
              className="group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[28px] border border-amber-100 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative z-10 pr-1">
                <span className="mb-2 inline-block text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                  {offer.label}
                </span>

                <h2 className="max-w-[95%] text-xl font-extrabold leading-snug text-slate-950">
                  {offer.heading}
                </h2>

                <p className="mt-2 max-w-[95%] text-sm leading-5 text-slate-600">
                  {offer.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-end justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    handleOfferClick(offer.buttonLink)
                  }
                  className="inline-flex max-w-[55%] items-center gap-2 text-left text-sm font-bold text-slate-950 transition hover:text-amber-700"
                >
                  <span>{offer.buttonText}</span>

                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </button>

                <img
                  src={offer.imageUrl}
                  alt={offer.heading}
                  loading={
                    visibleIndex === 0 ? "eager" : "lazy"
                  }
                  className="h-24 w-28 shrink-0 rounded-2xl border border-white/80 object-cover shadow-sm"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
