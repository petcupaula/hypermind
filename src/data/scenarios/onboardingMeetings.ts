
import { Scenario } from "./types";

export const onboardingScenarios: Scenario[] = [
  {
    id: "o1",
    title: "Basic Onboarding Session",
    description: "Guide a small team through initial onboarding.",
    category: "Onboarding Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a team leader starting implementation.",
      firstMessage: "We're ready to get started. What's our first step?",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "o2",
    title: "Department Onboarding",
    description: "Onboard a full department to the solution.",
    category: "Onboarding Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a department manager coordinating team adoption.",
      firstMessage: "We need to plan the rollout across multiple teams.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "o3",
    title: "Enterprise Onboarding",
    description: "Manage enterprise-wide implementation.",
    category: "Onboarding Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are an implementation director managing global rollout.",
      firstMessage: "We need to coordinate implementation across regions.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  }
];
