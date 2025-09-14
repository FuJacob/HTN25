"use client";

import Link from "next/link";
import { Button } from "../../shadcn-components/ui/button";
import ProfileSection from "./ProfileSection";

export default function Header() {
  return (
    <nav className="border-b border-tiktok-white/10 bg-tiktok-white">
      <div className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        {/* Left: Product Name */}
        <div>
          <Link
            href="/"
            className="text-3xl font-black text-tiktok-black hover:text-tiktok-pink transition-colors"
          >
            2 Sum Dance
          </Link>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-10">
          <Link
            href="/explore"
            className="text-lg text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Explore
          </Link>
          <Link
            href="/dances"
            className="text-lg text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Dances
          </Link>
          <Link
            href="/contest"
            className="text-lg text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Contest
          </Link>
          <Link
            href="/discuss"
            className="text-lg text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Discuss
          </Link>
          <Link
            href="/interview"
            className="text-lg text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Interview
          </Link>
          <Link
            href="/store"
            className="text-lg text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Store
          </Link>
        </div>

        {/* Right: Profile Section */}
        <div>
          <ProfileSection />
        </div>
      </div>
    </nav>
  );
}
