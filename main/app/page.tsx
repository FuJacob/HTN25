import Link from "next/link";
import { Button } from "@/shadcn-components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn-components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-orange-400">LeetCode</div>
            <div className="hidden md:flex space-x-6">
              <Link href="#" className="text-orange-400 hover:text-orange-300">Premium</Link>
              <Link href="#" className="hover:text-gray-300">Explore</Link>
              <Link href="#" className="hover:text-gray-300">Product</Link>
              <Link href="#" className="hover:text-gray-300">Developer</Link>
            </div>
          </div>
          <div>
            <Link href="/auth/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-800">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">
              A New Way to Learn
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              LeetCode is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.
            </p>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3">
              Create Account
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
              <div className="flex space-x-2 mb-4">
                <div className="w-12 h-8 bg-blue-400 rounded"></div>
                <div className="w-12 h-8 bg-green-400 rounded"></div>
                <div className="w-12 h-8 bg-yellow-400 rounded"></div>
                <div className="w-12 h-8 bg-red-400 rounded"></div>
                <div className="w-12 h-8 bg-blue-300 rounded-full"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                <div className="h-2 bg-gray-200 rounded w-3/5"></div>
              </div>
              <div className="grid grid-cols-4 gap-1 mb-4">
                {Array.from({length: 16}).map((_, i) => (
                  <div key={i} className="h-3 bg-gray-100 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Exploring Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="bg-teal-500 rounded-full p-8">
              <div className="text-white text-4xl">→</div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Start Exploring</h2>
            <p className="text-lg text-gray-600 mb-6">
              Explore is a well-organized tool that helps you get the most out of LeetCode by providing structure to guide your progress towards the next step in your programming career.
            </p>
            <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
              Get Started →
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Questions & Community */}
            <Card className="p-8">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-500 rounded-full p-2">
                    <div className="text-white text-xl">📊</div>
                  </div>
                  <div className="bg-green-500 rounded-full p-2">
                    <div className="text-white text-xl">👥</div>
                  </div>
                  <div className="bg-yellow-500 rounded-full p-2">
                    <div className="text-white text-xl">🏆</div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-blue-600">
                  Questions, Community & Contests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 mb-6">
                  Over 3900 questions for you to practice. Come and join one of the largest tech communities with hundreds of thousands of active users and participate in our contests to challenge yourself and earn rewards.
                </p>
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  View Questions →
                </Button>
              </CardContent>
            </Card>

            {/* Companies & Candidates */}
            <Card className="p-8">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-500 rounded-full p-2">
                    <div className="text-white text-xl">🏢</div>
                  </div>
                  <div className="bg-gray-500 rounded-full p-2">
                    <div className="text-white text-xl">👨‍💼</div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-orange-600">
                  Companies & Candidates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 mb-6">
                  Not only does LeetCode prepare candidates for technical interviews, we also help companies identify top technical talent. From sponsoring contests to providing online assessments and training, we offer numerous services to businesses.
                </p>
                <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                  Business Opportunities →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-teal-500 rounded-full p-4 w-16 h-16 mx-auto mb-8">
            <div className="text-white text-2xl">💻</div>
          </div>
          <h2 className="text-3xl font-bold text-teal-600 mb-8">Developer</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto">
            We now support 14 popular coding languages. At our core, LeetCode is about developers. Our powerful development tools such as Playground help you test, debug and even write your own projects online.
          </p>

          {/* Code Editor Preview */}
          <div className="bg-gray-900 rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <span className="bg-gray-700 text-white px-3 py-1 rounded text-sm">C++</span>
                <span className="bg-gray-700 text-gray-400 px-3 py-1 rounded text-sm">Java</span>
                <span className="bg-gray-700 text-gray-400 px-3 py-1 rounded text-sm">Python</span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="text-xs">📋 Copy</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">▶ Run</Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs">🏃‍♂️ Playground</Button>
              </div>
            </div>
            <div className="text-left bg-gray-800 rounded p-4 font-mono text-sm">
              <div className="text-gray-400">1</div>
              <div className="text-gray-400">2  <span className="text-green-400">/**</span></div>
              <div className="text-gray-400">3   <span className="text-green-400">* Definition for singly-linked list.</span></div>
              <div className="text-gray-400">4   <span className="text-green-400">* struct ListNode {'{'}</span></div>
              <div className="text-gray-400">5   <span className="text-green-400">*     int val;</span></div>
              <div className="text-gray-400">6   <span className="text-green-400">*     ListNode *next;</span></div>
              <div className="text-gray-400">7   <span className="text-green-400">*     ListNode(int x) : val(x), next(NULL) {'{}'}</span></div>
              <div className="text-gray-400">8   <span className="text-green-400">* {'};'}</span></div>
              <div className="text-gray-400">9   <span className="text-green-400">*/</span></div>
            </div>
            <div className="mt-4 text-right">
              <Button className="bg-teal-600 hover:bg-teal-700">
                Create Playground →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
