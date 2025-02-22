
import AnimatedGradient from "@/components/ui/animated-gradient";
import Navigation from "@/components/layout/Navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Brain, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnimatedGradient />
      <Navigation />
      
      <main className="container pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Train Sales Teams with
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              AI-Powered Simulations
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ramp your sales reps 10x faster with personalized AI training. Create custom scenarios, practice difficult conversations, and master your pitch in days, not months.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="gap-2">
              Start Training Now
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Custom AI Agents</h3>
              <p className="text-gray-600">Create personalized training scenarios that match your ICP perfectly.</p>
            </div>
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Multi-Agent Training</h3>
              <p className="text-gray-600">Practice with multiple AI personas in complex scenarios.</p>
            </div>
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Track progress and identify areas for improvement.</p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Try it yourself</h2>
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default Index;
