"use client";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { Button } from "../../shadcn-components/ui/button";

export default function ProfileSection() {
  const { user, isLoading } = useUser();
  if (isLoading) return <p className="text-tiktok-blue">Loading...</p>;
  if (user) {
    return (
      <div className="flex flex-row items-center gap-3">
        <div className="group relative">
          <Link href="/profile">
            <img
              src={user.picture}
              alt="Profile"
              className="rounded-full w-12 h-12 cursor-pointer border-2 border-gray-200 hover:border-tiktok-pink transition-colors"
            />
          </Link>
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-tiktok-black text-tiktok-white text-xs px-3 py-2 rounded-lg opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 min-w-[120px] text-center z-50">
            {user.email}
          </div>
        </div>
        <Link href="/auth/logout">
          <Button
            variant="outline"
            className="bg-tiktok-white text-tiktok-black border-tiktok-black/20 hover:bg-tiktok-red hover:text-tiktok-white hover:border-tiktok-red transition-colors font-medium px-4 py-2"
          >
            Log out
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <Link href="/auth/login">
      <Button className="bg-tiktok-red hover:bg-tiktok-pink text-tiktok-white font-bold px-8 py-3 text-lg rounded-full transition-colors">
        Sign in
      </Button>
    </Link>
  );
}
