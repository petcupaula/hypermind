
import { useParams } from "react-router-dom";
import CallDetails from "@/components/scenarios/CallDetails";

const CallDetailsPage = () => {
  const { id } = useParams();
  
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <CallDetails id={id} />
      </div>
    </main>
  );
};

export default CallDetailsPage;
