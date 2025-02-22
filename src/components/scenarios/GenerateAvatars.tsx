
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
      // Test with a single specific persona
      const { data: persona, error } = await supabase
        .from('personas')
        .select('id, appearance')
        .eq('id', '5b0593e7-add2-40c3-a136-a53ed70e8e6d')
        .single();

      if (error) {
        console.error('Error fetching persona:', error);
        throw error;
      }

      console.log('Fetched persona:', persona);

      if (!persona) {
        throw new Error('Persona not found');
      }

      // Call the generate-avatar function
      console.log('Calling generate-avatar function with appearance:', persona.appearance);
      const { data, error: genError } = await supabase.functions
        .invoke('generate-avatar', {
          body: { appearance: persona.appearance }
        });

      console.log('Generate avatar response:', data);
      console.log('Generate avatar error:', genError);

      if (genError) throw genError;
      if (!data?.imageUrl) throw new Error('No image URL returned');

      // Update the persona with the new avatar URL
      console.log('Updating persona with avatar URL:', data.imageUrl);
      const { error: updateError } = await supabase
        .from('personas')
        .update({ avatar_url: data.imageUrl })
        .eq('id', persona.id);

      if (updateError) {
        console.error('Error updating persona:', updateError);
        throw updateError;
      }

      toast({
        title: "Avatar Generation Complete",
        description: "Successfully generated avatar for the test persona.",
      });
    } catch (error) {
      console.error('Error in avatar generation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate avatar. Please try again.",
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
        {isGenerating ? "Generating Avatar..." : "Generate Test Avatar"}
      </Button>
    </div>
  );
};

export default GenerateAvatars;
