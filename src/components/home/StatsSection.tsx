
import { BarChart2, Brain, Users } from "lucide-react";

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
      <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
        <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Custom AI Agents</h3>
        <p className="text-gray-600">Create personalized training scenarios that match your ICP perfectly.</p>
      </div>
      <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
        <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Multi-Agent Training</h3>
        <p className="text-gray-600">Practice with multiple AI personas in complex scenarios.</p>
      </div>
      <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
        <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
          <BarChart2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Real-time Analytics</h3>
        <p className="text-gray-600">Track progress and identify areas for improvement.</p>
      </div>
    </div>
  );
};

export default StatsSection;
