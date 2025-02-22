
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GenerateAvatars = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAvatars = async () => {
    setIsGenerating(true);
    try {
      // Fetch all personas that don't have avatars yet
      const { data: personas, error } = await supabase
        .from('personas')
        .select('id, appearance')
        .is('avatar_url', null);

      if (error) throw error;

      let successCount = 0;
      for (const persona of personas || []) {
        try {
          // Call the generate-avatar function
          const { data, error: genError } = await supabase.functions
            .invoke('generate-avatar', {
              body: { appearance: persona.appearance }
            });

          if (genError) throw genError;
          if (!data?.imageUrl) throw new Error('No image URL returned');

          // Update the persona with the new avatar URL
          const { error: updateError } = await supabase
            .from('personas')
            .update({ avatar_url: data.imageUrl })
            .eq('id', persona.id);

          if (updateError) throw updateError;
          successCount++;
        } catch (personaError) {
          console.error(`Error generating avatar for persona ${persona.id}:`, personaError);
        }
      }

      toast({
        title: "Avatar Generation Complete",
        description: `Successfully generated ${successCount} avatar${successCount !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Error in avatar generation:', error);
      toast({
        title: "Error",
        description: "Failed to generate avatars. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-6">
      <Button 
        onClick={generateAvatars} 
        disabled={isGenerating}
        variant="outline"
      >
        {isGenerating ? "Generating Avatars..." : "Generate Missing Avatars"}
      </Button>
    </div>
  );
};

export default GenerateAvatars;
