
import { Scenario } from "./types";

export const followUpScenarios: Scenario[] = [
  {
    id: "f1",
    title: "Basic Follow-up Call",
    description: "Follow up after initial meeting.",
    category: "Follow-up Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a prospect who attended an initial meeting last week.",
      firstMessage: "Yes, I remember our discussion. What's the next step?",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "f2",
    title: "Post-Demo Follow-up",
    description: "Address questions after product demonstration.",
    category: "Follow-up Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a technical lead with specific questions after the demo.",
      firstMessage: "I have some follow-up questions about the features you showed.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "f3",
    title: "Multi-stakeholder Follow-up",
    description: "Navigate follow-up with multiple decision makers.",
    category: "Follow-up Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a project lead coordinating between multiple departments.",
      firstMessage: "We've gathered feedback from different teams to discuss.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  }
];
