
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Users2, Headphones } from "lucide-react";

const Enterprise = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Enterprise Solutions</h1>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Custom AI training solutions for large organizations. Scale your sales team's capabilities with enterprise-grade features and support.
          </p>
          
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Custom Solutions</h3>
              <p className="text-gray-600">
                Tailored AI training programs designed specifically for your industry, products, and sales processes.
              </p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-gray-600">
                Advanced security features, SSO integration, and compliance with enterprise security standards.
              </p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Users2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Team Management</h3>
              <p className="text-gray-600">
                Comprehensive admin controls, team analytics, and collaboration features for large sales teams.
              </p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Dedicated Support</h3>
              <p className="text-gray-600">
                24/7 priority support, dedicated account manager, and implementation assistance.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button size="lg" className="gap-2">
              Schedule a Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enterprise;
