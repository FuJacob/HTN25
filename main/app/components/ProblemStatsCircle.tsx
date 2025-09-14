import React from "react";

interface ProblemStatsProps {
  easy: number;
  medium: number;
  hard: number;
  total: number;
  solved: number;
}

export default function ProblemStatsCircle({
  easy,
  medium,
  hard,
  total,
  solved,
}: ProblemStatsProps) {
  // Calculate the percentages for each difficulty
  const totalSolved = easy + medium + hard;
  const solvedPercentage = Math.floor((totalSolved / total) * 100);

  // SVG settings
  const size = 140;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke dash offset based on percentage
  const offset = circumference - (solvedPercentage / 100) * circumference;

  // Calculate percentages for each difficulty
  const easyPercentage = totalSolved > 0 ? (easy / totalSolved) * 100 : 0;
  const mediumPercentage = totalSolved > 0 ? (medium / totalSolved) * 100 : 0;
  const hardPercentage = totalSolved > 0 ? (hard / totalSolved) * 100 : 0;

  // Calculate stroke dash arrays for the gradient segments
  const easyDash = (easyPercentage / 100) * circumference;
  const mediumDash = (mediumPercentage / 100) * circumference;
  const hardDash = (hardPercentage / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#f1f1f1"
          strokeWidth={strokeWidth}
        />

        {/* Create three separate arcs for each color */}
        {/* Easy (green) arc - positioned at top */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          strokeDasharray={`${easyDash} ${circumference}`}
          strokeDashoffset="0"
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
        />

        {/* Medium (yellow) arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#facc15"
          strokeWidth={strokeWidth}
          strokeDasharray={`${mediumDash} ${circumference}`}
          strokeDashoffset={-easyDash}
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
        />

        {/* Hard (red) arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#ef4444"
          strokeWidth={strokeWidth}
          strokeDasharray={`${hardDash} ${circumference}`}
          strokeDashoffset={-(easyDash + mediumDash)}
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{solved}</span>
        <span className="text-green-600 text-sm mt-1">Solved</span>
      </div>
    </div>
  );
}
