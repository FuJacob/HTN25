"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaFilter,
  FaCode,
  FaDatabase,
  FaTerminal,
  FaSync,
} from "react-icons/fa";
import { Input } from "@/shadcn-components/ui/input";
import { Button } from "@/shadcn-components/ui/button";
import CalendarBox from "../components/Calendar";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

const topicCategories = [
  { name: "All Genres" },
  { name: "Hip Hop" },
  { name: "Pop" },
  { name: "K-Pop" },
  { name: "Freestyle" },
];

const problems = [
  { id: "1", number: 1, title: "Adderall", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Adderall.mp4" },
  { id: "2", number: 2, title: "Apple", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Apple.mp4" },
  { id: "3", number: 3, title: "Blinding Lights", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Blinding-Lights.mp4" },
  { id: "4", number: 4, title: "Cannibal", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Cannibal.mp4" },
  { id: "5", number: 5, title: "Chicken Banana Dance", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Chicken-Banana-Dance.mp4" },
  { id: "6", number: 6, title: "Don't Start Now", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Don't-Start-Now.mp4" },
  { id: "7", number: 7, title: "Emergency Budots", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Emergency-Budots.mp4" },
  { id: "8", number: 8, title: "Git Up Challenge", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Git-Up-Challenge.mp4" },
  { id: "9", number: 9, title: "Give It To Me", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Give-it-to-Me.mp4" },
  { id: "10", number: 10, title: "I'm Moving Too Fast", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "I'm-Moving-Too-Fast.mp4" },
  { id: "11", number: 11, title: "Illit Jellyous", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Illit-Jellyous.mp4" },
  { id: "12", number: 12, title: "Last Christmas", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Last-Christmas.mp4" },
  { id: "13", number: 13, title: "Laxed", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Laxed.mp4" },
  { id: "14", number: 14, title: "Man Child", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Man-Child.mp4" },
  { id: "15", number: 15, title: "Maps", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Maps.mp4" },
  { id: "16", number: 16, title: "Number One Baby", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Number-One-Baby.mp4" },
  { id: "17", number: 17, title: "Out West", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Out-West.mp4" },
  { id: "18", number: 18, title: "Renegade", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Renegade.mp4" },
  { id: "19", number: 19, title: "Supalonely", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Supalonely.mp4" },
  { id: "20", number: 20, title: "Vibe", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Vibe.mp4" },
  { id: "21", number: 21, title: "Wednesday", difficulty: "Easy", acceptance: "75%", status: "unsolved", premium: false, video: "Wednesday.mp4" },
];

const topicFilters = [
  { name: "All Dances", icon: FaCode },
  { name: "Beginner", icon: FaSync },
  { name: "Intermediate", icon: FaDatabase },
  { name: "Advanced", icon: FaTerminal },
];

export default function DanceProblemsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Dances");
  const [activeGenre, setActiveGenre] = useState("All Genres");

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

  const handlePremiumClick = () => {
    // Navigate to premium subscription page
    router.push("/premium");
  };

  const handleMasterclassClick = () => {
    // Navigate to free masterclass
    router.push("/masterclass");
  };

  const handleDancePlansClick = () => {
    // Navigate to dance plans overview
    router.push("/plans");
  };

  const handleDanceClick = (danceId: number) => {
    router.push(`/dance/${danceId}`);
  };

  // Filter logic
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = activeGenre === "All Genres" || problem.genre === activeGenre;

    const matchesSkillLevel = activeFilter === "All Dances" ||
      (activeFilter === "Beginner" && problem.difficulty === "Easy") ||
      (activeFilter === "Intermediate" && problem.difficulty === "Medium") ||
      (activeFilter === "Advanced" && problem.difficulty === "Hard");

    return matchesSearch && matchesGenre && matchesSkillLevel;
  });

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
              <div
                className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl border border-orange-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={handlePremiumClick}
              >
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
              <div
                className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-green-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={handleMasterclassClick}
              >
                <h3 className="font-semibold text-xl mb-2 text-gray-900">
                  TikTok&apos;s Masterclass
                </h3>
                <p className="text-lg font-semibold text-green-700 mb-2">
                  Crash Course
                </p>
                <p className="text-lg text-gray-600 mb-3">Viral Choreography</p>
                <p className="text-xl font-bold text-gray-900">FREE</p>
              </div>

              {/* Dance Plans Card */}
              <div
                className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={handleDancePlansClick}
              >
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
                  className={`flex items-center gap-2 text-lg cursor-pointer hover:text-tiktok-red transition-colors ${
                    activeGenre === topic.name ? "text-tiktok-red font-semibold" : "text-gray-900"
                  }`}
                  onClick={() => setActiveGenre(topic.name)}
                >
                  <span className="font-medium">
                    {topic.name}
                  </span>
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
                  variant={activeFilter === filter.name ? "default" : "ghost"}
                  size="lg"
                  className={`flex items-center gap-2 px-5 py-3 text-lg ${
                    activeFilter === filter.name
                      ? "bg-tiktok-red text-white hover:bg-tiktok-red/90"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveFilter(filter.name)}
                >
                  {filter.icon &&
                    React.createElement(filter.icon, { className: "w-5 h-5" })
                  }
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
                <div className="text-lg text-gray-600">4/18 Mastered</div>
              </div>
            </div>
          </div>

          {/* Problems List */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="divide-y divide-gray-200">
            {problems.map((problem, index) => (
              <Link key={problem.id} href={`/dance/${problem.id}`}>
                <div className="px-8 py-6 hover:bg-gray-50 cursor-pointer transition-colors">
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
                          {problem.number}.
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
              </Link>
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
                {[
                  "Doja Cat",
                  "Megan Thee Stallion",
                  "Olivia Rodrigo",
                  "Lil Nas X",
                  "The Weeknd",
                  "Dua Lipa",
                  "Travis Scott",
                  "Ariana Grande",
                ].map((artist) => (
                  <div
                    key={artist}
                    className="flex items-center justify-center p-3 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSearch(artist);
                      setActiveGenre("Pop");
                    }}
                  >
                    <span className="text-base font-medium text-gray-900 text-center">
                      {artist}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
