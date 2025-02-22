
import { Scenario } from "./types";

export const reverseSalesScenarios: Scenario[] = [
  {
    id: "rs1",
    title: "Software Demo Evaluation",
    description: "Experience being pitched a new software solution as an IT Manager.",
    category: "Reverse Sales Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a sales representative demonstrating a new cloud-based software solution. Be enthusiastic but not pushy, focus on ROI and efficiency gains.",
      firstMessage: "Thanks for taking the time to learn about our solution today. What challenges are you currently facing with your current system?",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "rs2",
    title: "Enterprise Solution Buyer",
    description: "Take the role of a CTO evaluating an enterprise-level solution.",
    category: "Reverse Sales Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are an experienced enterprise sales representative pitching a comprehensive digital transformation solution. Be knowledgeable about industry trends and technical details.",
      firstMessage: "I appreciate you considering our enterprise solution. Based on our initial research, I believe we could help streamline your operations significantly. What's your primary concern with your current infrastructure?",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "rs3",
    title: "Executive Buy-in Challenge",
    description: "Play the role of a CEO being pitched a strategic partnership.",
    category: "Reverse Sales Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a senior sales executive proposing a strategic partnership. Focus on long-term value creation, market positioning, and competitive advantage.",
      firstMessage: "Our research shows that this partnership could create significant market opportunities for both organizations. What's your vision for your company's growth in the next 3-5 years?",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  }
];
