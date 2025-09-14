"use client";

import Link from "next/link";
import { Button } from "../../shadcn-components/ui/button";

export default function Header() {
  return (
    <nav className="border-b border-tiktok-white/10">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Left: Product Name */}
        <div>
          <Link href="/" className="text-2xl font-black text-tiktok-white hover:text-tiktok-cyan transition-colors">
            2 Sum Dance
          </Link>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/explore" className="text-tiktok-white hover:text-tiktok-red transition-colors font-medium">
            Explore
          </Link>
          <Link href="/dances" className="text-tiktok-white hover:text-tiktok-red transition-colors font-medium">
            Dances
          </Link>
          <Link href="/contest" className="text-tiktok-white hover:text-tiktok-red transition-colors font-medium">
            Contest
          </Link>
          <Link href="/discuss" className="text-tiktok-white hover:text-tiktok-red transition-colors font-medium">
            Discuss
          </Link>
          <Link href="/interview" className="text-tiktok-white hover:text-tiktok-red transition-colors font-medium">
            Interview
          </Link>
          <Link href="/store" className="text-tiktok-white hover:text-tiktok-red transition-colors font-medium">
            Store
          </Link>
        </div>

        {/* Right: Get Started Button */}
        <div>
          <Button 
            className="bg-tiktok-red hover:bg-tiktok-pink text-tiktok-white font-bold px-6 py-2 rounded-full transition-colors"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
