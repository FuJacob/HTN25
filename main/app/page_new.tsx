import Link from "next/link";
import { Button } from "../shadcn-components/ui/button";
import Header from "./components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight mb-8 text-tiktok-black">
            F**K Leetcode. <br />
            Let's Dance.
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
    </div>
  );
}
