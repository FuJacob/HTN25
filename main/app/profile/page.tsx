"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@/components/ui/button";
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
    <main className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Profile Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <img
            src={user.picture}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold mb-2">
            {user.nickname || user.name}
          </h2>
          <p className="text-gray-500 mb-2">Rank 1,867,667</p>
          <Button className="bg-green-100 text-green-700 mb-4">
            Edit Profile
          </Button>
          <div className="w-full">
            <h3 className="text-sm font-semibold mb-2">Community Stats</h3>
            <ul className="text-xs text-gray-600 space-y-1 mb-4">
              <li>
                Views <span className="float-right">0</span>
              </li>
              <li>
                Solution <span className="float-right">0</span>
              </li>
              <li>
                Discuss <span className="float-right">0</span>
              </li>
              <li>
                Reputation <span className="float-right">0</span>
              </li>
            </ul>
            <h3 className="text-sm font-semibold mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                Python3
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                Python
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">C++</span>
            </div>
            <h3 className="text-sm font-semibold mb-2">Skills</h3>
            <span className="text-xs text-red-500">• Advanced</span>
          </div>
        </div>

        {/* Center Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-8">
              <ProblemStatsCircle
                easy={27}
                medium={31}
                hard={3}
                total={3681}
                solved={61}
              />
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">Easy</span>
                <span className="text-lg text-green-500">27/897</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">Med.</span>
                <span className="text-lg text-yellow-500">31/1916</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">Hard</span>
                <span className="text-lg text-red-500">3/868</span>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <span className="block text-xs text-gray-500">Badges</span>
              <span className="block text-2xl font-bold">0</span>
              <span className="block text-xs text-gray-400">Locked Badge</span>
              <span className="block text-xs text-gray-500">
                Sep LeetCoding Challenge
              </span>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-2">
              99 submissions in the past one year
            </h3>
            <div className="bg-gray-100 rounded p-4">
              <span className="text-xs text-gray-500">
                Total active days: 35 &nbsp; Max streak: 6
              </span>
              {/* Fake activity graph */}
              <div className="grid grid-cols-12 gap-1 mt-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-green-200 rounded"
                    style={{ width: "18px" }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Recent AC</h3>
              <Button variant="ghost" className="text-xs">
                View all submissions &rarr;
              </Button>
            </div>
            <ul className="space-y-2">
              <li className="bg-gray-50 rounded p-3 flex justify-between items-center">
                <span>Find Median from Data Stream</span>
                <span className="text-xs text-gray-400">22 days ago</span>
              </li>
              <li className="bg-gray-50 rounded p-3 flex justify-between items-center">
                <span>Trapping Rain Water</span>
                <span className="text-xs text-gray-400">22 days ago</span>
              </li>
              <li className="bg-gray-50 rounded p-3 flex justify-between items-center">
                <span>Minimum Window Substring</span>
                <span className="text-xs text-gray-400">22 days ago</span>
              </li>
              <li className="bg-gray-50 rounded p-3 flex justify-between items-center">
                <span>Unique Paths</span>
                <span className="text-xs text-gray-400">a month ago</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
