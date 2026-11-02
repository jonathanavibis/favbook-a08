"use client";

import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] text-slate-600 dark:text-slate-300 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950">
                <BookOpen className="h-6 w-6 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Book<span className="text-emerald-500 dark:text-emerald-400">Nook</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              BookNook is a contemporary digital library and book sharing community. Discover bestselling literature, lend your favorite editions, borrow titles seamlessly, and return them at your own leisure.
            </p>
            {/* Social Links with new X logo */}
            <div className="flex items-center gap-3.5 pt-2 text-slate-500 dark:text-slate-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              {/* Using the new X logo as required */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Library Genres
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/books?category=Fiction" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Fiction &amp; Novels
                </Link>
              </li>
              <li>
                <Link href="/books?category=Science" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Science &amp; Cosmos
                </Link>
              </li>
              <li>
                <Link href="/books?category=History" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  World &amp; Human History
                </Link>
              </li>
              <li>
                <Link href="/books?category=Kids" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Kids &amp; Young Readers
                </Link>
              </li>
              <li>
                <Link href="/books?category=Others" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Productivity &amp; Life Skills
                </Link>
              </li>
            </ul>
          </div>

          {/* Reader Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Reader Access
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/books" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Browse All Books
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Contribute New Book
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  My Active Borrows
                </Link>
              </li>
              <li>
                <Link href="/my-books" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  My Contributed Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Contact Library
            </h4>
            <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>Knowledge Plaza, Floor 4, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>support@bookhype.library</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>+880 1700-BOOKHY (266549)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright Line */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} BookNook Library Platform. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for avid readers with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> by BookNook Team
          </p>
        </div>
      </div>
    </footer>
  );
}
