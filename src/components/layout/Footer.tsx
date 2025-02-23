
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

const Footer = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <footer className="w-full py-8 mt-16 bg-white/50 backdrop-blur-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center md:justify-start space-x-1">
            <span className="text-sm text-gray-600">Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span className="text-sm text-gray-600">in Denmark</span>
          </div>
          <div className="flex items-center justify-center md:justify-end space-x-6">
            {!session ? (
              <>
                <Link to="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
                <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
                <Link to="/enterprise" className="text-sm text-gray-600 hover:text-gray-900">Enterprise</Link>
              </>
            ) : (
              <>
                <Link to="/scenarios" className="text-sm text-gray-600 hover:text-gray-900">Scenarios</Link>
                <Link to="/history" className="text-sm text-gray-600 hover:text-gray-900">Call History</Link>
                <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
