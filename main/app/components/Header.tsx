import Image from "next/image";

export default function Header() {
	return (
		<header className="w-full flex items-center justify-between px-6 py-4 border-b bg-background">
			{/* Left: Navigation */}
			<nav className="flex items-center gap-6">
				{/* TODO: Replace # with actual route */}
				<a href="#" className="text-lg font-semibold hover:underline">
					Home
				</a>
				{/* TODO: Replace # with actual route */}
				<a href="#" className="text-lg font-semibold hover:underline">
					Problems
				</a>
			</nav>

			{/* Right: Profile Picture */}
			<div className="flex items-center">
				{/* TODO: Replace src with user's profile picture from Auth0 */}
				<Image
					src="/default-profile.png" // Place a default-profile.png in your public folder
					alt="Profile"
					width={36}
					height={36}
					className="rounded-full border shadow-sm"
				/>
			</div>
		</header>
	);
}
