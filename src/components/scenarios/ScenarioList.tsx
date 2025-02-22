
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScenarioCard, { Scenario } from "@/components/scenarios/ScenarioCard";

interface ScenarioListProps {
  scenarios: Scenario[];
  onStartScenario: (scenario: Scenario) => void;
}

const ScenarioList = ({ scenarios, onStartScenario }: ScenarioListProps) => {
  const categories = Array.from(new Set(scenarios.map(s => s.category)));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Sales Training Scenarios
        </h1>
        <p className="text-xl text-gray-600">
          Choose a scenario to practice your sales skills with different customer personas
        </p>
      </div>

      <Tabs defaultValue={categories[0]} className="space-y-8">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="w-full">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {scenarios
              .filter((scenario) => scenario.category === category)
              .map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onStart={onStartScenario}
                />
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ScenarioList;
