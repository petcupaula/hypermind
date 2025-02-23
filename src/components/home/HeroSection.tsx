
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

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

  const handleStartTraining = () => {
    if (session) {
      navigate("/scenarios");
    } else {
      navigate("/auth");
    }
  };

  const handleWatchDemo = () => {
    window.open("https://youtu.be/QUHrVlqKjyU", "_blank");
  };

  return (
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
        <Button 
          size="lg" 
          className="gap-2"
          onClick={handleStartTraining}
        >
          Start Training Now
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleWatchDemo}
          className="gap-2"
        >
          Watch Demo
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
