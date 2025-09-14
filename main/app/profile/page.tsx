"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "../../shadcn-components/ui/button";
import Link from "next/link";
import ProblemStatsCircle from "../components/ProblemStatsCircle";

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-lg">
          You must be signed in to view your profile.
        </p>
        <Link href="/auth/login">
          <Button className="bg-teal-500 text-white">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Dancer Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
          <img
            src={user.picture}
            alt="Dancer Profile"
            className="w-32 h-32 rounded-full mb-6 border-4 border-gray-100"
          />
          <h2 className="text-2xl font-bold mb-2">
            {user.nickname || user.name}
          </h2>
          <p className="text-gray-500 mb-4 text-base">
            Dance Level: Intermediate
          </p>
          <Button className="bg-pink-100 text-pink-700 mb-2 px-6 py-2 text-base font-semibold rounded-lg">
            Edit Dancer Profile
          </Button>
          {/* Additional Profile Details */}
          <div className="w-full flex flex-col items-center mt-4 space-y-4">
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-md text-white hover:scale-110 transition-transform"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-6 h-6 flex items-center justify-center bg-black rounded-md text-white hover:scale-110 transition-transform"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-6 h-6 flex items-center justify-center bg-red-600 rounded-md text-white hover:scale-110 transition-transform"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            {/* Short Bio */}
            <p className="text-gray-600 text-sm text-center">
              “Dancing is like dreaming with your feet.”
            </p>
            {/* Dance Genres */}
            <div className="flex gap-2 flex-wrap justify-center">
              <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                Hip-Hop
              </span>
              <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                Jazz
              </span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                Ballet
              </span>
            </div>
            {/* Achievements */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400">Achievements</span>
              <span className="text-sm font-bold text-pink-700">
                Spring Dance Challenge Winner
              </span>
            </div>
            {/* Upcoming Events */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400">Upcoming Event</span>
              <span className="text-sm text-gray-700">
                Fall Showcase - Oct 10
              </span>
            </div>
            {/* Team/Group */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400">Dance Crew</span>
              <span className="text-sm text-gray-700">Groove Masters</span>
            </div>
            {/* Location */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400">Location</span>
              <span className="text-sm text-gray-700">Toronto, ON</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">
                Progress to Next Level
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-pink-400 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
            {/* Fun Fact */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400">Fun Fact</span>
              <span className="text-sm text-gray-700">
                Can moonwalk for 30 seconds straight!
              </span>
            </div>
          </div>
        </div>

        {/* Center Dance Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-10 col-span-2 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div className="flex items-center gap-12">
              {/* Replace ProblemStatsCircle with a dance stats circle if available, else keep as is */}
              <ProblemStatsCircle
                easy={12} // Hip-Hop
                medium={18} // Jazz
                hard={7} // Ballet
                total={50} // Total Dances
                solved={37} // Dances Performed
              />
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400">Easy</span>
                <span className="text-xl text-green-500 font-bold">12</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400">Medium</span>
                <span className="text-xl text-yellow-500 font-bold">18</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400">Hard</span>
                <span className="text-xl text-red-500 font-bold">7</span>
              </div>
            </div>
            <div className="mt-10 md:mt-0 text-center md:text-right">
              <span className="block text-xs text-gray-500">Dance Badges</span>
              <span className="block text-3xl font-bold">2</span>
              <span className="block text-xs text-gray-400">Locked Badge</span>
              <span className="block text-xs text-gray-500">
                Spring Dance Challenge
              </span>
            </div>
          </div>
          <div className="mb-10">
            <h3 className="text-base font-semibold mb-3">
              25 performances in the past year
            </h3>
            <div className="bg-gray-100 rounded-xl p-6">
              <span className="text-sm text-gray-500">
                Total active days: 18 &nbsp; Max streak: 5
              </span>
              {/* Fake activity graph */}
              <div className="grid grid-cols-12 gap-2 mt-3">
                {Array.from({ length: 12 }).map((_, i) => {
                  // Pattern: on off off on on off off, then all on (pink)
                  const pattern = [
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    false,
                  ];
                  const isPink = i >= 7 ? true : pattern[i];
                  return (
                    <div
                      key={i}
                      className={`h-6 rounded-lg ${
                        isPink ? "bg-pink-200" : "bg-gray-300"
                      }`}
                      style={{ width: "24px" }}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Recent Performances</h3>
              <Button
                variant="ghost"
                className="text-sm font-semibold text-pink-700"
              >
                View all dances &rarr;
              </Button>
            </div>
            <ul className="space-y-3">
              <li className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <span className="text-base">Apple</span>
                <span className="text-xs text-gray-400">5 days ago</span>
              </li>
              <li className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <span className="text-base">Jazz Night</span>
                <span className="text-xs text-gray-400">12 days ago</span>
              </li>
              <li className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <span className="text-base">Ballet Recital</span>
                <span className="text-xs text-gray-400">18 days ago</span>
              </li>
              <li className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <span className="text-base">Freestyle Jam</span>
                <span className="text-xs text-gray-400">a month ago</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
