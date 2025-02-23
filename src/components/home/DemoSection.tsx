
import ChatInterface from "@/components/chat/ChatInterface";
import { Scenario } from "@/components/scenarios/ScenarioCard";

const demoScenario: Scenario = {
  id: "demo",
  title: "Enterprise SaaS Demo",
  description: "Practice pitching to a tech-savvy CTO of a Fortune 500 company.",
  category: "Cold Calling",
  difficulty: "Intermediate",
  persona: {
    prompt: "You are an Enterprise CTO Persona, a tech-savvy decision maker at a Fortune 500 company. You're analytical, detail-oriented, and focused on scalability and security. Be direct, to the point, professional, and don't hesitate to ask challenging questions about technical specifications and implementation details.",
    firstMessage: "Hello, this is Mark Chen speaking. I'm in between meetings, how can I help you?",
    voiceId: "pqHfZKP75CvOlQylNhV4" // Using Bill's voice which sounds professional and authoritative
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
