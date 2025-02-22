
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedGradient from "@/components/ui/animated-gradient";
import Navigation from "@/components/layout/Navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import DemoSection from "@/components/home/DemoSection";
import ScenarioList from "@/components/scenarios/ScenarioList";
import type { Scenario } from "@/components/scenarios/ScenarioCard";

const scenarios: Scenario[] = [
  {
    id: "1",
    title: "Cold Call: Tech Solutions Introduction",
    description: "Practice introducing your SaaS solution to a completely cold prospect.",
    category: "Cold Calls",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a busy CTO who receives many cold calls. You're skeptical but willing to listen if the value proposition is clear and compelling.",
      firstMessage: "This better be important, I'm in between meetings.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "2",
    title: "Warm Call: Webinar Follow-up",
    description: "Follow up with a prospect who attended your product webinar.",
    category: "Warm Calls",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a marketing manager who attended a webinar about the product last week. You found it interesting but haven't made a decision yet.",
      firstMessage: "Yes, I remember the webinar. I had a few questions about the features you showed.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "3",
    title: "Discovery: Understanding Pain Points",
    description: "Conduct a discovery call to understand the prospect's needs and challenges.",
    category: "Discovery Calls",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are an operations director facing efficiency challenges. You're open to solutions but need someone who truly understands your problems.",
      firstMessage: "I'm looking to streamline our processes, but I need to make sure any solution really fits our needs.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "4",
    title: "Product Demo: Enterprise Platform",
    description: "Demonstrate your enterprise platform features and capabilities.",
    category: "Demo Calls",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a technical decision-maker evaluating solutions. You want to see specific features in action and understand technical details.",
      firstMessage: "I'd like to see how your platform handles high-volume data processing specifically.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "5",
    title: "Sales Pitch: ROI Presentation",
    description: "Present your solution's ROI to a potential enterprise client.",
    category: "Sales Pitch Calls",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a CFO focused on ROI and long-term value. You need clear financial justification for any investment.",
      firstMessage: "Show me the numbers. How will this investment pay off in the next 12-24 months?",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "6",
    title: "Follow-up: Post-Demo Discussion",
    description: "Follow up after a successful demo to address remaining concerns.",
    category: "Follow-up Calls",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a prospect who saw the demo last week. You liked it but have some concerns about implementation.",
      firstMessage: "The demo was impressive, but I'm worried about the integration timeline.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "7",
    title: "Closing: Enterprise Deal",
    description: "Close a major enterprise deal and negotiate final terms.",
    category: "Closing Calls",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a senior decision-maker ready to close but negotiating final terms. You want to ensure you're getting the best possible deal.",
      firstMessage: "Let's discuss the final terms. I have a few points I'd like to negotiate.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "8",
    title: "Upsell: Premium Features",
    description: "Upsell existing customer to premium features package.",
    category: "Upsell/Cross-sell Calls",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a current customer satisfied with the basic service but hesitant about spending more.",
      firstMessage: "I'm happy with what we have. What additional value would premium features bring?",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "9",
    title: "Renewal: Annual Contract",
    description: "Secure a contract renewal with a valuable client.",
    category: "Renewal or Retention Calls",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a client approaching contract renewal. You're generally satisfied but have received competitive offers.",
      firstMessage: "Our contract is up for renewal soon. We've had some offers from other vendors.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "10",
    title: "Referral: Client Network",
    description: "Request referrals from a satisfied enterprise client.",
    category: "Referral Calls",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a satisfied customer who's had great results but is busy and protective of professional relationships.",
      firstMessage: "I appreciate your service, but I need to be selective about making referrals.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "11",
    title: "Reactivation: Dormant Prospect",
    description: "Re-engage a prospect who showed interest six months ago.",
    category: "Reactivation Calls",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a prospect who evaluated the solution 6 months ago but didn't move forward due to timing/budget.",
      firstMessage: "Yes, I remember our discussions. Our situation has changed since then.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
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
          <HeroSection />
          <StatsSection />
          <DemoSection />
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
            <ChatInterface />
          </div>
        ) : (
          <ScenarioList 
            scenarios={scenarios} 
            onStartScenario={setSelectedScenario} 
          />
        )}
      </main>
    </div>
  );
};

export default Index;
