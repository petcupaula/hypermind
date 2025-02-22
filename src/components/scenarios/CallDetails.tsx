import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, RefreshCcw, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface CallDetailsProps {
  id?: string;
}

interface EvalCriteriaResult {
  criterion: string;
  passed: boolean;
  explanation: string;
}

interface DataCollectionResult {
  field: string;
  value: string | null;
}

interface ConversationAnalysis {
  transcript_summary?: string;
  evaluation_criteria_results?: EvalCriteriaResult[];
  data_collection_results?: DataCollectionResult[];
}

interface ConversationDetails {
  id: string;
  state: string;
  analysis?: ConversationAnalysis;
}

type CallRecord = Database["public"]["Tables"]["call_history"]["Row"] & {
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
};

const CallDetails = ({ id: propId }: CallDetailsProps) => {
  const { id: urlId } = useParams();
  const id = propId || urlId;
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: call, isLoading } = useQuery({
    queryKey: ['call-details', id],
    queryFn: async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error('No active session found');
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
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching call details:', error);
        throw error;
      }

      return data;
    }
  });

  const fetchElevenLabsDetails = useMutation({
    mutationFn: async () => {
      if (!call?.elevenlabs_conversation_id) {
        throw new Error('No ElevenLabs conversation ID found');
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('No active session');

      const response = await fetch(`https://api.elevenlabs.io/v1/conversation/${call.elevenlabs_conversation_id}`, {
        headers: {
          'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ElevenLabs conversation details');
      }

      const conversationDetails = await response.json();

      const { error: updateError } = await supabase
        .from('call_history')
        .update({
          conversation_details: conversationDetails,
          conversation_state: conversationDetails.state
        })
        .eq('id', id);

      if (updateError) throw updateError;

      return conversationDetails;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-details', id] });
      toast({
        title: "Success",
        description: "Conversation details updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error fetching ElevenLabs details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch conversation details",
        variant: "destructive",
      });
    },
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const playAudio = async (recordingUrl: string) => {
    try {
      const audio = new Audio(recordingUrl);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to play recording",
        variant: "destructive",
      });
    }
  };

  const renderCriteriaResults = (results: EvalCriteriaResult[]) => {
    return results.map((result, index) => (
      <div key={index} className="flex items-start gap-2 p-3 bg-muted/30 rounded-md">
        {result.passed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <p className="font-medium">{result.criterion}</p>
          <p className="text-sm text-muted-foreground">{result.explanation}</p>
        </div>
      </div>
    ));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading call details...</div>;
  }

  if (!call) {
    return <div className="text-center py-8">Call not found</div>;
  }

  const conversationDetails = call.conversation_details as ConversationDetails | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/history')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Calls
        </Button>
        {call?.elevenlabs_conversation_id && (
          <Button 
            variant="outline" 
            onClick={() => fetchElevenLabsDetails.mutate()}
            disabled={fetchElevenLabsDetails.isPending}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh Conversation Details
          </Button>
        )}
      </div>

      <Card className="bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{call.scenarios.title}</CardTitle>
              <CardDescription className="mt-2 space-y-2">
                <p className="text-base">{call.scenarios.description}</p>
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
        <CardContent className="space-y-6">
          {conversationDetails?.analysis && (
            <div className="space-y-6">
              {conversationDetails.analysis.transcript_summary && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Conversation Summary</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    {conversationDetails.analysis.transcript_summary}
                  </div>
                </div>
              )}

              {conversationDetails.analysis.evaluation_criteria_results && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Evaluation Criteria</h3>
                  <div className="space-y-3">
                    {renderCriteriaResults(conversationDetails.analysis.evaluation_criteria_results)}
                  </div>
                </div>
              )}

              {conversationDetails.analysis.data_collection_results && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Data Collection Results</h3>
                  <div className="grid gap-3">
                    {conversationDetails.analysis.data_collection_results.map((result, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-4">
                        <p className="font-medium mb-1">{result.field}</p>
                        <p className="text-sm">{result.value || 'Not collected'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {call.transcript && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Transcript</h3>
              <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                {call.transcript}
              </div>
            </div>
          )}

          {call.recording_url && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Recording</h3>
              <Button
                variant="secondary"
                onClick={() => playAudio(call.recording_url!)}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Play Recording
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CallDetails;
