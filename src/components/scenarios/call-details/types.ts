
import type { Json } from "@/integrations/supabase/types";

export interface CallRecord {
  id: string;
  scenarios: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    persona: {
      name: string;
      role: string;
      company: string;
    };
  };
  created_at: string;
  duration: number;
  transcript: string | null;
  transcript_summary: string | null;
  evaluation_criteria_results: Json | null;
  data_collection_results: DataCollectionResults | null;
  elevenlabs_conversation_id: string | null;
  recording_url: string | null;
  elevenlabs_recording_url: string | null;
}

export interface DataCollectionItem {
  value: boolean | number | null;
  rationale: string;
  json_schema?: {
    description?: string;
  } | null;
}

export interface DataCollectionResults {
  metrics: {
    [key: string]: DataCollectionItem;
  };
  prospect_questions?: string[];
}

export interface EvaluationResult {
  result: "success" | "failure";
  rationale: string;
}
