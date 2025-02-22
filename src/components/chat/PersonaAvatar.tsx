
import { Bot } from "lucide-react";
import { transformImageUrl } from "@/utils/audio-utils";

interface PersonaAvatarProps {
  avatarUrl?: string;
  name?: string;
}

export const PersonaAvatar = ({ avatarUrl, name }: PersonaAvatarProps) => {
  return (
    <div className="bg-primary/10 rounded-lg w-[74px] h-[74px] flex items-center justify-center overflow-hidden">
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
  );
};
