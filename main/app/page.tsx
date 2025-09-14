import Link from "next/link";
import { Button } from "../shadcn-components/ui/button";
import Header from "./components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-6xl mx-auto px-4">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 text-tiktok-black">
            Leetcode but for TikTok Dances
          </h1>

          {/* Subtitle */}
          <p className="text-tiktok-black/80 text-2xl md:text-3xl mb-12 font-medium">
            Master algorithms while learning viral dances
          </p>

          {/* CTA Button */}
          <Link href="/dance">
            <Button
              size="lg"
              className="bg-tiktok-red hover:bg-tiktok-pink text-white text-2xl px-16 py-8 rounded-full font-bold shadow-xl transition-all duration-300 hover:scale-105"
            >
              LET'S GET DANCING
            </Button>
          </Link>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-tiktok-black/60 text-lg">
            Made with ❤️ for developers who love to dance
          </p>
        </div>
      </footer>
    </div>
  );
}
