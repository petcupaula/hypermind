
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Auth = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        <div className="max-w-md mx-auto">
          <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-200">
            <h1 className="text-2xl font-bold text-center mb-6">Welcome to Hypermind</h1>
            <div className="space-y-4">
              <Button variant="outline" className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Continue with Email
              </Button>
              <div className="text-center text-sm text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
