
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
    name?: string;
    role?: string;
    company?: string;
    avatarUrl?: string;
  };
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}

interface ScenarioCardProps {
  scenario: Scenario;
  onStart: (scenario: Scenario) => void;
}

const ScenarioCard = ({ scenario, onStart }: ScenarioCardProps) => {
  const transformImageUrl = (url: string) => {
    if (!url) return url;
    return `${url}?width=300&height=300&resize=contain`;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 rounded-lg w-[74px] h-[74px] flex items-center justify-center overflow-hidden">
          {scenario.persona.avatarUrl ? (
            <img
              src={transformImageUrl(scenario.persona.avatarUrl)}
              alt={scenario.persona.name || "Persona avatar"}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to Bot icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.removeAttribute('style');
              }}
            />
          ) : (
            <Bot className="h-6 w-6 text-primary fallback-icon" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
              
              {/* Persona information */}
              <div className="mt-3 space-y-1">
                {scenario.persona.name && (
                  <p className="text-sm font-medium">
                    {scenario.persona.name}
                    {scenario.persona.role && scenario.persona.company && (
                      <span className="text-gray-600">
                        {" "}• {scenario.persona.role} at {scenario.persona.company}
                      </span>
                    )}
                  </p>
                )}
              </div>
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
