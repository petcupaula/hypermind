
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
    <div className="relative">
      <div 
        className={`
          relative 
          bg-primary/10 
          rounded-full 
          ${sizeClasses} 
          flex 
          items-center 
          justify-center 
          overflow-hidden
          transition-all
          duration-200
          ${isActive ? 'ring-4 ring-primary ring-offset-2 scale-105' : ''}
        `}
      >
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
        {isActive && (
          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
        )}
      </div>
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="bg-primary text-xs text-white px-3 py-1 rounded-full shadow-lg">
            Speaking...
          </div>
        </div>
      )}
    </div>
  );
};
