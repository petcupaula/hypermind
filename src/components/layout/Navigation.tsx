
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-xl font-semibold">
            hyperbound
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
