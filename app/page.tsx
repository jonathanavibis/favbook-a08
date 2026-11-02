"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  BookMarked,
  Clock,
  RotateCcw,
  Compass,
  Star,
  Quote,
  Library,
  Layers,
} from "lucide-react";
import SwiperBanner from "@/components/SwiperBanner";
import BookCard, { Book } from "@/components/BookCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://favbook-a08-server.vercel.app";

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const res = await fetch(`${API_BASE}/books?limit=6&sort=newest`);
        if (res.ok) {
          const data = await res.json();
          setNewArrivals(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load new arrivals", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNewArrivals();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Swiper Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <SwiperBanner />
      </section>

      {/* 2. New Arrivals (Dynamic: Latest 6 Books) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span>Fresh Off The Press</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              New Arrivals in Library
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Hand-picked and recently catalogued additions ready for checkout today.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-500 hover:text-slate-950 dark:hover:bg-emerald-500 dark:hover:text-slate-950 transition-all w-fit"
          >
            <span>See All Books</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <LoadingSpinner text="Retrieving New Arrivals..." />
        ) : newArrivals.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              No Books Catalogued Yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Be the first community member to add a book to the BookNook archive!
            </p>
            <Link
              href="/add-book"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950"
            >
              Add a Book
            </Link>
          </div>
        )}

        {/* Center "See All Books" button as required */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] transition-all"
          >
            <Library className="h-4 w-4" />
            <span>See All Books In Collection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 3. Extra Section 1: How Borrowing Works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-12 lg:p-16 shadow-lg">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Simple 3-Step Process
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              How Borrowing Works at BookNook
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Borrowing reading material has never been simpler. Follow these three steps to enjoy your next literary adventure.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-emerald-500/40 transition-all shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/30">
                <Compass className="h-7 w-7 stroke-[2]" />
              </div>
              <span className="mt-4 text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Step 01
              </span>
              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                Discover &amp; Inspect
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter through our catalog by genre or author. View real-time copy availability, ratings, and reader summaries.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-emerald-500/40 transition-all shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/30">
                <BookMarked className="h-7 w-7 stroke-[2]" />
              </div>
              <span className="mt-4 text-xs font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Step 02
              </span>
              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                1-Click Digital Checkout
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Log into your account, click Borrow, select your expected return date, and our system automatically deducts a copy.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-emerald-500/40 transition-all shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-400 text-slate-950 shadow-md shadow-cyan-500/30">
                <RotateCcw className="h-7 w-7 stroke-[2]" />
              </div>
              <span className="mt-4 text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                Step 03
              </span>
              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                Read Freely &amp; Return
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Track your active books under My Borrows. When finished, hit Return to instantly replenish the copy back to readers!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Extra Section 2: Explore Top Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Curated Shelves
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Explore Popular Categories
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Dive into our five specialized genres, each curated with bestselling literature.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            {
              name: "Fiction",
              desc: "Novels, thrillers, and award-winning narrative drama.",
              color: "from-purple-500 to-indigo-600",
              count: "45+ Books",
            },
            {
              name: "Science",
              desc: "Cosmology, astrophysics, neuroscience, and discovery.",
              color: "from-sky-500 to-blue-600",
              count: "32+ Books",
            },
            {
              name: "History",
              desc: "Civilizations, pivotal eras, and profound memoirs.",
              color: "from-amber-500 to-orange-600",
              count: "28+ Books",
            },
            {
              name: "Kids",
              desc: "Fairy tales, early learning, and imaginative journeys.",
              color: "from-pink-500 to-rose-600",
              count: "20+ Books",
            },
            {
              name: "Others",
              desc: "Mindset, productivity, and transformative life tools.",
              color: "from-emerald-500 to-teal-600",
              count: "35+ Books",
            },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/books?category=${cat.name}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md`}>
                  <BookOpen className="h-6 w-6 stroke-[2.2]" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>{cat.count}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Reader Reviews Community Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100/50 dark:from-slate-900/50 to-transparent p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Community Love
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Loved by Avid Readers Everywhere
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Hear directly from readers who use BookNook to nurture their daily reading habits.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "BookNook made sharing our personal book collection effortless. Borrowing takes literally 5 seconds, and the inventory count updates in real time!",
                name: "Sophia Rahman",
                role: "Literature Enthusiast",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                rating: 5,
              },
              {
                quote: "The interface is sleek and lightning fast. I can browse science classics, manage return dates, and see my borrowed shelf without any clutter.",
                name: "Tanvir Ahmed",
                role: "STEM Student & Researcher",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                rating: 5,
              },
              {
                quote: "Finally an online library that prevents double-borrowing cleanly and lets me contribute back my extra physical books into the community pool.",
                name: "Maria Choudhury",
                role: "Book Club Organizer",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                rating: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-10 w-10 rounded-full object-cover border border-emerald-500"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {review.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
