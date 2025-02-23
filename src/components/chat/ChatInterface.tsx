
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Scenario } from "@/components/scenarios/ScenarioCard";
import { PersonaAvatar } from "./PersonaAvatar";
import { useConversationManager } from "@/hooks/useConversationManager";
import { formatDuration } from "@/utils/audio-utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

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

  const user = supabase.auth.getUser();
  const userAvatarUrl = user?.data?.user?.user_metadata?.avatar_url;

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
        <div className="flex flex-col items-center gap-6">
          <div className="w-full flex items-center justify-center gap-6 relative">
            {/* Current User Avatar */}
            <div className="text-center">
              <Avatar className="w-[100px] h-[100px] border-4 border-background mb-2">
                <AvatarImage src={userAvatarUrl} />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">You</div>
              <div className="text-xs text-gray-600">User</div>
            </div>

            {/* Connection Line */}
            <div className="flex items-center gap-2">
              <div className={`h-[2px] w-12 transition-colors ${isConnected ? 'bg-primary' : 'bg-gray-200'}`} />
              <div className={`p-2 rounded-full transition-colors ${isConnected ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                <Phone className="h-4 w-4" />
              </div>
              <div className={`h-[2px] w-12 transition-colors ${isConnected ? 'bg-primary' : 'bg-gray-200'}`} />
            </div>

            {/* Persona Avatar */}
            <div className="text-center">
              <div className="mb-2">
                <PersonaAvatar 
                  avatarUrl={scenario.persona.avatarUrl} 
                  name={scenario.persona.name}
                  size="large"
                  isActive={isConnected && isSpeaking}
                />
              </div>
              <div className="text-sm font-medium">{scenario.persona.name}</div>
              <div className="text-xs text-gray-600">{scenario.persona.role}</div>
            </div>
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
            {scenario.persona.company && (
              <div className="text-sm text-gray-600">
                at {scenario.persona.company}
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
