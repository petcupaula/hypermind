
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Scenario } from "@/components/scenarios/ScenarioCard";
import { PersonaAvatar } from "./PersonaAvatar";
import { useConversationManager } from "@/hooks/useConversationManager";
import { formatDuration } from "@/utils/audio-utils";

interface ChatInterfaceProps {
  scenario: Scenario;
}

const ChatInterface = ({ scenario }: ChatInterfaceProps) => {
  const {
    isConnected,
    isSpeaking,
    duration,
    lastCallDuration,
    mediaRecorderRef,
    audioChunksRef,
    timerRef,
    startConversation,
    stopConversation,
    setDuration,
  } = useConversationManager(scenario);

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

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex justify-center">
            <PersonaAvatar 
              avatarUrl={scenario.persona.avatarUrl} 
              name={scenario.persona.name} 
            />
          </div>
          <div className="text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-1">
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
            <p className="text-sm text-gray-500 mb-4">{scenario.description}</p>
            {scenario.persona.name && (
              <div className="flex items-center justify-center gap-2">
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
          <Phone className={`h-5 w-5 ${isConnected && 'animate-pulse'}`} />
          {isConnected ? 'End Call' : 'Start Call'}
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
