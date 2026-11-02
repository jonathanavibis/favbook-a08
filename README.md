# FavBook — Contemporary Digital Library Management Platform

> **FavBook** is a contemporary, community-driven digital library platform built with Next.js (App Router), Tailwind CSS, Express, and MongoDB Atlas. Readers can browse titles, contribute personal volumes, borrow books with real-time copy tracking, and return borrowed copies seamlessly.

- **Client GitHub Repository**: [https://github.com/jonathanavibis/favbook-a08](https://github.com/jonathanavibis/favbook-a08)
- **Server GitHub Repository**: [https://github.com/jonathanavibis/favbook-server-a08](https://github.com/jonathanavibis/favbook-server-a08)
- **Live Backend API**: [https://bookhive-server-a08.vercel.app](https://bookhive-server-a08.vercel.app)

---

## 🌟 Top Website Features & Highlights

1. **Interactive Dynamic Hero Slider & New Arrivals**:
   - Features a smooth Swiper.js banner on the Home page with 3 engaging slides.
   - Automatically loads and displays the latest 6 catalogued books from MongoDB in real time using sorting and limiting.

2. **Smart Borrowing System & Atomic Copy Tracking ($inc)**:
   - Readers can borrow books with a single click, specifying their return due date.
   - Atomically decrements the book's available copies by 1 with MongoDB `$inc: { copies: -1 }`.
   - Returning the book via **My Borrows** immediately replenishes the inventory back by 1 with `$inc: { copies: 1 }`.
   - Disables the borrow button and displays a "Not Available" badge whenever copies reach 0.

3. **Double-Borrow Prevention Challenge**:
   - Enforces intelligent validation preventing a user from borrowing the same title twice at the same time. If an active loan exists, a descriptive toast alert informs the reader.

4. **Full Community CRUD Operations**:
   - **Add Book (`/add-book`)**: Private contributor route featuring client-side canvas-compressed image optimization (Base64), quick preset covers, category selection, and total copies specification.
   - **All Books (`/books`)**: Public catalog with real-time search, category filtering (Fiction, Science, History, Kids, Others), and a 3-column responsive layout.
   - **My Books (`/my-books`)**: Private dashboard to edit existing books with pre-filled forms and delete books with a custom confirmation dialog.
   - **My Borrows (`/my-borrows`)**: Ledger table to manage active loans and return books.

5. **Robust Authentication, Dark/Light Themes & Zero Disruption**:
   - Complete authentication flow with password strength rules (uppercase, lowercase, 6+ characters), Google Social Login, and GitHub Social Login.
   - Seamless session recovery ensuring logged-in users are **never** bounced to login on page reloads across any private routes.
   - Clean custom modal dialogs (no default browser `window.alert` or `window.confirm`) and dynamic page titles.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & DaisyUI
- **Icons**: Lucide React & React Icons
- **Interactive Carousel**: Swiper.js
- **State & Auth**: React Context, JWT persistence, BetterAuth & OAuth sync
- **Backend API**: Express.js, MongoDB Atlas, Mongoose ODM (deployed on Vercel)

---

## 🚀 Getting Started Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jonathanavibis/favbook-a08.git
   cd favbook-a08
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SERVER_URL=https://bookhive-server-a08.vercel.app
   NEXT_PUBLIC_API_URL=https://bookhive-server-a08.vercel.app
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
