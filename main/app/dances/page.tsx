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
} from "react-icons/fa";
import { SiJavascript } from "react-icons/si";
import { Badge } from "@/shadcn-components/ui/badge";
import { Input } from "@/shadcn-components/ui/input";
import { Button } from "@/shadcn-components/ui/button";
import CalendarBox from "../components/Calendar";

const videoFiles = [
  "Adderall.mp4",
  "Apple.mp4",
  "Blinding-Lights.mp4",
  "Cannibal.mp4",
  "Chicken-Banana-Dance.mp4",
  "Don't-Start-Now.mp4",
  "Emergency-Budots.mp4",
  "Git-Up-Challenge.mp4",
  "Give-it-to-Me.mp4",
  "I'm-Moving-Too-Fast.mp4",
  "Illit-Jellyous.mp4",
  "Last-Christmas.mp4",
  "Laxed.mp4",
  "Man-Child.mp4",
  "Maps.mp4",
  "Number-One-Baby.mp4",
  "Out-West.mp4",
  "Renegade.mp4",
  "Supalonely.mp4",
  "Vibe.mp4",
  "Wednesday.mp4",
];

function formatVideoTitle(filename: string) {
  // Remove extension
  let name = filename.replace(/\.mp4$/, "");
  // Replace dashes with spaces
  name = name.replace(/-/g, " ");
  // Capitalize each word
  name = name.replace(/\b\w/g, (c) => c.toUpperCase());
  return name;
}

const problems = videoFiles.map((file, idx) => ({
  id: idx + 1,
  title: formatVideoTitle(file),
  difficulty: ["Easy", "Medium", "Hard"][idx % 3],
  acceptance: `${(30 + idx * 2.5) % 70 + 30}%`,
  status: idx % 2 === 0 ? "solved" : "unsolved",
  premium: false,
}));

const topicCategories = [
  { name: "Array", count: 1977, active: false },
  { name: "String", count: 809, active: false },
  { name: "Hash Table", count: 722, active: false },
  { name: "Dynamic Programming", count: 609, active: false },
  { name: "Math", count: 607, active: false },
  { name: "Sorting", count: 467, active: false },
];

const topicFilters = [
  { name: "All Topics", icon: FaCode, active: true },
  { name: "Algorithms", icon: FaSync, active: false },
  { name: "Database", icon: FaDatabase, active: false },
  { name: "Shell", icon: FaTerminal, active: false },
  { name: "Concurrency", icon: FaSync, active: false },
  { name: "JavaScript", icon: null, active: false },
];

export default function DanceProblemsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Topics");

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
    <div className="flex h-full">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Cards Section */}
        <div className="p-8 bg-white border-b border-gray-200">
          <div className="grid grid-cols-3 gap-6 max-w-6xl">
            {/* LeetCode Premium Card */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl border border-orange-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl mb-1 text-gray-900">School Time</h3>
                  <p className="text-lg text-orange-700 mb-3">
                    Leet Time
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

            {/* System Design Course */}
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-green-200">
              <h3 className="font-semibold text-lg mb-1 text-gray-900">
                LeetCode's Interview
              </h3>
              <p className="text-lg font-semibold text-green-700 mb-1">
                Crash Course:
              </p>
              <p className="text-base text-green-600 mb-4">
                System Design for Interviews and Beyond
              </p>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              >
                Start Learning
              </Button>
            </div>

            {/* Data Structures Course */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-lg mb-1 text-gray-900">
                LeetCode's Interview
              </h3>
              <p className="text-lg font-semibold text-purple-700 mb-1">
                Crash Course:
              </p>
              <p className="text-base text-purple-600 mb-4">
                Data Structures and Algorithms
              </p>
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              >
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Topics Bar */}
        <div className="px-6 py-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-6 mb-8">
            {topicCategories.map((topic) => (
              <div
                key={topic.name}
                className="flex items-center gap-2 text-base"
              >
                <span className="text-gray-900 font-medium">
                  {topic.name}
                </span>
                <span className="text-gray-600">{topic.count}</span>
              </div>
            ))}
            <div className="ml-auto">
              <button className="text-base text-tiktok-red hover:text-tiktok-red/80 flex items-center gap-2">
                C Expand <FaFilter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            {topicFilters.map((filter) => (
              <Button
                key={filter.name}
                variant={filter.active ? "default" : "ghost"}
                size="lg"
                className={`flex items-center gap-3 px-4 py-2 text-base ${
                  filter.active 
                    ? "bg-tiktok-red text-white hover:bg-tiktok-red/90" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveFilter(filter.name)}
              >
                {filter.name === "JavaScript" ? (
                  <SiJavascript className="w-4 h-4" />
                ) : (
                  filter.icon &&
                  React.createElement(filter.icon, { className: "w-4 h-4" })
                )}
                {filter.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="px-6 py-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search questions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 py-3 text-base border-gray-300 focus:border-tiktok-red focus:ring-tiktok-red"
              />
            </div>
            <div className="flex items-center gap-4">
              <FaSortAmountDown className="w-5 h-5 text-gray-500" />
              <FaFilter className="w-5 h-5 text-gray-500" />
              <div className="text-base text-gray-600">
                191/3682 Solved
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="divide-y divide-gray-200">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-6">
                  {/* Status */}
                  <div className="w-8 text-center">
                    <span
                      className={`text-xl font-bold ${getStatusColor(
                        problem.status
                      )}`}
                    >
                      {getStatusIcon(problem.status)}
                    </span>
                  </div>

                  {/* Problem Number and Title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-base text-gray-600 font-medium">
                        {problem.id}.
                      </span>
                      <span className="font-medium text-gray-900 text-base truncate">
                        {problem.title}
                      </span>
                    </div>
                  </div>

                  {/* Acceptance Rate */}
                  <div className="w-20 text-right">
                    <span className="text-base text-gray-600">
                      {problem.acceptance}
                    </span>
                  </div>

                  {/* Difficulty */}
                  <div className="w-20 text-right">
                    <span
                      className={`text-base font-medium ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty === "Medium"
                        ? "Med."
                        : problem.difficulty}
                    </span>
                  </div>

                  {/* Frequency bars */}
                  <div className="w-16 flex justify-center">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6].map((bar) => (
                        <div
                          key={bar}
                          className="w-1 h-4 bg-gray-300 rounded-sm"
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
        <div className="p-4">
          <CalendarBox />

          {/* Trending Companies */}
          <div className="mt-6">
            <h3 className="font-medium mb-3 text-gray-900">
              Trending Companies
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <span className="text-sm font-medium text-gray-900">Meta</span>
                <span className="text-xs bg-tiktok-red text-white px-2 py-1 rounded">
                  1301
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <span className="text-sm font-medium text-gray-900">Google</span>
                <span className="text-xs bg-tiktok-red text-white px-2 py-1 rounded">
                  2108
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <span className="text-sm font-medium text-gray-900">Uber</span>
                <span className="text-xs bg-tiktok-red text-white px-2 py-1 rounded">
                  474
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <span className="text-sm font-medium text-gray-900">Amazon</span>
                <span className="text-xs bg-tiktok-red text-white px-2 py-1 rounded">
                  1890
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
