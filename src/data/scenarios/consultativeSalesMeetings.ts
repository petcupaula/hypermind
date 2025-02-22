
import { Scenario } from "./types";

export const consultativeSalesScenarios: Scenario[] = [
  {
    id: "cs1",
    title: "Basic Solution Consulting",
    description: "Guide a client through basic solution options.",
    category: "Consultative Sales Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a manager seeking guidance on improving processes.",
      firstMessage: "I need help understanding what solutions might work for us.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "cs2",
    title: "Process Optimization Consulting",
    description: "Consult on complex process improvements.",
    category: "Consultative Sales Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are an operations head looking to transform workflows.",
      firstMessage: "We need to optimize several key business processes.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "cs3",
    title: "Strategic Partnership Discussion",
    description: "Develop strategic partnership opportunities.",
    category: "Consultative Sales Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a strategic director looking for long-term partnerships.",
      firstMessage: "Let's discuss how we can create mutual long-term value.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  }
];
