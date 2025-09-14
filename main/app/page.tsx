import Link from "next/link";
import { Button } from "../shadcn-components/ui/button";
import Header from "./components/Header";

export default function HomePage() {
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
              <Link href="/dance">
                <Button
                  size="lg"
                  className="bg-tiktok-red hover:bg-tiktok-red/80 text-white text-xl px-12 py-6 rounded-full font-bold shadow-xl transition-all duration-300 hover:scale-105"
                >
                  LET'S GET DANCING
                </Button>
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

          {/* Right Side - Rectangle Placeholder */}
          <div className="w-1/2 flex items-center justify-center">
            <div className="w-full max-w-lg h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                <p className="text-lg font-medium">Placeholder Content</p>
                <p className="text-sm">Video/Image/Demo Goes Here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
