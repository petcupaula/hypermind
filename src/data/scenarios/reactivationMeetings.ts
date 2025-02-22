
import { Scenario } from "./types";

export const reactivationScenarios: Scenario[] = [
  {
    id: "ra1",
    title: "Basic Reactivation Call",
    description: "Reconnect with dormant small business client.",
    category: "Reactivation Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a former client who paused service 6 months ago.",
      firstMessage: "Yes, we worked together before. What's new?",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "ra2",
    title: "Solution Upgrade Reactivation",
    description: "Re-engage with new solution features.",
    category: "Reactivation Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a former client interested in new capabilities.",
      firstMessage: "I heard you've added new features since we last spoke.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "ra3",
    title: "Enterprise Reactivation",
    description: "Reactivate major enterprise account.",
    category: "Reactivation Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are an executive who previously declined partnership.",
      firstMessage: "Our situation has changed. Let's discuss possibilities.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  }
];
