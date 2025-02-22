
import { Scenario } from "./types";

export const renewalRetentionScenarios: Scenario[] = [
  {
    id: "r1",
    title: "Simple Renewal Discussion",
    description: "Handle basic contract renewal.",
    category: "Renewal/Retention Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a client approaching first renewal.",
      firstMessage: "Our contract is up for renewal soon. Let's discuss.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "r2",
    title: "Competitive Renewal",
    description: "Secure renewal against competitive offers.",
    category: "Renewal/Retention Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a client considering competitive options.",
      firstMessage: "We've received other offers. Why should we renew?",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "r3",
    title: "Strategic Partnership Renewal",
    description: "Renew and expand strategic partnership.",
    category: "Renewal/Retention Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are an executive evaluating long-term partnership.",
      firstMessage: "Let's discuss the future of our partnership.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  }
];
