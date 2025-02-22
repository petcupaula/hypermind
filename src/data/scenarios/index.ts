
import { Scenario } from "./types";
import { prospectingScenarios } from "./prospectingMeetings";
import { discoveryScenarios } from "./discoveryMeetings";
import { productDemoScenarios } from "./productDemoMeetings";
import { salesPitchScenarios } from "./salesPitchMeetings";
import { consultativeSalesScenarios } from "./consultativeSalesMeetings";
import { followUpScenarios } from "./followUpMeetings";
import { proposalNegotiationScenarios } from "./proposalNegotiationMeetings";
import { closingScenarios } from "./closingMeetings";
import { onboardingScenarios } from "./onboardingMeetings";
import { accountReviewScenarios } from "./accountReviewMeetings";
import { renewalRetentionScenarios } from "./renewalRetentionMeetings";
import { referralScenarios } from "./referralMeetings";
import { reactivationScenarios } from "./reactivationMeetings";
import { investorPitchScenarios } from "./investorPitchMeetings";
import { reverseSalesScenarios } from "./reverseSalesMeetings";

export const scenarios: Scenario[] = [
  ...prospectingScenarios,
  ...discoveryScenarios,
  ...productDemoScenarios,
  ...salesPitchScenarios,
  ...consultativeSalesScenarios,
  ...followUpScenarios,
  ...proposalNegotiationScenarios,
  ...closingScenarios,
  ...onboardingScenarios,
  ...accountReviewScenarios,
  ...renewalRetentionScenarios,
  ...referralScenarios,
  ...reactivationScenarios,
  ...investorPitchScenarios,
  ...reverseSalesScenarios
];
