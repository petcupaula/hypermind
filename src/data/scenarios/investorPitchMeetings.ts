
import { Scenario } from "./types";

export const investorPitchScenarios: Scenario[] = [
  {
    id: "ip1",
    title: "Seed Round Pitch",
    description: "Present your startup to angel investors seeking seed funding.",
    category: "Investor Pitch Meeting",
    difficulty: "Beginner",
    persona: {
      prompt: "You are an angel investor interested in early-stage startups.",
      firstMessage: "Tell me about your startup and what problem you're solving.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "ip2",
    title: "Series A Presentation",
    description: "Present growth metrics and scaling plans to VC firms.",
    category: "Investor Pitch Meeting",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a VC partner focused on Series A investments.",
      firstMessage: "Walk me through your traction and growth strategy.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "ip3",
    title: "Late-Stage Funding Round",
    description: "Present to institutional investors for late-stage funding.",
    category: "Investor Pitch Meeting",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a partner at a major investment firm evaluating late-stage opportunities.",
      firstMessage: "Let's discuss your market position and path to profitability.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  }
];
