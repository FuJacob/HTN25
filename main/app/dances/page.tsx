"use client";
import React, { useState } from "react";
import {
  FaSearch,
  FaSortAmountDown,
  FaFilter,
  FaCode,
  FaDatabase,
  FaTerminal,
  FaSync,
  FaFire,
} from "react-icons/fa";
import { SiJavascript } from "react-icons/si";
import { Badge } from "@/shadcn-components/ui/badge";
import { Input } from "@/shadcn-components/ui/input";
import { Button } from "@/shadcn-components/ui/button";
import CalendarBox from "../components/Calendar";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useCreateUserOnLogin } from "../../lib/useCreateUserOnLogin";

const topicCategories = [
  { name: "Viral", count: 1977, active: true },
  { name: "Trending", count: 809, active: false },
  { name: "Hip Hop", count: 722, active: false },
  { name: "Pop", count: 609, active: false },
  { name: "K-Pop", count: 607, active: false },
  { name: "Freestyle", count: 467, active: false },
];

const problems = [
  {
    id: 1,
    title: "Renegade (Lottery by K Camp)",
    difficulty: "Hard",
    acceptance: "34.2%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 2,
    title: "Savage (Megan Thee Stallion)",
    difficulty: "Medium",
    acceptance: "68.5%",
    status: "solved",
    premium: false,
  },
  {
    id: 3,
    title: "WAP Dance (Cardi B & Megan Thee Stallion)",
    difficulty: "Hard",
    acceptance: "29.8%",
    status: "solved",
    premium: true,
  },
  {
    id: 4,
    title: "Say So (Doja Cat)",
    difficulty: "Medium",
    acceptance: "72.3%",
    status: "solved",
    premium: false,
  },
  {
    id: 5,
    title: "Supalonely (Benee ft. Gus Dapperton)",
    difficulty: "Easy",
    acceptance: "81.6%",
    status: "solved",
    premium: false,
  },
  {
    id: 6,
    title: "Out West (Travis Scott & Young Thug)",
    difficulty: "Medium",
    acceptance: "55.7%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 7,
    title: "Stay (The Kid LAROI & Justin Bieber)",
    difficulty: "Easy",
    acceptance: "79.4%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 8,
    title: "Laxed (Siren Beat) (Jawsh 685)",
    difficulty: "Medium",
    acceptance: "62.1%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 9,
    title: "Adderall (Corvette Corvette) (Popp Hunna)",
    difficulty: "Hard",
    acceptance: "41.3%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 10,
    title: "Cannibal (Kesha)",
    difficulty: "Medium",
    acceptance: "58.9%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 11,
    title: "Blinding Lights (The Weeknd)",
    difficulty: "Easy",
    acceptance: "76.2%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 12,
    title: "Don't Start Now (Dua Lipa)",
    difficulty: "Medium",
    acceptance: "64.8%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 13,
    title: "Iko Iko (My Bestie) (Justin Wellington)",
    difficulty: "Easy",
    acceptance: "83.1%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 14,
    title: "Fancy Like (Walker Hayes)",
    difficulty: "Easy",
    acceptance: "78.5%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 15,
    title: "Ride It (Jay Sean)",
    difficulty: "Medium",
    acceptance: "59.7%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 16,
    title: "SexyBack (Justin Timberlake)",
    difficulty: "Hard",
    acceptance: "38.4%",
    status: "unsolved",
    premium: true,
  },
  {
    id: 17,
    title: "Seven Rings (Ariana Grande)",
    difficulty: "Medium",
    acceptance: "61.2%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 18,
    title: "Vibe (If I Back It Up) (Cookie Kawaii)",
    difficulty: "Easy",
    acceptance: "74.8%",
    status: "unsolved",
    premium: false,
  },
];

const topicFilters = [
  { name: "All Dances", icon: FaCode, active: true },
  { name: "Beginner", icon: FaSync, active: false },
  { name: "Intermediate", icon: FaDatabase, active: false },
  { name: "Advanced", icon: FaTerminal, active: false },
  { name: "Choreography", icon: FaSync, active: false },
  { name: "TikTok", icon: null, active: false },
];

