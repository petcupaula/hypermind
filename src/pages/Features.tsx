
import { Bot, Brain, BarChart2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";

const Features = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10" />
        
        {/* Header section */}
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Transform Your Sales Game
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Practice makes perfect. Our AI-powered platform provides realistic scenarios 
              to help you master sales conversations and close more deals.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/enterprise")}>
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI-Powered Training</h3>
              <p className="text-gray-600">
                Our advanced AI technology creates realistic sales scenarios tailored to your industry and target market. Every conversation is unique and adapts to your responses in real-time.
              </p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Multi-Persona Training</h3>
              <p className="text-gray-600">
                Practice with multiple AI personas representing different stakeholders in the sales process. From C-level executives to technical decision-makers.
              </p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Custom Scenarios</h3>
              <p className="text-gray-600">
                Create and customize training scenarios specific to your products, services, and common customer objections. Perfect your pitch in a safe environment.
              </p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Performance Analytics</h3>
              <p className="text-gray-600">
                Track progress with detailed analytics on conversation performance, objection handling, and key metrics. Get actionable insights to improve your sales skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
