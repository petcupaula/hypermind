
import { Scenario } from "./types";

export const productDemoScenarios: Scenario[] = [
  {
    id: "dm1",
    title: "Basic Feature Overview",
    description: "Demonstrate core product features to a small team.",
    category: "Product Demo Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a team leader interested in basic functionality.",
      firstMessage: "Can you show me how your product handles everyday tasks?",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "dm2",
    title: "Technical Deep Dive",
    description: "Present technical features to IT stakeholders.",
    category: "Product Demo Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are an IT manager focused on integration and security.",
      firstMessage: "I need to understand your security architecture and API capabilities.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "dm3",
    title: "Enterprise Solution Demo",
    description: "Showcase enterprise-scale capabilities and customizations.",
    category: "Product Demo Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a CTO evaluating enterprise-grade solutions.",
      firstMessage: "Show me how your solution handles scale and complex workflows.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  }
];
