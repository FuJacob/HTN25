import Link from "next/link";
import { Button } from "../shadcn-components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shadcn-components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-tiktok-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Simple background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-tiktok-cyan rounded-full opacity-10"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-tiktok-red rounded-full opacity-15"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-tiktok-pink rounded-full opacity-10"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-tiktok-blue rounded-full opacity-10"></div>
        </div>

        <div className="text-center z-10 max-w-5xl mx-auto">
          {/* Clean Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-12">
            <span className="text-tiktok-white">LEETCODE</span>
            <br />
            <span className="text-tiktok-red">+</span>
            <br />
            <span className="text-tiktok-cyan">TIKTOK</span>
            <br />
            <span className="text-tiktok-white">DANCES</span>
          </h1>

          {/* Simple subtitle */}
          <p className="text-tiktok-white/80 text-xl md:text-2xl mb-12 font-medium">
            Master algorithms while learning viral dances
          </p>

          {/* Clean CTA Button */}
          <Button 
            size="lg" 
            className="bg-tiktok-red hover:bg-tiktok-pink text-tiktok-white text-xl px-12 py-6 rounded-full font-bold shadow-xl transition-all duration-300"
          >
            LET'S GET DANCING
          </Button>
        </div>

        {/* Simple scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-tiktok-cyan rounded-full flex justify-center">
            <div className="w-1 h-3 bg-tiktok-cyan rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-tiktok-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-tiktok-white">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-tiktok-white border-2 border-tiktok-red hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-tiktok-black">
                  SOLVE PROBLEMS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tiktok-blue text-lg font-medium">
                  Choose from hundreds of coding challenges and start solving like a pro
                </p>
              </CardContent>
            </Card>

            <Card className="bg-tiktok-white border-2 border-tiktok-cyan hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-tiktok-black">
                  LEARN DANCES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tiktok-blue text-lg font-medium">
                  Watch viral TikTok dance tutorials matched to your coding progress
                </p>
              </CardContent>
            </Card>

            <Card className="bg-tiktok-white border-2 border-tiktok-pink hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-tiktok-black">
                  GET FEEDBACK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tiktok-blue text-lg font-medium">
                  AI analyzes your moves and gives you real-time feedback to improve
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-tiktok-blue/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-tiktok-white">
            FEATURES
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-tiktok-red rounded-full"></div>
                  <div>
                    <h3 className="text-2xl font-bold text-tiktok-white">AI-Powered Analysis</h3>
                    <p className="text-tiktok-white/70">Get instant feedback on your dance moves</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-tiktok-cyan rounded-full"></div>
                  <div>
                    <h3 className="text-2xl font-bold text-tiktok-white">Real-time Scoring</h3>
                    <p className="text-tiktok-white/70">Track your progress with live scoring</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-tiktok-pink rounded-full"></div>
                  <div>
                    <h3 className="text-2xl font-bold text-tiktok-white">Viral Challenges</h3>
                    <p className="text-tiktok-white/70">Learn the hottest dance trends</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-tiktok-white rounded-3xl p-8 border-2 border-tiktok-cyan">
              <div className="aspect-video bg-tiktok-red rounded-2xl flex items-center justify-center">
                <p className="text-tiktok-white text-2xl font-bold">
                  DANCE VIDEO PREVIEW
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-tiktok-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-tiktok-red mb-4">10K+</div>
              <p className="text-tiktok-white/80 text-lg font-medium">Problems Solved</p>
            </div>
            <div>
              <div className="text-5xl font-black text-tiktok-cyan mb-4">500+</div>
              <p className="text-tiktok-white/80 text-lg font-medium">Dance Moves</p>
            </div>
            <div>
              <div className="text-5xl font-black text-tiktok-pink mb-4">1M+</div>
              <p className="text-tiktok-white/80 text-lg font-medium">Users Dancing</p>
            </div>
            <div>
              <div className="text-5xl font-black text-tiktok-blue mb-4">99%</div>
              <p className="text-tiktok-white/80 text-lg font-medium">Fun Guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-tiktok-red">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-tiktok-white mb-8">
            READY TO CODE & DANCE?
          </h2>
          <p className="text-tiktok-white/80 text-xl mb-12 font-medium">
            Join thousands of developers who are already vibing
          </p>
          
          <div className="space-y-6">
            <Button 
              size="lg" 
              className="bg-tiktok-black hover:bg-tiktok-blue text-tiktok-white text-xl px-16 py-6 rounded-full font-bold shadow-xl transition-all duration-300"
            >
              START MY JOURNEY
            </Button>
            
            <p className="text-tiktok-white/60 text-lg">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-tiktok-black border-t-2 border-tiktok-cyan">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-tiktok-white/60 text-lg">
            Made with love for developers who love to dance
          </p>
        </div>
      </footer>
    </main>
  );
}
