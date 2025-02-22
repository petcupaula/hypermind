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
    id: "9BWtsMINqrJLrRacOk9x", 
    name: "Aria",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/9BWtsMINqrJLrRacOk9x/405766b8-1f4e-4d3c-aba1-6f25333823ec.mp3"
  },
  { 
    id: "CwhRBWXzGAHq8TQ4Fs17", 
    name: "Roger",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3"
  },
  { 
    id: "EXAVITQu4vr4xnSDxMaL", 
    name: "Sarah",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3"
  },
  { 
    id: "FGY2WhTYpPnrIDTdsKH5", 
    name: "Laura",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3"
  },
  { 
    id: "IKne3meq5aSn9XLyUdCD", 
    name: "Charlie",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3"
  },
  { 
    id: "JBFqnCBsd6RMkjVDRZzb", 
    name: "George",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3"
  },
  { 
    id: "N2lVS1w4EtoT3dr4eOWO", 
    name: "Callum",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3"
  },
  { 
    id: "SAz9YHcvj6GT2YYXdXww", 
    name: "River",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3"
  },
  { 
    id: "TX3LPaxmHKxFdv7VOQHJ", 
    name: "Liam",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3"
  },
  { 
    id: "XB0fDUnXU5powFXDhCwa", 
    name: "Charlotte",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/XB0fDUnXU5powFXDhCwa/942356dc-f10d-4d89-bda5-4f8505ee038b.mp3"
  },
  { 
    id: "Xb7hH8MSUJpSbSDYk0k2", 
    name: "Alice",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3"
  },
  { 
    id: "XrExE9yKIg1WjnnlVkGX", 
    name: "Matilda",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3"
  },
  { 
    id: "bIHbv24MWmeRgasZH58o", 
    name: "Will",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3"
  },
  { 
    id: "cgSgspJ2msm6clMCkdW9", 
    name: "Jessica",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3"
  },
  { 
    id: "cjVigY5qzO86Huf0OWal", 
    name: "Eric",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/d098fda0-6456-4030-b3d8-63aa048c9070.mp3"
  },
  { 
    id: "iP95p4xoKVk53GoZ742B", 
    name: "Chris",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/iP95p4xoKVk53GoZ742B/3f4bde72-cc48-40dd-829f-57fbf906f4d7.mp3"
  },
  { 
    id: "nPczCjzI2devNBz1zQrb", 
    name: "Brian",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd3e72c-4fd3-42f1-93ea-abc5d4e5aa1d.mp3"
  },
  { 
    id: "onwK4e9ZLuTAKqWW03F9", 
    name: "Daniel",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3"
  },
  { 
    id: "pFZP5JQG7iQjIQuC4Bku", 
    name: "Lily",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3"
  },
  { 
    id: "pqHfZKP75CvOlQylNhV4", 
    name: "Bill",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3"
  }
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
