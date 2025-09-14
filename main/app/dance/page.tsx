"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shadcn-components/ui/card";
import Link from "next/link";
import { Badge } from "@/shadcn-components/ui/badge";
import { Input } from "@/shadcn-components/ui/input";

const problems = [
	{
		id: 1,
		title: "Two Sum Dance",
		difficulty: "Easy",
		tags: ["Array", "Hash Table"],
		status: "Unsolved",
		description: "Given a list of dance moves, find two that sum to a target rhythm.",
	},
	{
		id: 2,
		title: "Longest Dance Subsequence",
		difficulty: "Medium",
		tags: ["Dynamic Programming"],
		status: "Unsolved",
		description: "Find the longest subsequence of moves that form a valid dance routine.",
	},
	{
		id: 3,
		title: "Dance Floor Islands",
		difficulty: "Hard",
		tags: ["DFS", "Matrix"],
		status: "Unsolved",
		description: "Count the number of isolated dance groups on the floor grid.",
	},
	{
		id: 4,
		title: "Choreography Scheduler",
		difficulty: "Medium",
		tags: ["Greedy", "Sorting"],
		status: "Unsolved",
		description: "Schedule dance routines to minimize total transition time.",
	},
	{
		id: 5,
		title: "Mirror Moves",
		difficulty: "Easy",
		tags: ["String", "Simulation"],
		status: "Unsolved",
		description: "Simulate mirrored dance moves and output the final sequence.",
	},
];

const difficultyColors = {
	Easy: "bg-green-100 text-green-800 border-green-200",
	Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
	Hard: "bg-red-100 text-red-800 border-red-200",
};

import CalendarBox from "../components/Calendar";

export default function DanceProblemsPage() {
	const [search, setSearch] = useState("");

	const filtered = problems.filter(
		(p) =>
			p.title.toLowerCase().includes(search.toLowerCase()) ||
			p.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
	);

	return (
	<div className="flex flex-row gap-8 py-10 px-12 max-w-7xl mx-auto">
			{/* Left: Problem Set (takes more space) */}
			<div className="flex-1 min-w-0">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold mb-2">Dance Problemset</h1>
					<p className="text-muted-foreground mb-4">
						Practice dance algorithm problems. Filter by title or tag.
					</p>
					<Input
						placeholder="Search problems..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-sm mx-auto"
					/>
				</div>
				<div className="grid gap-6">
					{filtered.length === 0 && (
						<div className="text-center text-muted-foreground">No problems found.</div>
					)}
					{filtered.map((problem) => (
						<Link key={problem.id} href="/home" className="block">
							<Card className="hover:shadow-lg transition-shadow cursor-pointer">
								<CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
									<div>
										<CardTitle className="text-lg">{problem.title}</CardTitle>
										<CardDescription>{problem.description}</CardDescription>
									</div>
									<Badge
										className={
											"border " +
											(difficultyColors[problem.difficulty as keyof typeof difficultyColors] || "")
										}
									>
										{problem.difficulty}
									</Badge>
								</CardHeader>
								<CardContent className="flex flex-wrap items-center gap-2 pt-0">
									{problem.tags.map((tag) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									))}
									<span className="ml-auto text-xs text-muted-foreground">
										{problem.status}
									</span>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
			{/* Right: Calendar (fixed width) */}
			<div className="w-[320px] min-w-[260px] max-w-xs">
				<div className="sticky top-8">
					<CalendarBox />
				</div>
			</div>
		</div>
	);
}
