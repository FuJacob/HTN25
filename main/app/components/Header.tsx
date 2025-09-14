"use client";

import Link from "next/link";
import { Button } from "../../shadcn-components/ui/button";
import ProfileSection from "./ProfileSection";

export default function Header() {
  return (
    <nav className="border-b border-gray-200 bg-tiktok-white">
      <div className="flex items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Left: Product Name */}
        <div className="mr-12">
          <Link
            href="/"
            className="text-xl font-black text-tiktok-black hover:text-tiktok-red transition-colors flex items-center"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-black text-tiktok-black">2Sum Dance</span>
          </Link>
        </div>

        {/* Left-aligned Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-8 flex-1">
          <Link
            href="/explore"
            className="text-base text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Explore
          </Link>
          <Link
            href="/dances"
            className="text-base text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Dances
          </Link>
          <Link
            href="/contest"
            className="text-base text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Contest
          </Link>
          <Link
            href="/discuss"
            className="text-base text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Discuss
          </Link>
          <Link
            href="/interview"
            className="text-base text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
          >
            Interview
          </Link>
          <Link
            href="/store"
            className="text-base text-tiktok-black hover:text-tiktok-red transition-colors font-medium"
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
