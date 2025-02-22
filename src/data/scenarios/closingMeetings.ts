
import { Scenario } from "./types";

export const closingScenarios: Scenario[] = [
  {
    id: "c1",
    title: "Simple Deal Closing",
    description: "Close a straightforward small business deal.",
    category: "Closing Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a small business owner ready to make a decision.",
      firstMessage: "I think we're ready to move forward. What are the next steps?",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "c2",
    title: "Complex Solution Closing",
    description: "Close a deal with multiple product lines.",
    category: "Closing Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a department head finalizing a multi-product purchase.",
      firstMessage: "Let's finalize the package and implementation timeline.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "c3",
    title: "Enterprise Deal Closing",
    description: "Close a major enterprise agreement.",
    category: "Closing Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a C-suite executive finalizing a strategic purchase.",
      firstMessage: "Let's wrap up this deal and discuss implementation plans.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  }
];
