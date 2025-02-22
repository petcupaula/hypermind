
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Bot, Volume2, VolumeX } from "lucide-react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/components/ui/use-toast";

const ChatInterface = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const { toast } = useToast();
  const conversationRef = useRef(null);

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    api_key: process.env.ELEVENLABS_API_KEY, // This should be set in your environment variables
    onConnect: () => {
      console.log("Connected to ElevenLabs - Setting up session...");
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Voice chat is now active",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs - Cleaning up session...");
      if (isConnected) {
        setIsConnected(false);
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
          prompt: "You are an Enterprise CTO Persona, a tech-savvy decision maker at a Fortune 500 company. Help users understand our product offerings and make informed decisions.",
        },
        firstMessage: "Hello! I'm your Enterprise CTO advisor. How can I assist you with your technology decisions today?",
        language: "en",
      },
      tts: {
        model_id: "eleven_multilingual_v2", // Specifying the model ID as per documentation
        voiceId: "pqHfZKP75CvOlQylNhV4", // Bill's voice ID - professional and authoritative
      },
      websocket: {
        url: "wss://api.elevenlabs.io/v1/conversation", // Correct WebSocket endpoint
      },
    },
  });

  const startConversation = async () => {
    try {
      console.log("Starting conversation - Requesting microphone access...");
      
      // Request microphone access before starting
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted", stream.active);
      
      // Start the conversation with your agent ID
      console.log("Initiating ElevenLabs session...");
      const response = await conversation.startSession({
        agentId: "IFTHFHzCj8SPqmuq1gSq",
        connectionOptions: {
          reconnect: true, // Enable auto-reconnection
          maxRetries: 3,
        },
      });
      
      console.log("Session started with response:", response);
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

  const stopConversation = () => {
    console.log("Manually stopping conversation...");
    if (conversationRef.current) {
      conversationRef.current.endSession();
    }
  };

  const toggleMute = () => {
    const newVolume = isMuted ? 1 : 0;
    setIsMuted(!isMuted);
    setVolume(newVolume);
    if (conversationRef.current) {
      conversationRef.current.setVolume({ volume: newVolume });
    }
  };

  useEffect(() => {
    // Cleanup function
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Enterprise CTO Persona</h3>
              <p className="text-sm text-gray-500">Tech-savvy decision maker at a Fortune 500 company</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className={isSpeaking ? "opacity-100" : "opacity-50"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
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
