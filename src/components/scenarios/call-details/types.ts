
import type { Database, Json } from "@/integrations/supabase/types";

type CallHistoryRow = Database["public"]["Tables"]["call_history"]["Row"];

export interface CallRecord extends CallHistoryRow {
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
  data_collection_results: Json | null;
  elevenlabs_conversation_id: string | null;
  recording_url: string | null;
  elevenlabs_recording_url: string | null;
}

export interface EvalCriteriaResult {
  criterion: string;
  passed: boolean;
  explanation: string;
}

export interface DataCollectionSchema {
  type: string;
  description: string;
  dynamic_variable: string;
}

export interface DataCollectionItem {
  value: boolean | number | null;
  rationale: string;
  json_schema: DataCollectionSchema | null;
  data_collection_id: string;
}

export type DataCollectionMetrics = {
  [key: string]: DataCollectionItem;
}

export interface DataCollectionResults {
  metrics: DataCollectionMetrics;
  prospect_questions?: string[];
}

export interface EvaluationResult {
  result: "success" | "failure";
  rationale: string;
  criteria_id: string;
}

export type EvaluationCriteriaResults = {
  [key: string]: EvaluationResult;
}
