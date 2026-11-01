"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  BookOpen,
  Menu,
  X,
  PlusCircle,
  Home,
  Library,
  BookMarked,
  BookCheck,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsOpen(false);

  // Base public links
  const publicLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "All Books", href: "/books", icon: Library },
  ];

  // Private routes (visible only when logged in)
  const privateLinks = [
    { label: "Add Book", href: "/add-book", icon: PlusCircle },
    { label: "My Books", href: "/my-books", icon: BookMarked },
    { label: "My Borrows", href: "/my-borrows", icon: BookCheck },
  ];

  const displayedLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
              <BookOpen className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Book<span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Hype</span>
              </span>
              <p className="text-[10px] font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase hidden sm:block">
                Small Online Library
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1.5 md:flex">
            {displayedLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`
                    flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-600 dark:hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Theme Toggle + Auth Controls */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            ) : user ? (
              /* User Photo Avatar with Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 p-1 pr-3 hover:border-emerald-500 transition-all"
                >
                  {/* User Photo */}
                  <img
                    src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                    <div className="border-b border-slate-100 dark:border-slate-800 px-3 py-2.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowProfileModal(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated: Login & Register Buttons */
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="rounded-full px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all hover:scale-[1.02]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] px-4 py-6 md:hidden">
            <nav className="flex flex-col gap-2">
              {displayedLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className={`
                      flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                      ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-2">
                      <img
                        src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border border-emerald-500"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        closeMenu();
                        setShowProfileModal(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-500"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* My Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-emerald-500" />
                Reader Profile
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center py-6 text-center">
              <img
                src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
              />
              <h4 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{user.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Verified Reader Member
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="rounded-xl bg-slate-900 dark:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
