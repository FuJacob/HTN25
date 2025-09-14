"use client";
import React, { useState } from "react";
import { 
  FaSearch, 
  FaSortAmountDown,
  FaFilter,
  FaCode,
  FaDatabase,
  FaTerminal,
  FaSync
} from "react-icons/fa";
import { SiJavascript } from "react-icons/si";
import { Badge } from "@/shadcn-components/ui/badge";
import { Input } from "@/shadcn-components/ui/input";
import { Button } from "@/shadcn-components/ui/button";
import CalendarBox from "../components/Calendar";

const problems = [
  {
    id: 966,
    title: "Vowel Spellchecker",
    difficulty: "Medium",
    acceptance: "52.1%",
    status: "unsolved",
    premium: false
  },
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy", 
    acceptance: "56.3%",
    status: "solved",
    premium: false
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    acceptance: "46.9%",
    status: "solved", 
    premium: false
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "37.5%",
    status: "unsolved",
    premium: false
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "44.7%",
    status: "unsolved",
    premium: false
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    acceptance: "36.4%",
    status: "unsolved",
    premium: false
  },
  {
    id: 6,
    title: "Zigzag Conversion",
    difficulty: "Medium", 
    acceptance: "52.3%",
    status: "unsolved",
    premium: false
  }
];

const topicCategories = [
  { name: "Array", count: 1977, active: false },
  { name: "String", count: 809, active: false },
  { name: "Hash Table", count: 722, active: false },
  { name: "Dynamic Programming", count: 609, active: false },
  { name: "Math", count: 607, active: false },
  { name: "Sorting", count: 467, active: false }
];

const topicFilters = [
  { name: "All Topics", icon: FaCode, active: true },
  { name: "Algorithms", icon: FaSync, active: false },
  { name: "Database", icon: FaDatabase, active: false },
  { name: "Shell", icon: FaTerminal, active: false },
  { name: "Concurrency", icon: FaSync, active: false },
  { name: "JavaScript", icon: null, active: false }
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
        <div className="p-6 bg-background border-b border-border">
          <div className="grid grid-cols-3 gap-4 max-w-4xl">
            {/* LeetCode Premium Card */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">School Time</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Leet Time</p>
                  <p className="text-xl font-bold mt-2">$119<span className="text-sm font-normal">/yr $179</span></p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>FEB 23</p>
                </div>
              </div>
            </div>

            {/* System Design Course */}
            <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border">
              <h3 className="font-semibold">LeetCode's Interview</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Crash Course:</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">System Design for Interviews and Beyond</p>
              <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                Start Learning
              </Button>
            </div>

            {/* Data Structures Course */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border">
              <h3 className="font-semibold">LeetCode's Interview</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Crash Course:</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Data Structures and Algorithms</p>
              <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Topics Bar */}
        <div className="px-6 py-4 bg-background border-b border-border">
          <div className="flex items-center gap-4 mb-4">
            {topicCategories.map((topic) => (
              <div key={topic.name} className="flex items-center gap-2 text-sm">
                <span className="text-foreground">{topic.name}</span>
                <span className="text-muted-foreground">{topic.count}</span>
              </div>
            ))}
            <div className="ml-auto">
              <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                C Expand <FaFilter className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {topicFilters.map((filter) => (
              <Button
                key={filter.name}
                variant={filter.active ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setActiveFilter(filter.name)}
              >
                {filter.name === "JavaScript" ? (
                  <SiJavascript className="w-3 h-3" />
                ) : (
                  filter.icon && React.createElement(filter.icon, { className: "w-3 h-3" })
                )}
                {filter.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="px-6 py-4 bg-background border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search questions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaSortAmountDown className="w-4 h-4 text-muted-foreground" />
              <FaFilter className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                191/3682 Solved
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-auto">
          <div className="divide-y divide-border">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                className="px-6 py-3 hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Status */}
                  <div className="w-6 text-center">
                    <span className={`font-bold ${getStatusColor(problem.status)}`}>
                      {getStatusIcon(problem.status)}
                    </span>
                  </div>

                  {/* Problem Number and Title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{problem.id}.</span>
                      <span className="font-medium text-foreground truncate">{problem.title}</span>
                    </div>
                  </div>

                  {/* Acceptance Rate */}
                  <div className="w-16 text-right">
                    <span className="text-sm text-muted-foreground">{problem.acceptance}</span>
                  </div>

                  {/* Difficulty */}
                  <div className="w-16 text-right">
                    <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Frequency bars placeholder */}
                  <div className="w-12 flex justify-center">
                    <div className="flex gap-px">
                      {[1,2,3,4,5].map((bar) => (
                        <div key={bar} className="w-1 h-3 bg-muted rounded-sm"></div>
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
      <div className="w-80 h-full bg-background border-l border-border">
        <div className="p-4">
          <CalendarBox />
          
          {/* Trending Companies */}
          <div className="mt-6">
            <h3 className="font-medium mb-3 text-foreground">Trending Companies</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 bg-accent rounded">
                <span className="text-sm font-medium">Meta</span>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">1301</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent rounded">
                <span className="text-sm font-medium">Google</span>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">2108</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent rounded">
                <span className="text-sm font-medium">Uber</span>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">474</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent rounded">
                <span className="text-sm font-medium">Amazon</span>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">1890</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
