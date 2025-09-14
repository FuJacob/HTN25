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
  {
    id: "1",
    number: 1,
    title: "Adderall",
    difficulty: "Medium",
    acceptance: "68%",
    status: "unsolved",
    genre: "Hip Hop",
    premium: false,
    video: "Adderall.mp4",
  },
  {
    id: "2",
    number: 2,
    title: "Apple",
    difficulty: "Easy",
    acceptance: "89%",
    status: "solved",
    genre: "Pop",
    premium: false,
    video: "Apple.mp4",
  },
  {
    id: "3",
    number: 3,
    title: "Blinding Lights",
    difficulty: "Hard",
    acceptance: "42%",
    status: "unsolved",
    genre: "Pop",
    premium: false,
    video: "Blinding-Lights.mp4",
  },
  {
    id: "4",
    number: 4,
    title: "Cannibal",
    difficulty: "Medium",
    acceptance: "71%",
    status: "unsolved",
    genre: "Hip Hop",
    premium: false,
    video: "Cannibal.mp4",
  },
  {
    id: "5",
    number: 5,
    title: "Chicken Banana Dance",
    difficulty: "Easy",
    acceptance: "92%",
    status: "unsolved",
    genre: "Freestyle",
    premium: false,
    video: "Chicken-Banana-Dance.mp4",
  },
  {
    id: "6",
    number: 6,
    title: "Don't Start Now",
    difficulty: "Medium",
    acceptance: "64%",
    status: "solved",
    genre: "Pop",
    premium: false,
    video: "Don't-Start-Now.mp4",
  },
  {
    id: "7",
    number: 7,
    title: "Emergency Budots",
    difficulty: "Hard",
    acceptance: "38%",
    status: "unsolved",
    genre: "Hip Hop",
    premium: false,
    video: "Emergency-Budots.mp4",
  },
  {
    id: "8",
    number: 8,
    title: "Git Up Challenge",
    difficulty: "Easy",
    acceptance: "85%",
    status: "solved",
    genre: "Freestyle",
    premium: false,
    video: "Git-Up-Challenge.mp4",
  },
  {
    id: "9",
    number: 9,
    title: "Give It To Me",
    difficulty: "Hard",
    acceptance: "29%",
    status: "unsolved",
    genre: "Hip Hop",
    premium: false,
    video: "Give-it-to-Me.mp4",
  },
  {
    id: "10",
    number: 10,
    title: "I'm Moving Too Fast",
    difficulty: "Medium",
    acceptance: "73%",
    status: "unsolved",
    genre: "Pop",
    premium: false,
    video: "I'm-Moving-Too-Fast.mp4",
  },
  {
    id: "11",
    number: 11,
    title: "Illit Jellyous",
    difficulty: "Easy",
    acceptance: "91%",
    status: "unsolved",
    genre: "K-Pop",
    premium: false,
    video: "Illit-Jellyous.mp4",
  },
  {
    id: "12",
    number: 12,
    title: "Last Christmas",
    difficulty: "Medium",
    acceptance: "67%",
    status: "unsolved",
    genre: "Pop",
    premium: false,
    video: "Last-Christmas.mp4",
  },
  {
    id: "13",
    number: 13,
    title: "Laxed",
    difficulty: "Hard",
    acceptance: "35%",
    status: "solved",
    genre: "Hip Hop",
    premium: false,
    video: "Laxed.mp4",
  },
  {
    id: "14",
    number: 14,
    title: "Man Child",
    difficulty: "Easy",
    acceptance: "88%",
    status: "unsolved",
    genre: "Freestyle",
    premium: false,
    video: "Man-Child.mp4",
  },
  {
    id: "15",
    number: 15,
    title: "Maps",
    difficulty: "Medium",
    acceptance: "69%",
    status: "unsolved",
    genre: "Pop",
    premium: false,
    video: "Maps.mp4",
  },
  {
    id: "16",
    number: 16,
    title: "Number One Baby",
    difficulty: "Hard",
    acceptance: "44%",
    status: "unsolved",
    genre: "K-Pop",
    premium: false,
    video: "Number-One-Baby.mp4",
  },
  {
    id: "17",
    number: 17,
    title: "Out West",
    difficulty: "Easy",
    acceptance: "87%",
    status: "unsolved",
    genre: "Hip Hop",
    premium: false,
    video: "Out-West.mp4",
  },
  {
    id: "18",
    number: 18,
    title: "Renegade",
    difficulty: "Hard",
    acceptance: "31%",
    status: "unsolved",
    genre: "Hip Hop",
    premium: false,
    video: "Renegade.mp4",
  },
  {
    id: "19",
    number: 19,
    title: "Supalonely",
    difficulty: "Medium",
    acceptance: "76%",
    status: "solved",
    genre: "Pop",
    premium: false,
    video: "Supalonely.mp4",
  },
  {
    id: "20",
    number: 20,
    title: "Vibe",
    difficulty: "Easy",
    acceptance: "83%",
    status: "unsolved",
    genre: "Freestyle",
    premium: false,
    video: "Vibe.mp4",
  },
  {
    id: "21",
    number: 21,
    title: "Wednesday",
    difficulty: "Medium",
    acceptance: "72%",
    status: "solved",
    genre: "Pop",
    premium: false,
    video: "Wednesday.mp4",
  },
  {
    id: "22",
    number: 22,
    title: "Slide",
    difficulty: "TBD",
    acceptance: "TBD",
    status: "unsolved",
    genre: "None",
    premium: false,
    video: "Slide.mp4",
  },
];

