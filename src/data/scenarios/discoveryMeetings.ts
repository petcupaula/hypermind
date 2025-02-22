
import { Scenario } from "./types";

export const discoveryScenarios: Scenario[] = [
  {
    id: "d1",
    title: "Basic Needs Assessment",
    description: "Conduct an initial discovery call with a small business owner.",
    category: "Discovery Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a small business owner facing common operational challenges.",
      firstMessage: "I'm looking to improve our efficiency, but I'm not sure where to start.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "d2",
    title: "Complex Problem Discovery",
    description: "Uncover detailed pain points in a mid-sized organization.",
    category: "Discovery Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are an operations director with multiple department challenges.",
      firstMessage: "We have several issues across departments that need addressing.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "d3",
    title: "Enterprise Discovery Session",
    description: "Navigate a multi-stakeholder discovery meeting.",
    category: "Discovery Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a senior executive representing multiple stakeholders' interests.",
      firstMessage: "We need to address concerns from various departments before moving forward.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  }
];
