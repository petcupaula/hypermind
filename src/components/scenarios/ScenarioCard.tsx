
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export interface Scenario {
  id: string;
  title: string;
  description: string;
  persona: {
    prompt: string;
    firstMessage: string;
    voiceId: string;
  };
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}

interface ScenarioCardProps {
  scenario: Scenario;
  onStart: (scenario: Scenario) => void;
}

const ScenarioCard = ({ scenario, onStart }: ScenarioCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
            </div>
            <div className="shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full ${
                scenario.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                scenario.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {scenario.difficulty}
              </span>
            </div>
          </div>
          <Button 
            onClick={() => onStart(scenario)} 
            variant="outline" 
            className="mt-4"
          >
            Start Scenario
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ScenarioCard;
