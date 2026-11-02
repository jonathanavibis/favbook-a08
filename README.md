# 📖 FavBook — Online Library Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-v5-570DF8?logo=daisyui)](https://daisyui.com/)
[![Vercel Status](https://img.shields.io/badge/Deployed-Vercel-success?logo=vercel)](https://favbook-a08.vercel.app)

> **FavBook** is a modern, community-driven online library management platform. It offers a seamless reading and book-sharing experience, allowing book enthusiasts to explore an extensive catalog, contribute personal titles, borrow books with real-time copy tracking, and manage their reading journey with ease.

---

## 🔗 Project Ecosystem & Live Deployment

| Resource | Direct Link |
|:---|:---|
| 🌐 **Live Web Application** | [https://favbook-a08.vercel.app](https://favbook-a08.vercel.app) |
| 🚀 **Live Backend API** | [https://favbook-a08-server.vercel.app](https://favbook-a08-server.vercel.app) |
| 💻 **Frontend GitHub Repository** | [https://github.com/jonathanavibis/favbook-a08](https://github.com/jonathanavibis/favbook-a08) |
| ⚙️ **Backend GitHub Repository** | [https://github.com/jonathanavibis/favbook-server-a08](https://github.com/jonathanavibis/favbook-server-a08) |

---

## 🌟 What You Can Do on FavBook (Core Features)

### 1. 🔍 Browse, Search & Filter Books
- **Live Search**: Instantly find books by title in real-time as you type.
- **Category Filter**: Explore curated genres including **Fiction**, **Science**, **History**, **Kids**, and **Others**.
- **Book Details Page**: View in-depth summaries, author details, genre tags, ratings, and live inventory count before borrowing.

### 2. 📥 Smart Borrowing & Due Date System
- **One-Click Borrow Modal**: Logged-in readers can borrow any available book and choose their expected return date.
- **Stock Depletion Safeguard**: Whenever a book's copies reach `0`, the borrow button automatically disables with a **"Not Available"** status badge.
- **Double-Borrow Prevention**: Readers cannot hold multiple simultaneous active loans for the exact same book.

### 3. 📋 My Borrows & Instant Return
- **Personal Loan Ledger**: Track all your currently borrowed books, loan timestamps, and return deadlines.
- **1-Click Return Engine**: Returning a book immediately restores the book's stock in the central library so others can read it.

### 4. ✍️ Add & Manage Your Books
- **Client-Side Image Optimization**: Upload cover photos of any size without external API failures; our built-in canvas engine auto-compresses images into clean Base64 formats.
- **Quick Cover Presets**: Choose from hand-picked high-definition presets or paste custom image URLs.
- **My Books Management**: Edit details of books you have contributed or safely delete titles with interactive confirmation dialogs.

### 5. 🔐 Secure Authentication & User Identity
- **Multi-Provider Login**: Sign up using Email & Password or 1-click **Google** and **GitHub OAuth**.
- **Password Strength Rules**: Strict client and server-side validation enforcing at least 1 uppercase letter, 1 lowercase letter, and minimum 6 characters.
- **Persistent Sessions**: Readers remain authenticated across page refreshes and browser tabs.

---

## 💡 Technical Highlights: Easy & Medium Challenges Solved

### 🟢 Easy Challenges
- **Dynamic Swiper.js Hero Banner**: Built an automated carousel showcasing featured book spotlights with responsive touch-swipe navigation.
- **Custom Non-Intrusive Modals & Toasts**: Replaced default browser alert/confirm dialogues with smooth, theme-aware confirmation popups and notification toasts via `react-hot-toast`.
- **Responsive Layout**: Designed a clean, adaptive Dark UI that renders across smartphones, tablets, and desktop displays with Tailwind CSS and DaisyUI.

### 🟡 Medium Challenges
- **Atomic Concurrency with MongoDB `$inc`**:
  - Addressed race conditions in stock updates by utilizing atomic `$inc: { copies: -1 }` on borrow and `$inc: { copies: 1 }` on return, ensuring inventory never goes negative.
- **Double-Borrow Lock Mechanism**:
  - Implemented compound query validation (`{ bookId, userEmail, status: "borrowed" }`) so users cannot exploit multiple simultaneous borrows of the same title.
- **In-Browser Image Compression Engine**:
  - Resolved third-party image hosting (ImgBB) rate-limit and API key invalidation issues by engineering an in-browser HTML5 Canvas + FileReader compression pipeline (max 700px width, 85% JPEG quality).
- **Universal Origin & BaseURL Discovery**:
  - Dynamically detects the current window origin in the browser (`window.location.origin`) while falling back to production Vercel URLs, eliminating OAuth callback URL mismatches and CORS rejections.

---

## 🛠️ Technology Stack

- **Frontend Core**: [Next.js 16 (App Router)](https://nextjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI v5](https://daisyui.com/)
- **State & Context**: React Context API (`AuthContext`, `ToastContext`)
- **Animation & Sliders**: [Framer Motion](https://www.framer.com/motion/) & [Swiper.js](https://swiperjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Authentication**: [BetterAuth](https://www.better-auth.com/) + MongoDB Adapter & JWT
- **Hosting**: [Vercel](https://vercel.com/)
