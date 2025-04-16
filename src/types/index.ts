
// Types for the financial wellness app

export type FinancialGoal = 
  | "Build an emergency fund" 
  | "Pay off debt" 
  | "Save for a home" 
  | "Plan for retirement";

export interface UserData {
  monthlyIncome: string;
  financialGoal: FinancialGoal;
  hasDebt: boolean;
  progress: number[];
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  explanation: string;
  completed: boolean;
}

export interface HRMetrics {
  usersOnboarded: number;
  goalDistribution: Record<FinancialGoal, number>;
  featureInteractions: Record<string, number>;
}
