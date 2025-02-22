
export interface Scenario {
  id: string;
  title: string;
  description: string;
  persona: {
    prompt: string;
    firstMessage: string;
    voiceId: string;
  };
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}
