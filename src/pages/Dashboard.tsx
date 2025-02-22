
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedGradient from "@/components/ui/animated-gradient";
import Navigation from "@/components/layout/Navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import ScenarioCard, { Scenario } from "@/components/scenarios/ScenarioCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { scenarios } from "@/data/scenarios";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const categories = Array.from(new Set(scenarios.map(s => s.category)));

  // Set initial category
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

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
              {/* Left Panel - Categories */}
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

              {/* Right Panel - Scenarios */}
              <div className="col-span-9">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="space-y-4 pr-4">
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
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
