import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-purple-600">DanceCode</div>
        <Link href="/auth/login">
          <Button>Get Started</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 max-w-6xl mx-auto">
        <Badge className="mb-4" variant="secondary">
          LeetCode for Dancing 💃
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Master Dance Moves
          <span className="text-purple-600"> One Step at a Time</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Practice, perfect, and progress through dance challenges. Upload your
          videos, get AI feedback, and level up your dance skills with
          structured practice sessions.
        </p>
        <div className="space-x-4">
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Dancing
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Practice Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from hundreds of dance moves and choreography challenges,
                from beginner to advanced levels.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📹 Upload & Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Record yourself performing the moves and compare with reference
                videos using AI analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Get Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Receive detailed feedback on timing, form, and technique to
                improve your dance skills.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Dance Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of dancers improving their skills every day
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 DanceCode. Made with ❤️ for dancers.</p>
        </div>
      </footer>
    </main>
  );
}
