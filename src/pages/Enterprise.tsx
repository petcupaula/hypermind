import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Users2, Headphones } from "lucide-react";

const Enterprise = () => {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10" />
        
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              For Large Organizations
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Enterprise-Grade AI Training
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Scale your sales team's capabilities with custom AI training solutions.
              Built for security, compliance, and performance at scale.
            </p>
            <div className="flex items-center justify-center gap-6 mb-12">
              <Button size="lg" className="gap-2">
                Schedule a Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
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
