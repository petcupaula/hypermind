
import { Scenario } from "./types";

export const accountReviewScenarios: Scenario[] = [
  {
    id: "ar1",
    title: "Quarterly Review Basic",
    description: "Conduct a basic quarterly account review.",
    category: "Account Review Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a client reviewing first quarter usage.",
      firstMessage: "Let's review how we've been using the solution.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "ar2",
    title: "Performance Review",
    description: "Review complex performance metrics and ROI.",
    category: "Account Review Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a manager analyzing solution performance.",
      firstMessage: "I want to review our KPIs and ROI in detail.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "ar3",
    title: "Strategic Account Review",
    description: "Conduct executive-level strategic review.",
    category: "Account Review Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are an executive reviewing strategic partnership value.",
      firstMessage: "Let's evaluate our partnership's strategic impact.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  }
];
