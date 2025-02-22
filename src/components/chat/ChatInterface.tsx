
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Volume2, VolumeX } from "lucide-react";
import { useConversation } from "@11labs/react";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm interested in learning more about your solution. We're currently facing some challenges with our data infrastructure. Can you tell me how your product might help?"
    }
  ]);

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
    voiceId: "CwhRBWXzGAHq8TQ4Fs17", // Using Roger voice
    model: "eleven_turbo_v2",
  });

  useEffect(() => {
    // Start the conversation session when component mounts
    const initConversation = async () => {
      try {
        await conversation.startSession({});
      } catch (error) {
        console.error("Error starting conversation:", error);
      }
    };

    initConversation();

    // Clean up the conversation session when component unmounts
    return () => {
      conversation.endSession();
    };
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);

    // Clear input
    setMessage("");

    // AI response
    const aiResponse = {
      role: "assistant",
      content: "Our solution provides a robust data infrastructure that can handle your enterprise needs. We offer seamless integration, real-time analytics, and scalable architecture that can grow with your business. Would you like me to elaborate on any specific aspect?"
    };

    // Add AI response to chat
    setMessages(prev => [...prev, aiResponse]);

    try {
      // Use the conversation to speak the response
      const blob = new Blob([aiResponse.content], { type: 'text/plain' });
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  const toggleMute = async () => {
    if (conversation.isSpeaking) {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className={conversation.isSpeaking ? "opacity-100" : "opacity-50"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="h-[400px] p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`flex-1 ${msg.role === "assistant" ? "bg-primary/5" : "bg-blue-50"} rounded-2xl p-4`}>
                <p className="text-sm text-gray-800">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-end gap-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your response..."
            className="min-h-[60px] resize-none bg-transparent"
          />
          <Button type="submit" size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
