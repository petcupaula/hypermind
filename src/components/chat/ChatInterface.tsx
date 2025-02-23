import { useEffect, useState } from "react";
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

interface UserProfile {
  avatar_url?: string;
  role?: string;
  company?: string;
  name?: string;
}

const ChatInterface = ({ scenario }: ChatInterfaceProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasError, setHasError] = useState(false);

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
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User from auth:', user);
      
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('avatar_url, role, company, name')
          .eq('id', user.id)
          .single();
          
        console.log('Profile from database:', profile);
        console.log('Profile error if any:', error);
        
        if (profile) {
          console.log('Avatar URL:', profile.avatar_url);
          setUserProfile(profile);
        }
      }
    };
    getUserProfile();
  }, []);

  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath) return undefined;
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarPath);
    return data.publicUrl;
  };

  const handleDisconnect = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      console.log('Stopped recording audio due to disconnection');
    }
    setDuration(0);
    audioChunksRef.current = [];
    setHasError(true);
    // Auto-reset error state after 5 seconds
    setTimeout(() => setHasError(false), 5000);
  };

  useEffect(() => {
    if (isConnected) {
      setHasError(false);
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
          handleDisconnect();
        });
    } else {
      handleDisconnect();
    }

    return () => {
      handleDisconnect();
    };
  }, [isConnected]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-lg rounded-3xl border border-gray-100 shadow-xl">
      <div className="p-8 space-y-8">
        {/* Avatars and Connection */}
        <div className="flex items-center justify-center gap-12">
          {/* User */}
          <div className="text-center space-y-2 relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg mx-auto">
              <AvatarImage 
                src={getAvatarUrl(userProfile?.avatar_url)}
                alt="User avatar"
              />
              <AvatarFallback className="text-lg">
                {userProfile?.name?.[0] || 'Y'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">{userProfile?.name || 'You'}</div>
              {userProfile?.role && (
                <div className="text-sm text-gray-500">{userProfile.role}</div>
              )}
              {userProfile?.company && (
                <div className="text-sm text-gray-400">{userProfile.company}</div>
              )}
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-16 transition-colors ${isConnected ? 'bg-primary' : 'bg-gray-200'}`} />
              <div className={`p-2.5 rounded-full transition-all transform ${
                isConnected 
                  ? 'bg-primary text-white scale-110 shadow-lg' 
                  : hasError
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                <Phone className="h-5 w-5" />
              </div>
              <div className={`h-[2px] w-16 transition-colors ${isConnected ? 'bg-primary' : 'bg-gray-200'}`} />
            </div>
            {hasError ? (
              <div className="text-sm font-medium text-red-500 animate-fade-in">
                Call disconnected
              </div>
            ) : (isConnected || lastCallDuration) && (
              <div className="text-sm font-medium text-gray-500">
                {isConnected 
                  ? formatDuration(duration)
                  : `Last call: ${formatDuration(lastCallDuration)}`
                }
              </div>
            )}
          </div>

          {/* Persona */}
          <div className="text-center space-y-2 relative">
            <PersonaAvatar 
              avatarUrl={scenario.persona.avatarUrl} 
              name={scenario.persona.name}
              size="large"
              isActive={isConnected && isSpeaking}
            />
            <div>
              <div className="text-lg font-semibold">{scenario.persona.name}</div>
              <div className="text-sm text-gray-500">{scenario.persona.role}</div>
              {scenario.persona.company && (
                <div className="text-sm text-gray-400">{scenario.persona.company}</div>
              )}
            </div>
          </div>
        </div>

        {/* Scenario Info */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {scenario.title}
            </h2>
            <p className="text-gray-500">{scenario.description}</p>
          </div>
        </div>

        {/* Call Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className={`px-8 py-6 text-base font-medium transition-all transform hover:scale-105 ${
              isConnected 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-primary hover:bg-primary/90'
            }`}
            onClick={isConnected ? stopConversation : startConversation}
          >
            <Phone className={`h-5 w-5 mr-2 ${isConnected && 'animate-pulse'}`} />
            {isConnected ? 'End Call' : 'Start Call'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