const topicFilters = [
  { name: "All Dances" },
  { name: "Beginner" },
  { name: "Intermediate" },
  { name: "Advanced" },
];

export default function DanceProblemsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Dances");
  const [activeGenre, setActiveGenre] = useState("All Genres");
  const [showUploadedOnly, setShowUploadedOnly] = useState(false);

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
    // Hide "Slide" dance unless upload button was clicked
    if (problem.title === "Slide" && !showUploadedOnly) {
      return false;
    }

    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesGenre =
      activeGenre === "All Genres" || problem.genre === activeGenre;

    const matchesSkillLevel =
      activeFilter === "All Dances" ||
      (activeFilter === "Beginner" && problem.difficulty === "Easy") ||
      (activeFilter === "Intermediate" && problem.difficulty === "Medium") ||
      (activeFilter === "Advanced" && problem.difficulty === "Hard");

    return matchesSearch && matchesGenre && matchesSkillLevel;
  });

  // Calculate mastered count
  const masteredCount = problems.filter((p) => p.status === "solved").length;
  const totalCount = problems.length;

  return (
    <div>
      {/* Header */}
      <Header />

      <div className="flex h-full">
        {/* Left Sidebar */}
        <SideBar onUploadClick={() => setShowUploadedOnly(true)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Topics Bar */}
          <div className="px-8 py-8 bg-white border-b border-gray-200">
            <div className="flex items-center gap-8 mb-8">
              {topicCategories.map((topic) => (
                <div
                  key={topic.name}
                  className={`flex items-center gap-2 text-lg cursor-pointer hover:text-tiktok-red transition-colors ${
                    activeGenre === topic.name
                      ? "text-tiktok-red font-semibold"
                      : "text-gray-900"
                  }`}
                  onClick={() => {
                    setActiveGenre(topic.name);
                    setShowUploadedOnly(false); // Reset upload filter when changing genre
                  }}
                >
                  <span className="font-medium">{topic.name}</span>
                </div>
              ))}
              <div className="ml-auto">
                <button className="text-lg text-tiktok-red hover:text-tiktok-red/80 flex items-center gap-2">
                  <FaFilter className="w-5 h-5" />
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
                  className={`flex items-center gap-2 px-5 py-3 text-lg cursor-pointer ${
                    activeFilter === filter.name
                      ? "bg-tiktok-red text-white hover:bg-tiktok-red/90"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveFilter(filter.name);
                    setShowUploadedOnly(false); // Reset upload filter when changing difficulty filter
                  }}
                >
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
                <div className="text-lg text-gray-600">
                  {masteredCount}/{totalCount} Mastered
                </div>
              </div>
            </div>
          </div>

          {/* Problems List */}
          <div className="flex-1 overflow-auto bg-white">
            {/* Table Headers */}
            <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <div className="flex items-center">
                {/* Number Header */}
                <div className="w-8 text-center mr-4">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    #
                  </span>
                </div>

                {/* Preview Header */}
                <div className="w-12 text-center mr-4">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide"></span>
                </div>

                {/* Title Header */}
                <div className="flex-1 min-w-0 mr-6">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide"></span>
                </div>

                {/* Status Header */}
                <div className="w-16 text-center mr-2">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                  </span>
                </div>

                {/* Pass % Header */}
                <div className="w-20 text-right mr-2">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Pass %
                  </span>
                </div>

                {/* Difficulty Header */}
                <div className="w-28 text-right">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Difficulty
                  </span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredProblems.map((problem, index) => (
                <Link key={problem.id} href={`/dance/${problem.id}`}>
                  <div className="px-8 py-6 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      {/* Problem Number */}
                      <div className="w-8 text-center mr-4">
                        <span className="text-lg text-gray-600 font-medium">
                          {problem.number}
                        </span>
                      </div>

                      {/* Dance Preview GIF */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 mr-4">
                        <img
                          src={`/gifs/${problem.video.replace(".mp4", ".gif")}`}
                          alt={`${problem.title} preview`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0 mr-6">
                        <span className="font-medium text-gray-900 text-lg truncate">
                          {problem.title}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="w-16 text-center mr-2">
                        <span
                          className={`text-xl font-bold ${getStatusColor(
                            problem.status
                          )}`}
                        >
                          {getStatusIcon(problem.status)}
                        </span>
                      </div>

                      {/* Pass % */}
                      <div className="w-20 text-right mr-2">
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
                            ? "Medium"
                            : problem.difficulty}
                        </span>
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
                Trending Dances
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["Apple", "Illit Jellyous", "Renegade", "Man Child"].map(
                  (artist) => (
                    <div
                      key={artist}
                      className="flex items-center justify-center p-3 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        setSearch(artist);
                      }}
                    >
                      <span className="text-base font-medium text-gray-900 text-center">
                        {artist}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
