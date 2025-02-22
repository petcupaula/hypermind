
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AnimatedGradient from "@/components/ui/animated-gradient";
import Navigation from "@/components/layout/Navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import ScenarioCard, { Scenario } from "@/components/scenarios/ScenarioCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch scenarios and personas from Supabase
  const { data: scenarios = [], isLoading } = useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      const { data: scenariosData, error: scenariosError } = await supabase
        .from('scenarios')
        .select(`
          *,
          persona:personas (
            *
          )
        `);

      if (scenariosError) {
        console.error('Error fetching scenarios:', scenariosError);
        toast({
          title: "Error",
          description: "Failed to load scenarios",
          variant: "destructive",
        });
        return [];
      }

      // Transform the data to match the Scenario type
      return scenariosData.map(scenario => ({
        id: scenario.scenario_id,
        title: scenario.title,
        description: scenario.description,
        category: scenario.category,
        difficulty: scenario.difficulty as "Beginner" | "Intermediate" | "Advanced",
        persona: {
          prompt: scenario.persona.prompt,
          firstMessage: scenario.persona.first_message,
          voiceId: scenario.persona.voice_id,
          name: scenario.persona.name,
          role: scenario.persona.role,
          company: scenario.persona.company
        }
      }));
    }
  });

  const categories = Array.from(new Set(scenarios.map(s => s.category)));

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
      }
    });

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

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <AnimatedGradient />
        <Navigation />
        <main className="container pt-32 pb-16">
          <div className="max-w-6xl mx-auto text-center">
            Loading scenarios...
          </div>
        </main>
      </div>
    );
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
            <ChatInterface scenario={selectedScenario} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                Sales Training Scenarios
              </h1>
              <p className="text-xl text-gray-600">
                Choose a scenario to practice your sales skills with different customer personas
              </p>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3 bg-card rounded-lg border shadow-sm min-h-[calc(100vh-320px)]">
                <div className="p-4 space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "secondary" : "ghost"}
                      className={`w-full justify-start text-left font-medium px-3 py-2 h-auto whitespace-normal ${
                        selectedCategory === category 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span className="line-clamp-2">{category}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="col-span-9">
                <div className="space-y-4">
                  {scenarios
                    .filter((scenario) => scenario.category === selectedCategory)
                    .map((scenario) => (
                      <ScenarioCard
                        key={scenario.id}
                        scenario={scenario}
                        onStart={setSelectedScenario}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
