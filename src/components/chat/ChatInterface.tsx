
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot } from "lucide-react";

const ChatInterface = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission
    setMessage("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Enterprise CTO Persona</h3>
            <p className="text-sm text-gray-500">Tech-savvy decision maker at a Fortune 500 company</p>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] p-6 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 bg-primary/5 rounded-2xl p-4">
              <p className="text-sm text-gray-800">
                Hello! I'm interested in learning more about your solution. We're currently facing some challenges with our data infrastructure. Can you tell me how your product might help?
              </p>
            </div>
          </div>
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
