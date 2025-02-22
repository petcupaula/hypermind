import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"] as const;
const DEFAULT_CATEGORIES = [
  "Cold Calling",
  "Discovery Calls",
  "Product Demos",
  "Negotiation",
  "Objection Handling",
  "Follow-up Calls",
  "Closing Deals",
] as const;

const VOICE_OPTIONS = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam" },
] as const;

type Category = typeof DEFAULT_CATEGORIES[number] | string;

const CreateScenarioForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: DEFAULT_CATEGORIES[0] as Category,
    difficulty: "Beginner" as typeof DIFFICULTY_OPTIONS[number],
    persona: {
      name: "",
      role: "",
      company: "",
      prompt: "",
      firstMessage: "",
      voiceId: VOICE_OPTIONS[0].id,
      appearance: "",
      background: "",
      personality: "",
    },
  });

  const { data: existingCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('category');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return DEFAULT_CATEGORIES;
      }
      
      const categories = new Set([
        ...DEFAULT_CATEGORIES,
        ...data.map(d => d.category)
      ]);
      return Array.from(categories);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const finalCategory = customCategory || formData.category;

    try {
      const { data: personaData, error: personaError } = await supabase
        .from("personas")
        .insert({
          name: formData.persona.name,
          role: formData.persona.role,
          company: formData.persona.company,
          prompt: formData.persona.prompt,
          first_message: formData.persona.firstMessage,
          voice_id: formData.persona.voiceId,
          appearance: formData.persona.appearance,
          background: formData.persona.background,
          personality: formData.persona.personality,
        })
        .select()
        .single();

      if (personaError) throw personaError;

      try {
        const { data: avatarData, error: avatarError } = await supabase.functions
          .invoke('generate-avatar', {
            body: { appearance: formData.persona.appearance }
          });

        if (avatarError) {
          console.error('Error generating avatar:', avatarError);
        } else if (avatarData?.imageUrl) {
          const { error: updateError } = await supabase
            .from('personas')
            .update({ avatar_url: avatarData.imageUrl })
            .eq('id', personaData.id);

          if (updateError) {
            console.error('Error updating persona with avatar:', updateError);
          }
        }
      } catch (avatarError) {
        console.error('Error in avatar generation:', avatarError);
      }

      const { error: scenarioError } = await supabase
        .from("scenarios")
        .insert({
          title: formData.title,
          description: formData.description,
          category: finalCategory,
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
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2">
              <select
                id="category"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value as Category }));
                  setCustomCategory("");
                }}
              >
                {existingCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Or enter custom category"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  if (e.target.value) {
                    setFormData(prev => ({ ...prev, category: e.target.value }));
                  }
                }}
                className="flex-1"
              />
            </div>
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
                <Textarea
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

              <div className="space-y-2">
                <Label htmlFor="personaAppearance">Appearance</Label>
                <Input
                  id="personaAppearance"
                  value={formData.persona.appearance}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, appearance: e.target.value }
                  }))}
                  placeholder="Professional and approachable"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaBackground">Background</Label>
                <Textarea
                  id="personaBackground"
                  value={formData.persona.background}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, background: e.target.value }
                  }))}
                  placeholder="Experienced in their field"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaPersonality">Personality</Label>
                <Input
                  id="personaPersonality"
                  value={formData.persona.personality}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, personality: e.target.value }
                  }))}
                  placeholder="Friendly and knowledgeable"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaVoice">Voice</Label>
                <select
                  id="personaVoice"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData.persona.voiceId}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persona: { ...prev.persona, voiceId: e.target.value }
                  }))}
                >
                  {VOICE_OPTIONS.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
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
