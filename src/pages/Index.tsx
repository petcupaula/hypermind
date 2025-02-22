
import AnimatedGradient from "@/components/ui/animated-gradient";
import Navigation from "@/components/layout/Navigation";
import ChatInterface from "@/components/chat/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnimatedGradient />
      <Navigation />
      
      <main className="container pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Experience the Next Generation of AI Interaction
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Engage with our advanced AI system designed to understand, learn, and grow with you
          </p>
        </div>

        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
