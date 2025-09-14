import Link from "next/link";
import { Button } from "../shadcn-components/ui/button";
import Header from "./components/Header";

export default function HomePage() {
  return (
    <div
      className="min-h-screen w-full bg-white relative"
      style={{
        backgroundImage: "url('/bg.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-6xl mx-auto px-4">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 text-tiktok-black">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/leetcode.png" alt="LeetCode" className="h-16 md:h-20 lg:h-24" />
                <span>but for</span>
              </div>
              <div className="flex items-center space-x-3">
                <img src="/tiktok.png" alt="TikTok" className="h-16 md:h-20 lg:h-24" />
                <span>Dances</span>
              </div>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-tiktok-black/80 text-2xl md:text-3xl mb-12 font-medium">
            Master algorithms while learning viral dances
          </p>

          {/* CTA Button */}
          <Link href="/dance">
            <Button
              size="lg"
              className="bg-tiktok-red hover:bg-tiktok-red/80 text-white text-2xl px-16 py-8 rounded-full font-bold shadow-xl transition-all duration-300 hover:scale-105"
            >
              LET'S GET DANCING
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
