import Link from "next/link";
import { Button } from "../shadcn-components/ui/button";
import { FaStar } from "react-icons/fa";
import Header from "./components/Header";
import VideoRectangles from "./components/VideoRectangles";

export default function HomePage() {
  // Pick 3 random videos
  const featuredVideos = [
    "Adderall.mp4",
    "Blinding-Lights.mp4", 
    "Renegade.mp4"
  ];

  return (
    <div
      className="min-h-screen w-full bg-white"
      style={{
        backgroundImage: "url('/bg.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)] px-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full flex items-center">
          {/* Left Side - Content */}
          <div className="w-1/2 pr-12">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-8 text-tiktok-black">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/leetcode.png"
                    alt="LeetCode"
                    className="h-12 md:h-16 lg:h-20"
                  />
                  <span>but for</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src="/tiktok.png"
                    alt="TikTok"
                    className="h-12 md:h-16 lg:h-20"
                  />
                  <span>Dances</span>
                </div>
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-tiktok-black/80 text-xl md:text-2xl mb-12 font-medium">
              Master algorithms while learning viral dances
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col lg:flex-row gap-4">
              <Link href="/dances">
                <div className="bg-tiktok-white border-2 border-tiktok-red rounded-xl px-8 py-2.5 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-center space-x-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xl" />
                    ))}
                    <span className="text-tiktok-black font-bold text-lg">
                      250k+
                    </span>
                  </div>
                </div>
              </Link>
              <Link href="/dances">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-tiktok-red text-tiktok-red hover:bg-tiktok-red hover:text-white text-xl px-12 py-6 rounded-full font-bold shadow-xl transition-all duration-300 hover:scale-105"
                >
                  BROWSE DANCES
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Video Rectangles */}
          <div className="w-1/2 flex items-center justify-center">
            <VideoRectangles videos={featuredVideos} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-tiktok-black text-tiktok-white py-4">
        <div className="text-center">
          <p className="text-sm">
            Created by Vincent Sun, Jacob Fu, James Cai, and Travis Pan
          </p>
        </div>
      </footer>
    </div>
  );
}