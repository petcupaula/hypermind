
import { Scenario } from "./types";

export const salesPitchScenarios: Scenario[] = [
  {
    id: "sp1",
    title: "Value Proposition Pitch",
    description: "Present core value proposition to a potential client.",
    category: "Sales Pitch Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a manager looking for clear, tangible benefits.",
      firstMessage: "What makes your solution different from others in the market?",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "sp2",
    title: "ROI-Focused Presentation",
    description: "Present detailed ROI analysis to decision makers.",
    category: "Sales Pitch Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a finance director focused on numbers and returns.",
      firstMessage: "I need to see concrete ROI projections and cost analysis.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "sp3",
    title: "Executive Board Pitch",
    description: "Present to a C-level executive board.",
    category: "Sales Pitch Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a CEO with a board to answer to.",
      firstMessage: "How does this align with our long-term strategic objectives?",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  }
];
