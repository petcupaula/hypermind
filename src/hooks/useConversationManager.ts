
import { useState, useRef } from 'react';
import { useConversation } from "@11labs/react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Scenario } from "@/components/scenarios/ScenarioCard";

export const useConversationManager = (scenario: Scenario) => {
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
  const currentCallRef = useRef<{ id: string } | null>(null);

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
        elevenlabs_conversation_id: currentCallRef.current?.id || null,
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
      
      if ('source' in message) {
        const messageText = message.message;
        if (typeof messageText === 'string') {
          transcriptMessagesRef.current.push(`${message.source}: ${messageText}`);
          setCurrentTranscript(prev => prev + "\n" + `${message.source}: ${messageText}`);
        }
      } else if (message.type === 'agent_response_started') {
        console.log("Agent started speaking");
        setIsSpeaking(true);
      } else if (message.type === 'agent_response_ended') {
        console.log("Agent finished speaking");
        setIsSpeaking(false);
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
      const conversationId = await conversation.startSession({
        agentId: "IFTHFHzCj8SPqmuq1gSq",
        connectionOptions: {
          reconnect: true,
          maxRetries: 3,
        },
      });
      
      console.log("Conversation started with ID:", conversationId);
      currentCallRef.current = { id: conversationId };
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
        currentCallRef.current = null;
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

  return {
    isConnected,
    isSpeaking,
    duration,
    lastCallDuration,
    currentTranscript,
    mediaRecorderRef,
    audioChunksRef,
    timerRef,
    startConversation,
    stopConversation,
    setDuration,
  };
};
