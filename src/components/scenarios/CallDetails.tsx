import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import dataCollectionConfig from "@/config/dataCollectionConfig";
import { CallHeader } from "./call-details/CallHeader";
import { AudioControls } from "./call-details/AudioControls";
import { DataCollectionResults } from "./call-details/DataCollectionResults";
import { ProspectQuestions } from "./call-details/ProspectQuestions";
import type { CallRecord, EvaluationResult } from "./call-details/types";
import type { Json } from "@/integrations/supabase/types";

interface CallDetailsProps {
  id?: string;
}

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

      return data as CallRecord;
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
          if (isPlaying) {
            activeAudio.pause();
            setIsPlaying(false);
          } else {
            await activeAudio.play();
            setIsPlaying(true);
          }
          return;
        } else {
          activeAudio.pause();
          activeAudio.currentTime = 0;
          setActiveAudio(null);
          setIsPlaying(false);
        }
      }

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
    const typedResults = results as { [key: string]: EvaluationResult };
    if (!typedResults || typeof typedResults !== 'object') return null;
    
    return Object.entries(typedResults).map(([key, result]) => (
      <div key={key} className="flex items-start gap-2 p-3 bg-muted/30 rounded-md">
        {result.result === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <div className="font-medium capitalize">{key.replace(/_/g, ' ')}</div>
          <div className="text-sm text-muted-foreground">{result.rationale}</div>
        </div>
      </div>
    ));
  };

  const getDataCollectionResultStatus = (key: string, value: boolean | number | null) => {
    const config = dataCollectionConfig[key];
    if (!config) {
      return { isGood: false, description: "Unknown metric" };
    }
    return config.evaluate(value);
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
        {call.elevenlabs_conversation_id && !fetchElevenLabsDetails.isPending && (
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
        <CallHeader call={call} formatDuration={formatDuration} />
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
              <div className="space-y-3">
                <DataCollectionResults results={call.data_collection_results} />
              </div>
            </div>
          )}

          {call.data_collection_results && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Prospect Questions</h3>
              <ProspectQuestions results={call.data_collection_results} />
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

          <AudioControls 
            call={call}
            isPlaying={isPlaying}
            activeAudio={activeAudio}
            handleAudio={handleAudio}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CallDetails;
