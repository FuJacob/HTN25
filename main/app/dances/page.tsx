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

const problems = [
  {
    id: 966,
    title: "The Renegade Challenge",
    difficulty: "Medium",
    acceptance: "52.1%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 1,
    title: "Two Step Sync",
    difficulty: "Easy",
    acceptance: "56.3%",
    status: "solved",
    premium: false,
  },
  {
    id: 2,
    title: "Add Beat Drops",
    difficulty: "Medium",
    acceptance: "46.9%",
    status: "solved",
    premium: false,
  },
  {
    id: 3,
    title: "Longest Dance Without Repeating Moves",
    difficulty: "Medium",
    acceptance: "37.5%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 4,
    title: "Perfect Rhythm Balance",
    difficulty: "Hard",
    acceptance: "44.7%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 5,
    title: "Mirror Choreography Sequence",
    difficulty: "Medium",
    acceptance: "36.4%",
    status: "unsolved",
    premium: false,
  },
  {
    id: 6,
    title: "Hip-Hop Wave Pattern",
    difficulty: "Medium",
    acceptance: "52.3%",
    status: "unsolved",
    premium: false,
  },
];

const topicCategories = [
  { name: "Hip-Hop", count: 1977, active: false },
  { name: "Choreography", count: 809, active: false },
  { name: "Freestyle", count: 722, active: false },
  { name: "Viral Moves", count: 609, active: false },
  { name: "Rhythm", count: 607, active: false },
  { name: "Coordination", count: 467, active: false },
];

const topicFilters = [
  { name: "All Dances", icon: FaCode, active: true },
  { name: "Beginner", icon: FaSync, active: false },
  { name: "Intermediate", icon: FaDatabase, active: false },
  { name: "Advanced", icon: FaTerminal, active: false },
  { name: "Trending", icon: FaSync, active: false },
  { name: "Viral", icon: null, active: false },
];

