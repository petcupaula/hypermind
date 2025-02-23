
import { Bot } from "lucide-react";
import { transformImageUrl } from "@/utils/audio-utils";

interface PersonaAvatarProps {
  avatarUrl?: string;
  name?: string;
  size?: "default" | "large";
  isActive?: boolean;
}

export const PersonaAvatar = ({ avatarUrl, name, size = "default", isActive }: PersonaAvatarProps) => {
  const sizeClasses = size === "large" ? "w-[100px] h-[100px]" : "w-[74px] h-[74px]";
  
  return (
    <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
      <div className={`bg-primary/10 rounded-lg ${sizeClasses} flex items-center justify-center overflow-hidden`}>
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
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <div className="bg-primary text-xs text-white px-2 py-0.5 rounded-full">
            Speaking...
          </div>
        </div>
      )}
    </div>
  );
};
