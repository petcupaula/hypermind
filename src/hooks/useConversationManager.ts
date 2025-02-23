import { useState, useRef, useEffect } from 'react';
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const durationRef = useRef<number>(0);

  const setupAudioCapture = async (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      destinationRef.current = audioContextRef.current.createMediaStreamDestination();

      const micSource = audioContextRef.current.createMediaStreamSource(stream);
      micSource.connect(destinationRef.current);

      const audioElement = new Audio();
      audioElement.autoplay = true;
      
      audioElement.addEventListener('play', () => {
        if (audioContextRef.current && destinationRef.current) {
          const aiSource = audioContextRef.current.createMediaElementSource(audioElement);
          aiSource.connect(destinationRef.current);
          aiSource.connect(audioContextRef.current.destination);
        }
      });

      const combinedStream = destinationRef.current.stream;
      const mediaRecorder = new MediaRecorder(combinedStream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      return audioElement;
    } catch (error) {
      console.error('Error setting up audio capture:', error);
      throw error;
    }
  };

  const cleanupAudio = () => {
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
    audioContextRef.current = null;
    destinationRef.current = null;
  };

  const handleDisconnection = async (isServerInitiated: boolean = false) => {
    console.log(`Handling ${isServerInitiated ? 'server-initiated' : 'client-initiated'} disconnection`);
    
    const finalDuration = durationRef.current;
    console.log('Final duration:', finalDuration);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setLastCallDuration(finalDuration);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      console.log('Stopped recording audio');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    cleanupAudio();

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('No active session found');
        return;
      }

      const fullTranscript = transcriptMessagesRef.current.join('\n');

      const { error: insertError } = await supabase.from('call_history').insert({
        user_id: sessionData.session.user.id,
        scenario_id: scenario.id,
        duration: finalDuration,
        transcript: fullTranscript || null,
        elevenlabs_conversation_id: currentCallRef.current?.id || null,
      });

      if (insertError) {
        throw insertError;
      }

      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const fileName = `call-${Date.now()}.webm`;
        const filePath = `${sessionData.session.user.id}/${fileName}`;
        const file = new File([audioBlob], fileName, { type: 'audio/webm' });
        
        const { error: uploadError } = await supabase.storage
          .from('call-recordings')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('call-recordings')
          .getPublicUrl(filePath);

        await supabase
          .from('call_history')
          .update({ recording_url: publicUrl })
          .eq('scenario_id', scenario.id)
          .eq('user_id', sessionData.session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);
      }

      toast({
        title: "Success",
        description: "Call history saved successfully",
      });

    } catch (error) {
      console.error('Error saving call history:', error);
      toast({
        title: "Error",
        description: "Failed to save call history",
        variant: "destructive",
      });
    }

    audioChunksRef.current = [];
    transcriptMessagesRef.current = [];
    
    setIsConnected(false);
    currentCallRef.current = null;

    if (isServerInitiated) {
      toast({
        title: "Call Ended",
        description: "The call was disconnected by the server",
        variant: "default",
      });
    }
  };

  const conversation = useConversation({
    api_key: import.meta.env.VITE_ELEVENLABS_API_KEY,
    onConnect: () => {
      console.log("Connected to ElevenLabs - Setting up session...");
      setIsConnected(true);
      transcriptMessagesRef.current = [];
      durationRef.current = 0;
      setDuration(0);
      toast({
        title: "Connected",
        description: "Voice chat is now active",
      });
    },
    onDisconnect: () => {
      console.log("Server initiated disconnect - Cleaning up session...");
      handleDisconnection(true);
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
      handleDisconnection(true);
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
        audioElement: null,
      },
    },
  });

  const startConversation = async () => {
    try {
      console.log("Starting conversation - Requesting microphone access...");
      setLastCallDuration(null);
      setDuration(0);
      durationRef.current = 0;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log("Microphone access granted", stream.active);

      const audioElement = await setupAudioCapture(stream);
      
      console.log("Initiating ElevenLabs session...");
      const conversationId = await conversation.startSession({
        agentId: "IFTHFHzCj8SPqmuq1gSq",
        connectionOptions: {
          reconnect: true,
          maxRetries: 3,
        },
        audioElement,
      });
      
      console.log("Conversation started with ID:", conversationId);
      currentCallRef.current = { id: conversationId };
      conversationRef.current = conversation;
      
    } catch (error) {
      console.error("Error starting conversation:", error);
      cleanupAudio();
      toast({
        title: "Error",
        description: "Failed to start voice chat. Please ensure microphone access is allowed.",
        variant: "destructive",
      });
      setIsConnected(false);
    }
  };

  const stopConversation = async () => {
    console.log("Client initiated stop - Ending conversation...");
    if (conversationRef.current) {
      try {
        await handleDisconnection(false);
        conversationRef.current.endSession();
        conversationRef.current = null;
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
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          durationRef.current = newDuration;
          return newDuration;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnected]);

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
