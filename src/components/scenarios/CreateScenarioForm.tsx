import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Square } from "lucide-react";
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
  { 
    id: "21m00Tcm4TlvDq8ikWAM", 
    name: "Rachel",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/6edb9076-c3e4-420c-b6ab-11d43fe341c8.mp3"
  },
  { 
    id: "AZnzlk1XvdvUeBnXmlld", 
    name: "Domi",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/c803f831-8b55-4b2b-aee3-72b3589e3b0c.mp3"
  },
  { 
    id: "EXAVITQu4vr4xnSDxMaL", 
    name: "Sarah",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/4f653e19-4d01-4f41-8d57-04309a850a66.mp3"
  },
  { 
    id: "ErXwobaYiN019PkySvjV", 
    name: "Antoni",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/2c762d0b-59ae-42b1-ab35-354e6282c99c.mp3"
  },
  { 
    id: "MF3mGyEYCl7XYWbV9V6O", 
    name: "Elli",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/MF3mGyEYCl7XYWbV9V6O/f9fd64c3-5d62-45c1-9a86-8a30a8f64072.mp3"
  },
  { 
    id: "TxGEqnHWrfWFTfGW9XjX", 
    name: "Josh",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/TxGEqnHWrfWFTfGW9XjX/10b1c323-8e56-4d52-94fd-bdc42e42d572.mp3"
  },
  { 
    id: "VR6AewLTigWG4xSOukaG", 
    name: "Arnold",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOukaG/66e83dc2-6543-4897-9283-e028ac5ae4aa.mp3"
  },
  { 
    id: "pNInz6obpgDQGcFmaJgB", 
    name: "Adam",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/e0b45450-78db-49b9-aaa4-d5358a6871bd.mp3"
  },
  { 
    id: "yoZ06aMxZJJ28mfd3POQ", 
    name: "Sam",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/yoZ06aMxZJJ28mfd3POQ/af3f1b06-ec9e-4592-9e3c-0fbb41925529.mp3"
  },
] as const;

type VoiceId = typeof VOICE_OPTIONS[number]["id"];
type Category = typeof DEFAULT_CATEGORIES[number] | string;

const CreateScenarioForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
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
      voiceId: VOICE_OPTIONS[0].id as VoiceId,
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

  const previewVoice = async () => {
    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);

      const selectedVoice = VOICE_OPTIONS.find(voice => voice.id === formData.persona.voiceId);
      const previewUrl = selectedVoice?.previewUrl;

      if (!previewUrl) {
        throw new Error("No preview available for this voice");
      }

      const audio = new Audio(previewUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
      };

      setAudioElement(audio);
      await audio.play();
    } catch (error) {
      console.error("Error previewing voice:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to preview voice",
        variant: "destructive",
      });
      setIsPlaying(false);
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
                <div className="flex gap-2">
                  <select
                    id="personaVoice"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.persona.voiceId}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        persona: { ...prev.persona, voiceId: e.target.value as VoiceId }
                      }));
                    }}
                  >
                    {VOICE_OPTIONS.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previewVoice}
                    className="min-w-[100px]"
                  >
                    {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? "Stop" : "Preview"}
                  </Button>
                </div>
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
