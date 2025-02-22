
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedGradient from "@/components/ui/animated-gradient";
import Navigation from "@/components/layout/Navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import ScenarioCard, { Scenario } from "@/components/scenarios/ScenarioCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

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
      voiceId: "pqHfZKP75CvOlQylNhV4"
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
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
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
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
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
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  }
];

const Dashboard = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const categories = Array.from(new Set(scenarios.map(s => s.category)));

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Don't render anything until we've checked authentication
  if (!session) {
    return null;
  }

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
                        onStart={setSelectedScenario}
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

export default Dashboard;
