
import { Scenario } from "./types";

export const referralScenarios: Scenario[] = [
  {
    id: "rf1",
    title: "Basic Referral Request",
    description: "Request referrals from satisfied client.",
    category: "Referral Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a satisfied customer open to providing referrals.",
      firstMessage: "Yes, we've had a good experience with your solution.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "rf2",
    title: "Partner Referral Program",
    description: "Develop referral partnership.",
    category: "Referral Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a potential referral partner evaluating opportunities.",
      firstMessage: "Let's discuss how a referral partnership could work.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "rf3",
    title: "Strategic Referral Network",
    description: "Build strategic referral network.",
    category: "Referral Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are an influential industry leader with extensive network.",
      firstMessage: "I'm interested in strategic partnership opportunities.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  }
];
