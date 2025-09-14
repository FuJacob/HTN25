"use client";
import React, { useState } from "react";
import { FaPlay, FaCheckCircle, FaClock } from "react-icons/fa";
import Link from "next/link";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "56.3%",
    status: "solved",
    dance: "Renegade",
    description:
      "Learn the iconic arm-swinging dance while solving the classic two-pointer problem.",
    thumbnail: "/dance-thumbnails/renegade.jpg",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    acceptance: "46.9%",
    status: "attempted",
    dance: "WAP Dance",
    description:
      "Master linked list manipulation with this popular choreography.",
    thumbnail: "/dance-thumbnails/wap.jpg",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "37.5%",
    status: "unsolved",
    dance: "Savage",
    description:
      "Sliding window technique meets Megan Thee Stallion's hit moves.",
    thumbnail: "/dance-thumbnails/savage.jpg",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "44.7%",
    status: "unsolved",
    dance: "Corvette",
    description:
      "Binary search complexity with smooth Tion Wayne choreography.",
    thumbnail: "/dance-thumbnails/corvette.jpg",
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    acceptance: "36.4%",
    status: "solved",
    dance: "Woah",
    description:
      "Dynamic programming meets the simple arm-crossing viral dance.",
    thumbnail: "/dance-thumbnails/woah.jpg",
  },
  {
    id: 6,
    title: "Zigzag Conversion",
    difficulty: "Medium",
    acceptance: "52.3%",
    status: "unsolved",
    dance: "Hit or Miss",
    description: "String manipulation with classic pointing choreography.",
    thumbnail: "/dance-thumbnails/hitormiss.jpg",
  },
  {
    id: 7,
    title: "Reverse Integer",
    difficulty: "Medium",
    acceptance: "28.1%",
    status: "attempted",
    dance: "Buss It",
    description: "Integer overflow handling with Erica Banks' challenge moves.",
    thumbnail: "/dance-thumbnails/bussit.jpg",
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    acceptance: "17.8%",
    status: "unsolved",
    dance: "Git Up",
    description: "State machine parsing with line dance fundamentals.",
    thumbnail: "/dance-thumbnails/gitup.jpg",
  },
  {
    id: 9,
    title: "Palindrome Number",
    difficulty: "Easy",
    acceptance: "56.8%",
    status: "solved",
    dance: "Lottery",
    description: "Number theory basics with K Camp's viral choreography.",
    thumbnail: "/dance-thumbnails/lottery.jpg",
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    acceptance: "28.9%",
    status: "unsolved",
    dance: "Say So",
    description: "Complex regex with Doja Cat's smooth moves.",
    thumbnail: "/dance-thumbnails/sayso.jpg",
  },
  {
    id: 11,
    title: "Container With Most Water",
    difficulty: "Medium",
    acceptance: "54.7%",
    status: "attempted",
    dance: "Cannibal",
    description: "Two pointer optimization with Tate McRae's choreography.",
    thumbnail: "/dance-thumbnails/cannibal.jpg",
  },
  {
    id: 12,
    title: "Integer to Roman",
    difficulty: "Medium",
    acceptance: "62.1%",
    status: "unsolved",
    dance: "Sway",
    description: "Greedy algorithm approach with Michael Bublé inspired moves.",
    thumbnail: "/dance-thumbnails/sway.jpg",
  },
];

export default function DancesPageNew() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "Medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Hard":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <FaCheckCircle className="w-5 h-5 text-green-600" />;
      case "attempted":
        return <FaClock className="w-5 h-5 text-orange-500" />;
      default:
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Dance Problems</h1>
        <p className="text-gray-600 mt-2">
          Learn algorithms through viral TikTok dances
        </p>
      </div>

      {/* Problems List */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              href={`/problem/${problem.id}`}
              className="block"
            >
              <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 p-6">
                <div className="flex items-center gap-6">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={problem.thumbnail}
                        alt={problem.dance}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/dance-thumbnails/placeholder.jpg";
                        }}
                      />
                    </div>
                  </div>

                  {/* Problem Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(problem.status)}
                        <span className="text-lg font-semibold text-gray-900">
                          {problem.id}. {problem.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">
                          {problem.acceptance}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h3 className="text-lg font-medium text-tiktok-red mb-1">
                        🕺 {problem.dance}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {problem.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaPlay className="w-3 h-3" />
                        <span>Learn & Code</span>
                      </div>
                      <div className="text-tiktok-red font-medium text-sm hover:text-tiktok-red/80 transition-colors">
                        Start Challenge →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
