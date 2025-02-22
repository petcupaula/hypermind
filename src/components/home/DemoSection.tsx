
import ChatInterface from "@/components/chat/ChatInterface";
import { Scenario } from "@/components/scenarios/ScenarioCard";

const demoScenario: Scenario = {
  id: "demo",
  title: "Demo Conversation",
  description: "Try out a sample conversation with our AI assistant",
  category: "Demo",
  difficulty: "Beginner",
  persona: {
    name: "Sarah Miller",
    role: "AI Sales Assistant",
    company: "Sales Training Pro",
    personality: "Friendly, helpful, and knowledgeable",
    background: "Experienced in demonstrating AI-powered sales training solutions to potential users",
    appearance: "Professional virtual assistant with a warm and approachable demeanor",
    prompt: "You are a friendly sales assistant helping users understand how the platform works. Keep responses brief and engaging.",
    firstMessage: "Hi there! I'm here to show you how our conversational AI training works. Would you like to try it out?",
    voiceId: "pqHfZKP75CvOlQylNhV4"
  }
};

const DemoSection = () => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-center mb-8">Try it yourself</h2>
      <ChatInterface scenario={demoScenario} />
    </div>
  );
};

export default DemoSection;
