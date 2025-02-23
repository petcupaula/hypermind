
import ChatInterface from "@/components/chat/ChatInterface";
import { Scenario } from "@/components/scenarios/ScenarioCard";

const demoScenario: Scenario = {
  id: "demo",
  title: "Enterprise SaaS Demo",
  description: "Practice pitching to a tech-savvy CTO of a Fortune 500 company.",
  category: "Cold Calling",
  difficulty: "Intermediate",
  persona: {
    prompt: "You are Mark Chen, an Enterprise CTO, a tech-savvy decision maker at a Fortune 500 company. You're analytical, detail-oriented, and focused on scalability and security. Be direct, to the point. You are rude and not that inquisitive.",
    firstMessage: "Hello. Who is this?",
    voiceId: "cjVigY5qzO86Huf0OWal", // Using Eric's voice which sounds professional and authoritative
    name: "Mark Chen",
    role: "Chief Technology Officer",
    company: "Fortune 500 Tech"
  }
};

const DemoSection = () => {
  const defaultUserProfile = {
    name: "You",
    role: "Sales Rep",
    company: "TechGiant"
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-center mb-8">Try it yourself</h2>
      <ChatInterface 
        scenario={demoScenario} 
        defaultUserProfile={defaultUserProfile}
      />
    </div>
  );
};

export default DemoSection;
