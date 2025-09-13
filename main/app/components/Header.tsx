"use client";

import Link from "next/link";
import ProfileSection from "./ProfileSection";

export default function Header() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-orange-400">
            LeetCode
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="#" className="text-orange-400 hover:text-orange-300">
              Premium
            </Link>
            <Link href="/home" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Product
            </Link>
            <Link href="/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </div>
        </div>
        <ProfileSection />
      </div>
    </nav>
  );
}
