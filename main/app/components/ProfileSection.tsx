"use client";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { Button } from "../../shadcn-components/ui/button";

export default function ProfileSection() {
  const { user, isLoading } = useUser();
  if (isLoading) return <p className="text-white">Loading...</p>;
  if (user) {
    return (
      <div
        className="flex flex-row items-center gap-3"
        style={{ textAlign: "center" }}
      >
        <div className="group relative">
          <Link href="/profile">
            <img
              src={user.picture}
              alt="Profile"
              style={{
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                cursor: "pointer",
              }}
            />
          </Link>
          <div
            className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100"
            style={{ minWidth: "120px" }}
          >
            {user.email}
          </div>
        </div>
        <Link href="/auth/logout">
          <Button
            variant="outline"
            className="bg-white text-gray-800 border-white hover:bg-gray-100 hover:text-gray-900"
          >
            Log out
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <Link href="/auth/login">
      <Button
        variant="outline"
        className="bg-white text-gray-800 border-white hover:bg-gray-100 hover:text-gray-900"
      >
        Sign in
      </Button>
    </Link>
  );
}