export default function DanceProblemsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Topics");
  
  // This will automatically create user in DB when they log in
  const { user, dbUser, isLoading } = useCreateUserOnLogin();
  
  // Debug logging
  console.log("Auth0 User:", user);
  console.log("DB User:", dbUser);
  console.log("Loading:", isLoading);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "solved" ? "✓" : "";
  };

  const getStatusColor = (status: string) => {
    return status === "solved" ? "text-green-500" : "";
  };

  return (
    <div>
      {/* Header */}
      <Header />

      <div className="flex h-full">
        {/* Left Sidebar */}
        <SideBar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Cards Section */}
          <div className="p-10 bg-white border-b border-gray-200">
            <div className="grid grid-cols-3 gap-6 max-w-7xl">
              {/* Dance Premium Card */}
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl border border-orange-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">
                      Dance Time
                    </h3>
                    <p className="text-lg text-orange-700 mb-3">
                      Premium Moves
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      $119<span className="text-lg font-normal">/yr $179</span>
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>FEB 23</p>
                  </div>
                </div>
              </div>

              {/* Dance Masterclass */}
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-green-200">
                <h3 className="font-semibold text-xl mb-2 text-gray-900">
                  TikTok's Masterclass
                </h3>
                <p className="text-lg font-semibold text-green-700 mb-2">
                  Crash Course
                </p>
                <p className="text-lg text-gray-600 mb-3">Viral Choreography</p>
                <p className="text-xl font-bold text-gray-900">FREE</p>
              </div>

              {/* Dance Plans Card */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-xl mb-2 text-gray-900">
                  Dance Plans
                </h3>
                <div className="space-y-2">
                  <div className="text-lg text-blue-700">Top 100 Moves</div>
                  <div className="text-lg text-blue-700">Trending Routines</div>
                  <div className="text-lg text-blue-700">Choreography</div>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Bar */}
          <div className="px-8 py-8 bg-white border-b border-gray-200">
            <div className="flex items-center gap-8 mb-8">
              {topicCategories.map((topic) => (
                <div
                  key={topic.name}
                  className="flex items-center gap-2 text-lg"
                >
                  <span className="text-gray-900 font-medium">
                    {topic.name}
                  </span>
                  <span className="text-gray-600">{topic.count}</span>
                </div>
              ))}
              <div className="ml-auto">
                <button className="text-lg text-tiktok-red hover:text-tiktok-red/80 flex items-center gap-2">
                  ♪ Expand <FaFilter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-4">
              {topicFilters.map((filter) => (
                <Button
                  key={filter.name}
                  variant={filter.active ? "default" : "ghost"}
                  size="lg"
                  className={`flex items-center gap-2 px-5 py-3 text-lg ${
                    filter.active
                      ? "bg-tiktok-red text-white hover:bg-tiktok-red/90"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveFilter(filter.name)}
                >
                  {filter.name === "TikTok" ? (
                    <SiJavascript className="w-5 h-5" />
                  ) : (
                    filter.icon &&
                    React.createElement(filter.icon, { className: "w-5 h-5" })
                  )}
                  {filter.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Search and Controls */}
          <div className="px-8 py-6 bg-white border-b border-gray-200">
            <div className="flex items-center gap-6">
              <div className="relative flex-1 max-w-lg">
                <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  placeholder="Search dances"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-14 py-5 text-lg border-gray-300 focus:border-tiktok-red focus:ring-tiktok-red"
                />
              </div>
              <div className="flex items-center gap-5 ml-auto">
                <FaSortAmountDown className="w-7 h-7 text-gray-500" />
                <FaFilter className="w-7 h-7 text-gray-500" />
                <div className="text-lg text-gray-600">4/18 Mastered</div>
              </div>
            </div>
          </div>

          {/* Problems List */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="divide-y divide-gray-200">
              {problems.map((problem, index) => (
                <div
                  key={problem.id}
                  className="px-8 py-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-8">
                    {/* Status */}
                    <div className="w-10 text-center">
                      <span
                        className={`text-2xl font-bold ${getStatusColor(
                          problem.status
                        )}`}
                      >
                        {getStatusIcon(problem.status)}
                      </span>
                    </div>

                    {/* Problem Number and Title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg text-gray-600 font-medium">
                          {problem.id}.
                        </span>
                        <span className="font-medium text-gray-900 text-lg truncate">
                          {problem.title}
                        </span>
                      </div>
                    </div>

                    {/* Acceptance Rate */}
                    <div className="w-28 text-right">
                      <span className="text-lg text-gray-600">
                        {problem.acceptance}
                      </span>
                    </div>

                    {/* Difficulty */}
                    <div className="w-28 text-right">
                      <span
                        className={`text-lg font-medium ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty === "Medium"
                          ? "Med."
                          : problem.difficulty}
                      </span>
                    </div>

                    {/* Frequency bars */}
                    <div className="w-20 flex justify-center">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map((bar) => (
                          <div
                            key={bar}
                            className="w-1.5 h-7 bg-gray-300 rounded-sm"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Calendar */}
        <div className="w-80 h-full bg-white border-l border-gray-200">
          <div className="p-6">
            <CalendarBox />

            {/* Trending Artists */}
            <div className="mt-6">
              <h3 className="font-medium mb-5 text-gray-900 text-lg">
                Trending Artists
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-full">
                  <span className="text-base font-medium text-gray-900">
                    Doja Cat
                  </span>
                </div>
                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-full">
                  <span className="text-base font-medium text-gray-900">
                    Megan Thee Stallion
                  </span>
                </div>
                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-full">
                  <span className="text-base font-medium text-gray-900">
                    Olivia Rodrigo
                  </span>
                </div>
                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-full">
                  <span className="text-base font-medium text-gray-900">
                    Lil Nas X
                  </span>
                </div>
                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-full">
                  <span className="text-base font-medium text-gray-900">
                    The Weeknd
                  </span>
                </div>
                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-full">
                  <span className="text-base font-medium text-gray-900">
                    Dua Lipa
                  </span>
                </div>
                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-full">
                  <span className="text-base font-medium text-gray-900">
                    Travis Scott
                  </span>
                </div>
                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-full">
                  <span className="text-base font-medium text-gray-900">
                    Ariana Grande
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
