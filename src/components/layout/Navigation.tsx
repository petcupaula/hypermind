
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-xl font-semibold">
            hypermind
          </a>
          <div className="hidden md:flex items-center space-x-6 ml-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#enterprise" className="text-sm text-gray-600 hover:text-gray-900">Enterprise</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Start Free Trial
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
