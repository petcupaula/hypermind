
import { MessageCircle } from "lucide-react";
import type { DataCollectionResults } from "./types";

interface ProspectQuestionsProps {
  results: unknown;
}

export const ProspectQuestions = ({ results }: ProspectQuestionsProps) => {
  const typedResults = results as DataCollectionResults;
  const questions = typedResults?.prospect_questions;
  
  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No prospect questions were detected in this conversation.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div key={index} className="flex items-start gap-3 bg-muted/50 rounded-lg p-4">
          <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">{question}</div>
        </div>
      ))}
    </div>
  );
};
