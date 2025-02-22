import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Bot } from "lucide-react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/components/ui/use-toast";
import { Scenario } from "@/components/scenarios/ScenarioCard";
import { supabase } from "@/integrations/supabase/client";

interface ChatInterfaceProps {
  scenario: Scenario;
}

const ChatInterface = ({ scenario }: ChatInterfaceProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [lastCallDuration, setLastCallDuration] = useState<number | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const { toast } = useToast();
  const conversationRef = useRef(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriptMessagesRef = useRef<string[]>([]);

  const transformImageUrl = (url: string) => {
    if (!url) return url;
    return `${url}?width=300&height=300&resize=contain`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const conversation = useConversation({
    api_key: import.meta.env.VITE_ELEVENLABS_API_KEY,
    onConnect: () => {
      console.log("Connected to ElevenLabs - Setting up session...");
      setIsConnected(true);
      transcriptMessagesRef.current = [];
      toast({
        title: "Connected",
        description: "Voice chat is now active",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs - Cleaning up session...");
      if (isConnected) {
        setIsConnected(false);
        setLastCallDuration(duration);
        saveCallHistory();
        toast({
          title: "Disconnected",
          description: "Voice chat connection ended",
        });
      }
    },
    onMessage: (message) => {
      console.log("Received message:", message);
      if (message.type === 'agent_response_started') {
        console.log("Agent started speaking");
        setIsSpeaking(true);
      } else if (message.type === 'agent_response_ended') {
        console.log("Agent finished speaking");
        setIsSpeaking(false);
      } else if (message.type === 'transcript') {
        transcriptMessagesRef.current.push(message.text);
        setCurrentTranscript(prev => prev + "\n" + message.text);
      }
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to establish voice chat connection",
        variant: "destructive",
      });
      setIsConnected(false);
    },
    overrides: {
      agent: {
        prompt: {
          prompt: scenario.persona.prompt,
        },
        firstMessage: scenario.persona.firstMessage,
      },
      tts: {
        voiceId: scenario.persona.voiceId,
      },
    },
  });

  const saveCallHistory = async () => {
    if (!duration) {
      console.log('No duration recorded, skipping call history save');
      return;
    }

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('No active session found');
        return;
      }

      console.log('Starting call history save with duration:', duration);
      console.log('Audio chunks:', audioChunksRef.current.length);
      console.log('Transcript messages:', transcriptMessagesRef.current.length);

      const fullTranscript = transcriptMessagesRef.current.join('\n');

      const { error: insertError } = await supabase.from('call_history').insert({
        user_id: sessionData.session.user.id,
        scenario_id: scenario.id,
        duration,
        transcript: fullTranscript || null,
      });

      if (insertError) {
        console.error('Error saving call history:', insertError);
        toast({
          title: "Error",
          description: "Failed to save call history",
          variant: "destructive",
        });
        return;
      }

      if (audioChunksRef.current.length > 0) {
        try {
          console.log('Processing audio recording...');
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const fileName = `call-${Date.now()}.webm`;
          const filePath = `${sessionData.session.user.id}/${fileName}`;
          const file = new File([audioBlob], fileName, { type: 'audio/webm' });
          
          console.log('Uploading recording to storage...');
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('call-recordings')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading recording:', uploadError);
            throw uploadError;
          }

          console.log('Recording uploaded successfully');
          const { data: { publicUrl } } = supabase.storage
            .from('call-recordings')
            .getPublicUrl(filePath);

          const { error: updateError } = await supabase
            .from('call_history')
            .update({ recording_url: publicUrl })
            .eq('scenario_id', scenario.id)
            .eq('user_id', sessionData.session.user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (updateError) {
            console.error('Error updating recording URL:', updateError);
            throw updateError;
          }
        } catch (error) {
          console.error('Error handling recording:', error);
          toast({
            title: "Warning",
            description: "Call saved but failed to save recording",
            variant: "destructive",
          });
          return;
        }
      }

      console.log('Call history saved successfully');
      toast({
        title: "Success",
        description: "Call history saved successfully",
      });

    } catch (error) {
      console.error('Error in saveCallHistory:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving the call",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              console.log('Audio data available:', event.data.size, 'bytes');
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.start(1000);
          console.log('Started recording audio');
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
          toast({
            title: "Error",
            description: "Failed to access microphone",
            variant: "destructive",
          });
        });
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        console.log('Stopped recording audio');
      }
      setDuration(0);
      setCurrentTranscript("");
      audioChunksRef.current = [];
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        console.log('Cleanup: stopped recording audio');
      }
    };
  }, [isConnected]);

  const startConversation = async () => {
    try {
      console.log("Starting conversation - Requesting microphone access...");
      setLastCallDuration(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log("Microphone access granted", stream.active);
      
      console.log("Initiating ElevenLabs session...");
      await conversation.startSession({
        agentId: "IFTHFHzCj8SPqmuq1gSq",
        connectionOptions: {
          reconnect: true,
          maxRetries: 3,
        },
      });
      
      conversationRef.current = conversation;
      
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start voice chat. Please ensure microphone access is allowed.",
        variant: "destructive",
      });
      setIsConnected(false);
    }
  };

  const stopConversation = async () => {
    console.log("Manually stopping conversation...");
    if (conversationRef.current) {
      try {
        setLastCallDuration(duration);
        
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          console.log('Stopped recording audio');
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await saveCallHistory();
        
        conversationRef.current.endSession();
        conversationRef.current = null;
        setIsConnected(false);
      } catch (error) {
        console.error('Error during conversation stop:', error);
        toast({
          title: "Error",
          description: "Failed to properly end the call",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      console.log("Component unmounting, cleaning up conversation...");
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b p-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 rounded-lg w-[74px] h-[74px] flex items-center justify-center overflow-hidden">
            {scenario.persona.avatarUrl ? (
              <img
                src={transformImageUrl(scenario.persona.avatarUrl)}
                alt={scenario.persona.name || "Persona avatar"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-icon')?.removeAttribute('style');
                }}
              />
            ) : (
              <Bot className="h-6 w-6 text-primary fallback-icon" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium">{scenario.title}</h3>
              {isConnected ? (
                <span className="text-sm font-medium text-primary">
                  {formatDuration(duration)}
                </span>
              ) : lastCallDuration ? (
                <span className="text-sm text-gray-500">
                  Last call: {formatDuration(lastCallDuration)}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-gray-500 mb-2">{scenario.description}</p>
            {scenario.persona.name && (
              <div className="flex items-center gap-2 mt-2">
                <div className="text-sm">
                  <span className="font-medium">{scenario.persona.name}</span>
                  {scenario.persona.role && scenario.persona.company && (
                    <span className="text-gray-600">
                      {" "}• {scenario.persona.role} at {scenario.persona.company}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex items-center justify-center">
        <Button
          size="lg"
          className={`gap-2 ${isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
          onClick={isConnected ? stopConversation : startConversation}
        >
          <Mic className={`h-5 w-5 ${isConnected && 'animate-pulse'}`} />
          {isConnected ? 'End Call' : 'Start Call'}
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
