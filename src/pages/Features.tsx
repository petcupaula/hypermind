
import { Bot, Brain, BarChart2, Users } from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Features</h1>
          
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
