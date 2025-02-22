
import { Scenario } from "./types";

export const proposalNegotiationScenarios: Scenario[] = [
  {
    id: "n1",
    title: "Basic Proposal Review",
    description: "Present and discuss initial proposal.",
    category: "Proposal/Negotiation Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a manager reviewing a standard proposal.",
      firstMessage: "I've reviewed the proposal. Let's discuss the main points.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "n2",
    title: "Price Negotiation",
    description: "Navigate pricing and terms negotiation.",
    category: "Proposal/Negotiation Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a procurement manager focused on getting the best deal.",
      firstMessage: "We need to discuss the pricing structure and terms.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "n3",
    title: "Enterprise Contract Negotiation",
    description: "Handle complex enterprise contract negotiations.",
    category: "Proposal/Negotiation Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a legal director negotiating enterprise terms.",
      firstMessage: "We have several points in the contract to negotiate.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  }
];
