
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CallRecord {
  id: string;
  scenario_id: string;
  duration: number;
  transcript: string | null;
  recording_url: string | null;
  created_at: string;
  scenarios: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    persona: {
      name: string;
      role: string;
      company: string;
    };
  };
}

const CallHistory = () => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: calls = [], isLoading } = useQuery({
    queryKey: ['call-history'],
    queryFn: async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('No active session found');
        return [];
      }

      const { data, error } = await supabase
        .from('call_history')
        .select(`
          *,
          scenarios (
            title,
            description,
            category,
            difficulty,
            persona:personas (
              name,
              role,
              company
            )
          )
        `)
        .eq('user_id', sessionData.session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching call history:', error);
        toast({
          title: "Error",
          description: "Failed to load call history",
          variant: "destructive",
        });
        return [];
      }

      return data as CallRecord[];
    }
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const playAudio = async (recordingUrl: string, callId: string) => {
    try {
      const audio = new Audio(recordingUrl);
      audio.addEventListener('ended', () => setPlayingAudioId(null));
      await audio.play();
      setPlayingAudioId(callId);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to play recording",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading call history...</div>;
  }

  if (calls.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="py-8 text-center text-muted-foreground">
          No calls recorded yet. Start a conversation to begin building your history.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {calls.map((call) => (
        <Card key={call.id} className="bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{call.scenarios.title}</CardTitle>
                <CardDescription className="mt-1.5 space-y-1">
                  <p>{call.scenarios.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-primary">
                      {call.scenarios.persona.name} • {call.scenarios.persona.role} at {call.scenarios.persona.company}
                    </p>
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                      call.scenarios.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                      call.scenarios.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {call.scenarios.difficulty}
                    </span>
                  </div>
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(call.created_at), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDuration(call.duration)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {call.transcript && (
              <div className="mb-4">
                <div className="font-medium mb-2">Transcript</div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {call.transcript}
                </div>
              </div>
            )}
            {call.recording_url && (
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => playAudio(call.recording_url!, call.id)}
                disabled={playingAudioId === call.id}
              >
                <Play className="h-4 w-4" />
                {playingAudioId === call.id ? 'Playing...' : 'Play Recording'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CallHistory;
