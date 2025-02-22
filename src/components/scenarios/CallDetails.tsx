import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, RefreshCcw, Calendar, Clock, CheckCircle2, XCircle, Pause } from "lucide-react";
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
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

      const { data: apiKeyData, error: apiKeyError } = await supabase
        .functions.invoke('get-secret', {
          body: { secretName: 'VITE_ELEVENLABS_API_KEY' }
        });
      
      if (apiKeyError || !apiKeyData?.secret) {
        throw new Error('Failed to fetch ElevenLabs API key');
      }

      console.log('Making ElevenLabs API calls with API key present:', !!apiKeyData.secret);

      // Fetch conversation details
      const conversationResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${call.elevenlabs_conversation_id}`, {
        headers: {
          'xi-api-key': apiKeyData.secret,
        },
      });

      if (!conversationResponse.ok) {
        if (conversationResponse.status === 401) {
          throw new Error('Invalid or missing ElevenLabs API key');
        }
        throw new Error(`Failed to fetch ElevenLabs conversation details: ${conversationResponse.status}`);
      }

      const conversationData = await conversationResponse.json();
      
      // Fetch audio recording
      console.log('Fetching ElevenLabs audio recording...');
      const audioResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${call.elevenlabs_conversation_id}/audio`, {
        headers: {
          'xi-api-key': apiKeyData.secret,
        },
      });

      if (!audioResponse.ok) {
        console.error('Failed to fetch audio:', audioResponse.status);
        throw new Error(`Failed to fetch ElevenLabs audio: ${audioResponse.status}`);
      }

      const audioBlob = await audioResponse.blob();
      console.log('Audio blob size:', audioBlob.size);

      // Upload audio to Supabase storage
      const fileName = `elevenlabs-recording-${call.elevenlabs_conversation_id}.mp3`;
      const filePath = `${sessionData.session.user.id}/${fileName}`;

      console.log('Uploading audio to Supabase storage...');
      const { error: uploadError } = await supabase.storage
        .from('call-recordings')
        .upload(filePath, audioBlob, {
          contentType: 'audio/mpeg',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading audio:', uploadError);
        throw uploadError;
      }

      // Get the public URL for the uploaded audio
      const { data: { publicUrl } } = supabase.storage
        .from('call-recordings')
        .getPublicUrl(filePath);

      // Update the call history record
      const { error: updateError } = await supabase
        .from('call_history')
        .update({
          transcript_summary: conversationData.analysis?.transcript_summary || null,
          evaluation_criteria_results: conversationData.analysis?.evaluation_criteria_results || null,
          data_collection_results: conversationData.analysis?.data_collection_results || null,
          call_successful: conversationData.state === 'completed',
          elevenlabs_recording_url: publicUrl
        })
        .eq('id', id);

      if (updateError) throw updateError;

      return conversationData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-details', id] });
      toast({
        title: "Success",
        description: "Conversation details and recording updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error fetching ElevenLabs details:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch conversation details",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (call && 
        call.elevenlabs_conversation_id && 
        !call.transcript_summary && 
        !fetchElevenLabsDetails.isPending) {
      console.log('Auto-fetching ElevenLabs conversation details...');
      fetchElevenLabsDetails.mutate();
    }
  }, [call?.elevenlabs_conversation_id, call?.transcript_summary]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAudio = async (recordingUrl: string) => {
    try {
      if (activeAudio) {
        if (activeAudio.src === recordingUrl) {
          // Toggle play/pause for the same audio
          if (isPlaying) {
            activeAudio.pause();
            setIsPlaying(false);
          } else {
            await activeAudio.play();
            setIsPlaying(true);
          }
          return;
        } else {
          // Stop previous audio if playing a different one
          activeAudio.pause();
          activeAudio.currentTime = 0;
          setActiveAudio(null);
          setIsPlaying(false);
        }
      }

      // Create and play new audio
      const audio = new Audio(recordingUrl);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      await audio.play();
      setActiveAudio(audio);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to play recording",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }
    };
  }, [activeAudio]);

  const renderCriteriaResults = (results: unknown) => {
    const typedResults = results as EvalCriteriaResult[];
    if (!Array.isArray(typedResults)) return null;
    
    return typedResults.map((result, index) => (
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

  const renderDataCollectionResults = (results: unknown) => {
    const typedResults = results as DataCollectionResult[];
    if (!Array.isArray(typedResults)) return null;

    return typedResults.map((result, index) => (
      <div key={index} className="bg-muted/50 rounded-lg p-4">
        <p className="font-medium mb-1">{result.field}</p>
        <p className="text-sm">{result.value || 'Not collected'}</p>
      </div>
    ));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading call details...</div>;
  }

  if (!call) {
    return <div className="text-center py-8">Call not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/history')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Calls
        </Button>
        {call?.elevenlabs_conversation_id && !fetchElevenLabsDetails.isPending && (
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
          {call.transcript_summary && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Conversation Summary</h3>
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                {call.transcript_summary}
              </div>
            </div>
          )}

          {call.evaluation_criteria_results && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Evaluation Criteria</h3>
              <div className="space-y-3">
                {renderCriteriaResults(call.evaluation_criteria_results)}
              </div>
            </div>
          )}

          {call.data_collection_results && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Data Collection Results</h3>
              <div className="grid gap-3">
                {renderDataCollectionResults(call.data_collection_results)}
              </div>
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

          {(call.recording_url || call.elevenlabs_recording_url) && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Recordings</h3>
              <div className="space-y-3">
                {call.recording_url && (
                  <Button
                    variant="secondary"
                    onClick={() => handleAudio(call.recording_url!)}
                    className="gap-2 min-w-[200px] justify-start"
                  >
                    {isPlaying && activeAudio?.src === call.recording_url ? (
                      <><Pause className="h-4 w-4" /> Pause Local Recording</>
                    ) : (
                      <><Play className="h-4 w-4" /> Play Local Recording</>
                    )}
                  </Button>
                )}
                {call.elevenlabs_recording_url && (
                  <Button
                    variant="secondary"
                    onClick={() => handleAudio(call.elevenlabs_recording_url!)}
                    className="gap-2 min-w-[200px] justify-start"
                  >
                    {isPlaying && activeAudio?.src === call.elevenlabs_recording_url ? (
                      <><Pause className="h-4 w-4" /> Pause ElevenLabs Recording</>
                    ) : (
                      <><Play className="h-4 w-4" /> Play ElevenLabs Recording</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CallDetails;
