import { Scenario } from "@/components/scenarios/ScenarioCard";

export const scenarios: Scenario[] = [
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
  },

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
  },

  {
    id: "dm1",
    title: "Basic Feature Overview",
    description: "Demonstrate core product features to a small team.",
    category: "Product Demo Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a team leader interested in basic functionality.",
      firstMessage: "Can you show me how your product handles everyday tasks?",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "dm2",
    title: "Technical Deep Dive",
    description: "Present technical features to IT stakeholders.",
    category: "Product Demo Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are an IT manager focused on integration and security.",
      firstMessage: "I need to understand your security architecture and API capabilities.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "dm3",
    title: "Enterprise Solution Demo",
    description: "Showcase enterprise-scale capabilities and customizations.",
    category: "Product Demo Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a CTO evaluating enterprise-grade solutions.",
      firstMessage: "Show me how your solution handles scale and complex workflows.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },

  {
    id: "sp1",
    title: "Value Proposition Pitch",
    description: "Present core value proposition to a potential client.",
    category: "Sales Pitch Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a manager looking for clear, tangible benefits.",
      firstMessage: "What makes your solution different from others in the market?",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "sp2",
    title: "ROI-Focused Presentation",
    description: "Present detailed ROI analysis to decision makers.",
    category: "Sales Pitch Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a finance director focused on numbers and returns.",
      firstMessage: "I need to see concrete ROI projections and cost analysis.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "sp3",
    title: "Executive Board Pitch",
    description: "Present to a C-level executive board.",
    category: "Sales Pitch Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a CEO with a board to answer to.",
      firstMessage: "How does this align with our long-term strategic objectives?",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },

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
  },

  {
    id: "f1",
    title: "Basic Follow-up Call",
    description: "Follow up after initial meeting.",
    category: "Follow-up Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a prospect who attended an initial meeting last week.",
      firstMessage: "Yes, I remember our discussion. What's the next step?",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "f2",
    title: "Post-Demo Follow-up",
    description: "Address questions after product demonstration.",
    category: "Follow-up Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a technical lead with specific questions after the demo.",
      firstMessage: "I have some follow-up questions about the features you showed.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "f3",
    title: "Multi-stakeholder Follow-up",
    description: "Navigate follow-up with multiple decision makers.",
    category: "Follow-up Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a project lead coordinating between multiple departments.",
      firstMessage: "We've gathered feedback from different teams to discuss.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },

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
  },

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
  },

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
  },

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
  },

  {
    id: "r1",
    title: "Simple Renewal Discussion",
    description: "Handle basic contract renewal.",
    category: "Renewal/Retention Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a client approaching first renewal.",
      firstMessage: "Our contract is up for renewal soon. Let's discuss.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "r2",
    title: "Competitive Renewal",
    description: "Secure renewal against competitive offers.",
    category: "Renewal/Retention Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a client considering competitive options.",
      firstMessage: "We've received other offers. Why should we renew?",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "r3",
    title: "Strategic Partnership Renewal",
    description: "Renew and expand strategic partnership.",
    category: "Renewal/Retention Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are an executive evaluating long-term partnership.",
      firstMessage: "Let's discuss the future of our partnership.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },

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
  },

  {
    id: "ra1",
    title: "Basic Reactivation Call",
    description: "Reconnect with dormant small business client.",
    category: "Reactivation Meetings",
    difficulty: "Beginner",
    persona: {
      prompt: "You are a former client who paused service 6 months ago.",
      firstMessage: "Yes, we worked together before. What's new?",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "ra2",
    title: "Solution Upgrade Reactivation",
    description: "Re-engage with new solution features.",
    category: "Reactivation Meetings",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a former client interested in new capabilities.",
      firstMessage: "I heard you've added new features since we last spoke.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  },
  {
    id: "ra3",
    title: "Enterprise Reactivation",
    description: "Reactivate major enterprise account.",
    category: "Reactivation Meetings",
    difficulty: "Advanced",
    persona: {
      prompt: "You are an executive who previously declined partnership.",
      firstMessage: "Our situation has changed. Let's discuss possibilities.",
      voiceId: "CwhRBWXzGAHq8TQ4Fs17"
    }
  },
  {
    id: "ip1",
    title: "Seed Round Pitch",
    description: "Present your startup to angel investors seeking seed funding.",
    category: "Investor Pitch Meeting",
    difficulty: "Beginner",
    persona: {
      prompt: "You are an angel investor interested in early-stage startups.",
      firstMessage: "Tell me about your startup and what problem you're solving.",
      voiceId: "EXAVITQu4vr4xnSDxMaL"
    }
  },
  {
    id: "ip2",
    title: "Series A Presentation",
    description: "Present growth metrics and scaling plans to VC firms.",
    category: "Investor Pitch Meeting",
    difficulty: "Intermediate",
    persona: {
      prompt: "You are a VC partner focused on Series A investments.",
      firstMessage: "Walk me through your traction and growth strategy.",
      voiceId: "pqHfZKP75CvOlQylNhV4"
    }
  },
  {
    id: "ip3",
    title: "Late-Stage Funding Round",
    description: "Present to institutional investors for late-stage funding.",
    category: "Investor Pitch Meeting",
    difficulty: "Advanced",
    persona: {
      prompt: "You are a partner at a major investment firm evaluating late-stage opportunities.",
      firstMessage: "Let's discuss your market position and path to profitability.",
      voiceId: "TX3LPaxmHKxFdv7VOQHJ"
    }
  }
];
