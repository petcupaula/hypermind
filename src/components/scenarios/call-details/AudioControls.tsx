
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import type { CallRecord } from "./types";

interface AudioControlsProps {
  call: CallRecord;
  isPlaying: boolean;
  activeAudio: HTMLAudioElement | null;
  handleAudio: (url: string) => void;
}

export const AudioControls = ({ call, isPlaying, activeAudio, handleAudio }: AudioControlsProps) => {
  if (!call.recording_url && !call.elevenlabs_recording_url) return null;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Recordings</h3>
      <div className="space-y-3">
        {call.recording_url && (
          <Button
            variant="secondary"
            onClick={() => handleAudio(call.recording_url!)}
            className="gap-2 min-w-[200px] justify-start"
          >
            {isPlaying && activeAudio?.src === call.recording_url ? (
              <><Pause className="h-4 w-4" /> Pause Local Recording</>
            ) : (
              <><Play className="h-4 w-4" /> Play Local Recording</>
            )}
          </Button>
        )}
        {call.elevenlabs_recording_url && (
          <Button
            variant="secondary"
            onClick={() => handleAudio(call.elevenlabs_recording_url!)}
            className="gap-2 min-w-[200px] justify-start"
          >
            {isPlaying && activeAudio?.src === call.elevenlabs_recording_url ? (
              <><Pause className="h-4 w-4" /> Pause ElevenLabs Recording</>
            ) : (
              <><Play className="h-4 w-4" /> Play ElevenLabs Recording</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
