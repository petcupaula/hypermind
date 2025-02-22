
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Bot, Volume2, VolumeX } from "lucide-react";
import { AudioRecorder, AudioQueue, encodeAudioData } from "@/utils/audio";

const ChatInterface = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<AudioQueue>(new AudioQueue(new AudioContext()));
  const recorderRef = useRef<AudioRecorder | null>(null);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      recorderRef.current?.stop();
    };
  }, []);

  const startConversation = async () => {
    try {
      // Connect to our Supabase Edge Function WebSocket
      wsRef.current = new WebSocket(`wss://${import.meta.env.VITE_SUPABASE_PROJECT_REF}.functions.supabase.co/realtime-chat`);

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'response.audio.delta') {
          // Convert base64 to audio data and play
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await audioQueueRef.current.addToQueue(bytes);
          setIsSpeaking(true);
        } else if (data.type === 'response.audio.done') {
          setIsSpeaking(false);
        }
      };

      wsRef.current.onopen = async () => {
        setIsConnected(true);
        
        // Start recording audio
        recorderRef.current = new AudioRecorder((audioData: Float32Array) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const event = {
              type: 'input_audio_buffer.append',
              audio: encodeAudioData(audioData)
            };
            wsRef.current.send(JSON.stringify(event));
          }
        });
        
        await recorderRef.current.start();
      };

    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const stopConversation = () => {
    recorderRef.current?.stop();
    wsRef.current?.close();
    setIsConnected(false);
    setIsSpeaking(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioQueueRef.current) {
      audioQueueRef.current.setVolume(isMuted ? 1 : 0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Enterprise CTO Persona</h3>
              <p className="text-sm text-gray-500">Tech-savvy decision maker at a Fortune 500 company</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className={isSpeaking ? "opacity-100" : "opacity-50"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
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
