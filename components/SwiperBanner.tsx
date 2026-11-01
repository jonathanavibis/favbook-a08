"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles, Compass } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: "Immerse Yourself in Infinite Knowledge",
    subtitle: "Explore thousands of curated titles across literature, science, and history with instant digital borrowing privileges.",
    tag: "Featured Collection 2026",
    image: "https://images.unsplash.com/photo-1507842229451-7f01be8610ce?w=1600&auto=format&fit=crop&q=80",
    cta: "Browse Books",
  },
  {
    id: 2,
    title: "Share Stories & Expand Our Community Library",
    subtitle: "Have books you cherish? Add them to the BookHype public archive and inspire fellow curious minds across the globe.",
    tag: "Community Driven Archive",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&auto=format&fit=crop&q=80",
    cta: "Browse Books",
  },
  {
    id: 3,
    title: "Borrow Seamlessly, Read Freely, Return Easily",
    subtitle: "Experience zero friction borrowing with live copy tracking, automated inventory replenishment, and one-click returns.",
    tag: "Modern Library Management",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&auto=format&fit=crop&q=80",
    cta: "Browse Books",
  },
];

export default function SwiperBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-900 shadow-2xl">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={900}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "!bg-emerald-400 !w-8 !rounded-full transition-all",
        }}
        loop={true}
        className="h-[420px] sm:h-[480px] lg:h-[520px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Cover Image with Gradient Mask */}
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-center brightness-[0.45]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />

              {/* Slide Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-16 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400 w-fit backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{slide.tag}</span>
                </div>

                <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {slide.title}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  {slide.subtitle}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.03] transition-all"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{slide.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/add-book"
                    className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
                  >
                    <span>Add New Book</span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
