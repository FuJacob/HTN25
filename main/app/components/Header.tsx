"use client";

import Link from "next/link";
import { Button } from "../../shadcn-components/ui/button";
import ProfileSection from "./ProfileSection";

export default function Header() {
  return (
    <nav className="border-b border-gray-200 bg-tiktok-white">
      <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        {/* Left: Product Name */}
        <div>
          <Link
            href="/"
            className="text-xl font-black text-tiktok-black hover:text-tiktok-red transition-colors flex items-center"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-black text-tiktok-black">2Sum Dance</span>
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
