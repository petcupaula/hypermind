
import { Scenario } from "./types";

export const prospectingScenarios: Scenario[] = [
  {
    id: "p1",
    title: "First Contact: Email Follow-up",
    description: "Follow up on a cold email with a prospect who showed initial interest.",
    category: "Prospecting Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a busy professional who briefly looked at a marketing email. You're skeptical but somewhat interested.",
      firstMessage: "Yes, I remember your email. I only have a few minutes though.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "p2",
    title: "LinkedIn Connection Meeting",
    description: "Connect with a prospect after meaningful LinkedIn interaction.",
    category: "Prospecting Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a manager who engaged with sales rep's content on LinkedIn. You're interested in industry trends.",
      firstMessage: "I enjoyed your post about industry trends. What insights can you share?",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "p3",
    title: "Event Follow-up Prospect",
    description: "Connect with a high-value prospect met at an industry event.",
    category: "Prospecting Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a C-level executive met at a conference. You're well-informed and time-conscious.",
      firstMessage: "Yes, we briefly spoke at the conference. What specifically can you offer my organization?",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  }
];
