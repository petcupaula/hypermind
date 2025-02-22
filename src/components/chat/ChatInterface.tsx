
import { PersonaAvatar } from "./PersonaAvatar";
import { useConversationManager } from "@/hooks/useConversationManager";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDuration } from "@/utils/audio-utils";
import { Scenario } from "../scenarios/ScenarioCard";

interface ChatInterfaceProps {
  scenario: Scenario;
}

const ChatInterface = ({ scenario }: ChatInterfaceProps) => {
  const {
    isConnected,
    isSpeaking,
    duration,
    lastCallDuration,
    currentTranscript,
    startConversation,
    stopConversation,
    setDuration
  } = useConversationManager(scenario);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isConnected) {
      intervalId = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isConnected, setDuration]);

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-6">
        <PersonaAvatar 
          avatarUrl={scenario.persona.avatarUrl} 
          name={scenario.persona.name}
          isSpeaking={isSpeaking}
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">{scenario.persona.name}</h2>
          <p className="text-gray-600">{scenario.persona.role} at {scenario.persona.company}</p>
        </div>
        <div className="text-right space-y-2">
          <Button
            variant={isConnected ? "destructive" : "default"}
            className="gap-2"
            onClick={isConnected ? stopConversation : startConversation}
          >
            {isConnected ? (
              <>
                <PhoneOff className="h-4 w-4" />
                End Call
              </>
            ) : (
              <>
                <Phone className="h-4 w-4" />
                Start Call
              </>
            )}
          </Button>
          {isConnected && (
            <div className="text-sm font-medium">
              {formatDuration(duration)}
            </div>
          )}
          {lastCallDuration !== null && !isConnected && (
            <div className="text-sm text-gray-500">
              Last call: {formatDuration(lastCallDuration)}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] relative">
        <div className="absolute bottom-6 right-6">
          {isConnected && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500' : 'bg-red-500'}`} />
              {isSpeaking ? 'AI Speaking' : 'AI Listening'}
            </div>
          )}
        </div>
        <div className="whitespace-pre-wrap">
          {currentTranscript || (
            <span className="text-gray-500">
              {isConnected
                ? "Conversation will appear here..."
                : "Start the call to begin the conversation"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
