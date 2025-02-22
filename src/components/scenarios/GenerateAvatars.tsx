
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

      if (error) {
        console.error('Error fetching personas:', error);
        throw error;
      }

      console.log('Fetched personas:', personas);

      if (!personas || personas.length === 0) {
        toast({
          title: "No avatars to generate",
          description: "All personas already have avatars.",
        });
        return;
      }

      // Generate avatars for each persona
      let successCount = 0;
      for (const persona of personas) {
        try {
          console.log('Generating avatar for persona:', persona.id);
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
        } catch (error) {
          console.error('Error generating avatar for persona:', persona.id, error);
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
        description: error instanceof Error ? error.message : "Failed to generate avatars. Please try again.",
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
        {isGenerating ? "Generating Avatars..." : "Generate All Missing Avatars"}
      </Button>
    </div>
  );
};

export default GenerateAvatars;
