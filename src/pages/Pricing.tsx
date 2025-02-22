
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import { useState } from "react";

const Pricing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  const prices = {
    starter: {
      monthly: 49,
      annual: 39,
    },
    professional: {
      monthly: 99,
      annual: 79,
    },
  };

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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose the plan that's right for you. All plans include a 14-day free trial.
              No credit card required.
            </p>
            <div className="inline-block rounded-full bg-white/50 backdrop-blur-sm border border-gray-200 p-1">
              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    !isAnnual
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setIsAnnual(false)}
                >
                  Monthly
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    isAnnual
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setIsAnnual(true)}
                >
                  Annual (Save 20%)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${isAnnual ? prices.starter.annual : prices.starter.monthly}</span>
                <span className="text-gray-600">/month</span>
                {isAnnual && <p className="text-sm text-gray-500">billed annually</p>}
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>2 AI personas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>10 hours/month practice time</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Basic analytics</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${isAnnual ? prices.professional.annual : prices.professional.monthly}</span>
                <span className="text-gray-600">/month</span>
                {isAnnual && <p className="text-sm text-gray-500">billed annually</p>}
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>5 AI personas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited practice time</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Custom scenarios</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Start Free Trial
              </Button>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">Custom</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited AI personas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited practice time</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate("/enterprise")}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
