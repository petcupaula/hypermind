
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Bot } from "lucide-react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/components/ui/use-toast";
import { Scenario } from "@/components/scenarios/ScenarioCard";

interface ChatInterfaceProps {
  scenario: Scenario;
}

const ChatInterface = ({ scenario }: ChatInterfaceProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [lastCallDuration, setLastCallDuration] = useState<number | null>(null);
  const { toast } = useToast();
  const conversationRef = useRef(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    api_key: import.meta.env.VITE_ELEVENLABS_API_KEY,
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
        setLastCallDuration(duration);
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
          prompt: scenario.persona.prompt,
        },
        firstMessage: scenario.persona.firstMessage,
      },
      tts: {
        voiceId: scenario.persona.voiceId,
      },
    },
  });

  // Format duration into MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isConnected) {
      // Start the timer when connected
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      // Clear the timer and reset duration when disconnected
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnected]);

  const startConversation = async () => {
    try {
      console.log("Starting conversation - Requesting microphone access...");
      setLastCallDuration(null); // Reset last call duration when starting new call
      
      // Request microphone access before starting
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log("Microphone access granted", stream.active);
      
      // Start the conversation with your agent ID
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

  const stopConversation = () => {
    console.log("Manually stopping conversation...");
    if (conversationRef.current) {
      setLastCallDuration(duration); // Store the duration when manually stopping
      conversationRef.current.endSession();
      conversationRef.current = null;
      setIsConnected(false);
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
          <div className="bg-primary/10 p-2 rounded-lg">
            <Bot className="h-5 w-5 text-primary" />
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
