
import Navigation from "@/components/layout/Navigation";
import CallHistory from "@/components/scenarios/CallHistory";
import AnimatedGradient from "@/components/ui/animated-gradient";

const CallHistoryPage = () => {
  return (
    <div className="min-h-screen">
      <AnimatedGradient />
      <Navigation />
      <main className="container pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Call History</h1>
          <CallHistory />
        </div>
      </main>
    </div>
  );
};

export default CallHistoryPage;
