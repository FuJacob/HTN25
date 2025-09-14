"use client";

import Link from "next/link";
import { Button } from "../../shadcn-components/ui/button";
import ProfileSection from "./ProfileSection";

export default function Header() {
  return (
    <nav className="">
      <div className="flex items-center justify-between px-6 py-8 w-full">
        {/* Left: Product Name + Navigation */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-xl font-black text-tiktok-black hover:text-tiktok-red transition-colors flex items-center"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-black text-tiktok-black">
              2Sum Dance
            </span>
          </Link>
          <Link
            href="/dances"
            className="text-lg font-medium text-gray-700 hover:text-tiktok-red transition-colors"
          >
            Dances
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
