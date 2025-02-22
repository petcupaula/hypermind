
import ChatInterface from "@/components/chat/ChatInterface";
import { Scenario } from "@/components/scenarios/ScenarioCard";

const demoScenario: Scenario = {
  id: "demo",
  title: "Cold Call to CTO",
  description: "Practice a cold call to a Chief Technology Officer about a new software solution",
  category: "Cold Calling",
  difficulty: "Intermediate",
  persona: {
    prompt: "You are Mark Chen, a seasoned CTO at a growing tech company. You're busy but willing to listen if the value proposition is clear. You're technically knowledgeable and care about scalability, security, and ROI. Be direct but professional, and don't hesitate to ask challenging questions about technical specifications and implementation details.",
    firstMessage: "Hello, this is Mark Chen speaking. I'm in between meetings, how can I help you?",
    voiceId: "JBFqnCBsd6RMkjVDRZzb" // Using George's voice which sounds professional and authoritative
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

