
import { FinancialGoal } from "@/types";

export const FINANCIAL_GOALS: { value: FinancialGoal; label: string }[] = [
  { value: "Build an emergency fund", label: "Build an emergency fund" },
  { value: "Pay off debt", label: "Pay off debt" },
  { value: "Save for a home", label: "Save for a home" },
  { value: "Plan for retirement", label: "Plan for retirement" },
];

export const FEATURE_LABELS: Record<string, string> = {
  ExplainThis: "Explain This",
  GeneratePlan: "Generate Plan",
  CompleteStep: "Complete Step",
};
