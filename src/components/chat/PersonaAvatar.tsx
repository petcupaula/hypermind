
import { Bot } from "lucide-react";
import { transformImageUrl } from "@/utils/audio-utils";

interface PersonaAvatarProps {
  avatarUrl?: string;
  name?: string;
  isSpeaking?: boolean;
}

export const PersonaAvatar = ({ avatarUrl, name, isSpeaking = false }: PersonaAvatarProps) => {
  return (
    <div className={`relative ${isSpeaking ? 'after:absolute after:inset-[-3px] after:rounded-lg after:animate-pulse after:bg-gradient-to-r after:from-primary/40 after:via-violet-500/40 after:to-primary/40' : ''}`}>
      <div className={`bg-primary/10 rounded-lg w-[74px] h-[74px] flex items-center justify-center overflow-hidden relative ${isSpeaking ? 'shadow-lg ring-2 ring-primary/20' : ''}`}>
        {avatarUrl ? (
          <img
            src={transformImageUrl(avatarUrl)}
            alt={name || "Persona avatar"}
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
    </div>
  );
};
