
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-white/50 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-semibold">
            hypermind
          </Link>
          <div className="hidden md:flex items-center space-x-6 ml-8">
            <Link to="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link to="/enterprise" className="text-sm text-gray-600 hover:text-gray-900">Enterprise</Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/auth")}
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