export default function DanceProblemsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Dances");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600";
      case "Medium":
        return "text-orange-600";
      case "Hard":
        return "text-red-600";
      default:
        return "text-tiktok-blue";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "solved" ? "✓" : "";
  };

  const getStatusColor = (status: string) => {
    return status === "solved" ? "text-green-600" : "";
  };

  return (
    <div className="flex h-full bg-tiktok-white">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Cards Section */}
        <div className="p-8 bg-tiktok-white border-b border-tiktok-black/10">
          <div className="grid grid-cols-3 gap-6 max-w-6xl">
            {/* Dance Premium Card */}
            <div className="bg-gradient-to-br from-tiktok-pink/20 to-tiktok-red/20 p-6 rounded-xl border border-tiktok-pink/30">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl mb-1 text-tiktok-black">Dance Premium</h3>
                  <p className="text-lg text-tiktok-red mb-3">
                    Get Groovy
                  </p>
                  <p className="text-2xl font-bold text-tiktok-black">
                    $99<span className="text-lg font-normal">/yr $149</span>
                  </p>
                </div>
                <div className="text-right text-sm text-tiktok-blue">
                  <p>FEB 23</p>
                </div>
              </div>
            </div>

            {/* Choreography Course */}
            <div className="bg-gradient-to-br from-tiktok-pink/20 to-tiktok-blue/20 p-6 rounded-xl border border-tiktok-pink/30">
              <h3 className="font-semibold text-lg mb-1 text-tiktok-black">
                DanceCode's Masterclass
              </h3>
              <p className="text-lg font-semibold text-tiktok-pink mb-1">
                Crash Course:
              </p>
              <p className="text-base text-tiktok-blue mb-4">
                Viral Choreography for Developers
              </p>
              <Button
                size="lg"
                className="bg-tiktok-pink hover:bg-tiktok-blue text-tiktok-white px-6 py-2"
              >
                Start Dancing
              </Button>
            </div>

            {/* Algorithm Dance Course */}
            <div className="bg-gradient-to-br from-tiktok-red/20 to-tiktok-pink/20 p-6 rounded-xl border border-tiktok-red/30">
              <h3 className="font-semibold text-lg mb-1 text-tiktok-black">
                DanceCode's Bootcamp
              </h3>
              <p className="text-lg font-semibold text-tiktok-red mb-1">
                Intensive:
              </p>
              <p className="text-base text-tiktok-pink mb-4">
                Algorithm Patterns Through Dance
              </p>
              <Button
                size="lg"
                className="bg-tiktok-red hover:bg-tiktok-pink text-tiktok-white px-6 py-2"
              >
                Start Moving
              </Button>
            </div>
          </div>
        </div>

        {/* Topics Bar */}
        <div className="px-6 py-6 bg-tiktok-white border-b border-tiktok-black/10">
          <div className="flex items-center gap-6 mb-8">
            {topicCategories.map((topic) => (
              <div
                key={topic.name}
                className="flex items-center gap-2 text-base"
              >
                <span className="text-tiktok-black font-medium">
                  {topic.name}
                </span>
                <span className="text-tiktok-blue">{topic.count}</span>
              </div>
            ))}
            <div className="ml-auto">
              <button className="text-base text-tiktok-red hover:text-tiktok-pink flex items-center gap-2">
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
                className="flex items-center gap-3 px-4 py-2 text-base"
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
        <div className="px-6 py-6 bg-tiktok-white border-b border-tiktok-black/10">
          <div className="flex items-center gap-6">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tiktok-blue w-5 h-5" />
              <Input
                placeholder="Search dance problems"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 py-3 text-base border-tiktok-black/20 text-tiktok-black placeholder-tiktok-blue"
              />
            </div>
            <div className="flex items-center gap-4">
              <FaSortAmountDown className="w-5 h-5 text-tiktok-blue" />
              <FaFilter className="w-5 h-5 text-tiktok-blue" />
              <div className="text-base text-tiktok-black">
                191/3682 Solved
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-auto bg-tiktok-white">
          <div className="divide-y divide-tiktok-black/5">
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
                      <span className="text-base text-tiktok-blue font-medium">
                        {problem.id}.
                      </span>
                      <span className="font-medium text-tiktok-black text-base truncate">
                        {problem.title}
                      </span>
                    </div>
                  </div>

                  {/* Acceptance Rate */}
                  <div className="w-20 text-right">
                    <span className="text-base text-tiktok-blue">
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
                          className="w-1 h-4 bg-tiktok-pink/40 rounded-sm"
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
      <div className="w-80 h-full bg-tiktok-white border-l border-tiktok-black/10">
        <div className="p-4">
          <CalendarBox />

          {/* Trending Dance Challenges */}
          <div className="mt-6">
            <h3 className="font-medium mb-3 text-tiktok-black">
              Trending Dance Challenges
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded border border-gray-200">
                <span className="text-sm font-medium text-tiktok-black">Renegade</span>
                <span className="text-xs bg-tiktok-pink text-tiktok-white px-2 py-1 rounded">
                  9876
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-red/10 rounded border border-tiktok-red/20">
                <span className="text-sm font-medium text-tiktok-black">WAP Dance</span>
                <span className="text-xs bg-tiktok-red text-tiktok-white px-2 py-1 rounded">
                  8432
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-pink/10 rounded border border-tiktok-pink/20">
                <span className="text-sm font-medium text-tiktok-black">Corvette</span>
                <span className="text-xs bg-tiktok-pink text-tiktok-white px-2 py-1 rounded">
                  7654
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-blue/10 rounded border border-tiktok-blue/20">
                <span className="text-sm font-medium text-tiktok-black">Savage</span>
                <span className="text-xs bg-tiktok-blue text-tiktok-white px-2 py-1 rounded">
                  7123
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded border border-gray-200">
                <span className="text-sm font-medium text-tiktok-black">Woah</span>
                <span className="text-xs bg-tiktok-pink text-tiktok-white px-2 py-1 rounded">
                  6789
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-red/10 rounded border border-tiktok-red/20">
                <span className="text-sm font-medium text-tiktok-black">Hit Or Miss</span>
                <span className="text-xs bg-tiktok-red text-tiktok-white px-2 py-1 rounded">
                  6234
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-pink/10 rounded border border-tiktok-pink/20">
                <span className="text-sm font-medium text-tiktok-black">Buss It</span>
                <span className="text-xs bg-tiktok-pink text-tiktok-white px-2 py-1 rounded">
                  5987
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-blue/10 rounded border border-tiktok-blue/20">
                <span className="text-sm font-medium text-tiktok-black">Git Up</span>
                <span className="text-xs bg-tiktok-blue text-tiktok-white px-2 py-1 rounded">
                  5642
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded border border-gray-200">
                <span className="text-sm font-medium text-tiktok-black">Lottery</span>
                <span className="text-xs bg-tiktok-pink text-tiktok-white px-2 py-1 rounded">
                  5234
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-red/10 rounded border border-tiktok-red/20">
                <span className="text-sm font-medium text-tiktok-black">Cannibal</span>
                <span className="text-xs bg-tiktok-red text-tiktok-white px-2 py-1 rounded">
                  4876
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-pink/10 rounded border border-tiktok-pink/20">
                <span className="text-sm font-medium text-tiktok-black">Sway</span>
                <span className="text-xs bg-tiktok-pink text-tiktok-white px-2 py-1 rounded">
                  4521
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-blue/10 rounded border border-tiktok-blue/20">
                <span className="text-sm font-medium text-tiktok-black">Flip Switch</span>
                <span className="text-xs bg-tiktok-blue text-tiktok-white px-2 py-1 rounded">
                  4123
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded border border-gray-200">
                <span className="text-sm font-medium text-tiktok-black">Juju on Beat</span>
                <span className="text-xs bg-tiktok-pink text-tiktok-white px-2 py-1 rounded">
                  3987
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-red/10 rounded border border-tiktok-red/20">
                <span className="text-sm font-medium text-tiktok-black">Say So</span>
                <span className="text-xs bg-tiktok-red text-tiktok-white px-2 py-1 rounded">
                  3654
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-pink/10 rounded border border-tiktok-pink/20">
                <span className="text-sm font-medium text-tiktok-black">Orange Justice</span>
                <span className="text-xs bg-tiktok-pink text-tiktok-white px-2 py-1 rounded">
                  3321
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-tiktok-blue/10 rounded border border-tiktok-blue/20">
                <span className="text-sm font-medium text-tiktok-black">The Hype</span>
                <span className="text-xs bg-tiktok-blue text-tiktok-white px-2 py-1 rounded">
                  2987
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
