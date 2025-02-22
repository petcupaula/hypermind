import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedGradient from "@/components/ui/animated-gradient";
import Navigation from "@/components/layout/Navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import ScenarioCard, { Scenario } from "@/components/scenarios/ScenarioCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Brain, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const scenarios: Scenario[] = [
  {
    id: "1",
    title: "Enterprise SaaS Demo",
    description: "Practice pitching to a tech-savvy CTO of a Fortune 500 company.",
    category: "Enterprise",
    difficulty: "Advanced",
    persona: {
      prompt: "You are an Enterprise CTO Persona, a tech-savvy decision maker at a Fortune 500 company. You're analytical, detail-oriented, and focused on scalability and security.",
      firstMessage: "Hello! I understand you want to discuss your SaaS solution. I'm particularly interested in understanding how it scales and integrates with our existing infrastructure.",
      voiceId: "pqHfZKP75CvOlQylNhV4" // Bill's voice
    }
  },
  {
    id: "2",
    title: "Small Business Owner Meeting",
    description: "Connect with a busy small business owner looking to optimize operations.",
    category: "Small Business",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a Small Business Owner Persona, running a growing retail business. You're practical, budget-conscious, and interested in immediate ROI.",
      firstMessage: "Hi there! I've got about 15 minutes. Can you quickly show me how your solution can help my business save time and money?",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ" // Liam's voice
    }
  },
  {
    id: "3",
    title: "Startup Founder Pitch",
    description: "Present to an innovative startup founder in the tech space.",
    category: "Startup",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a Startup Founder Persona, leading a fast-growing tech startup. You're innovative, fast-moving, and looking for cutting-edge solutions.",
      firstMessage: "Hey! I'm interested in learning how your product can help us move faster and stay ahead of the competition.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17" // Roger's voice
    }
  },
  {
    id: "4",
    title: "Healthcare Administrator Discussion",
    description: "Navigate compliance and efficiency concerns with a healthcare admin.",
    category: "Healthcare",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a Healthcare Administrator Persona, managing a large medical facility. You're focused on compliance, patient care, and operational efficiency.",
      firstMessage: "Good morning. I'd like to understand how your solution addresses HIPAA compliance while improving our workflow.",
      voiceId: "EXAVITQu4vr4xnSDxMaL" // Sarah's voice
    }
  }
];

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
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
  }

  const handleStartScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  const categories = Array.from(new Set(scenarios.map(s => s.category)));

  return (
    <div className="min-h-screen">
      <AnimatedGradient />
      <Navigation />
      
      <main className="container pt-32 pb-16">
        {selectedScenario ? (
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-8"
              onClick={() => setSelectedScenario(null)}
            >
              ← Back to scenarios
            </Button>
            <ChatInterface />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                Sales Training Scenarios
              </h1>
              <p className="text-xl text-gray-600">
                Choose a scenario to practice your sales skills with different customer personas
              </p>
            </div>

            <Tabs defaultValue={categories[0]} className="space-y-8">
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="w-full">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {scenarios
                    .filter((scenario) => scenario.category === category)
                    .map((scenario) => (
                      <ScenarioCard
                        key={scenario.id}
                        scenario={scenario}
                        onStart={handleStartScenario}
                      />
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
