
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"] as const;

const CreateScenarioForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner" as typeof DIFFICULTY_OPTIONS[number],
    persona: {
      name: "",
      role: "",
      company: "",
      prompt: "",
      firstMessage: "",
      voiceId: "21m00Tcm4TlvDq8ikWAM", // Default voice ID
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, create the persona
      const { data: personaData, error: personaError } = await supabase
        .from("personas")
        .insert({
          name: formData.persona.name,
          role: formData.persona.role,
          company: formData.persona.company,
          prompt: formData.persona.prompt,
          first_message: formData.persona.firstMessage,
          voice_id: formData.persona.voiceId,
          appearance: "Professional and approachable",
          background: "Experienced in their field",
          personality: "Friendly and knowledgeable",
        })
        .select()
        .single();

      if (personaError) throw personaError;

      // Then create the scenario
      const { error: scenarioError } = await supabase
        .from("scenarios")
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty,
          persona_id: personaData.id,
          scenario_id: crypto.randomUUID(),
        });

      if (scenarioError) throw scenarioError;

      toast({
        title: "Success",
        description: "Scenario created successfully",
      });

      navigate("/scenarios");
    } catch (error) {
      console.error("Error creating scenario:", error);
      toast({
        title: "Error",
        description: "Failed to create scenario. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Create New Scenario</h2>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <select
              id="difficulty"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as typeof DIFFICULTY_OPTIONS[number] }))}
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-semibold mb-4">Persona Details</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personaName">Name</Label>
                <Input
                  id="personaName"
                  value={formData.persona.name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, name: e.target.value }
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaRole">Role</Label>
                <Input
                  id="personaRole"
                  value={formData.persona.role}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, role: e.target.value }
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaCompany">Company</Label>
                <Input
                  id="personaCompany"
                  value={formData.persona.company}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, company: e.target.value }
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaPrompt">AI Prompt</Label>
                <Input
                  id="personaPrompt"
                  value={formData.persona.prompt}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, prompt: e.target.value }
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaFirstMessage">First Message</Label>
                <Input
                  id="personaFirstMessage"
                  value={formData.persona.firstMessage}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, firstMessage: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Scenario"}
        </Button>
      </form>
    </Card>
  );
};

export default CreateScenarioForm;
