
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinancialGoal, HRMetrics, RoadmapStep, UserData } from '@/types';

interface AppState {
  userData: UserData;
  roadmap: RoadmapStep[];
  hrMetrics: HRMetrics;
  setUserData: (data: Partial<UserData>) => void;
  setRoadmap: (roadmap: RoadmapStep[]) => void;
  updateStepCompletion: (stepId: number, completed: boolean) => void;
  incrementFeatureInteraction: (feature: string) => void;
  resetUserData: () => void;
}

// Initial roadmap steps based on financial goals
const generateRoadmap = (goal: FinancialGoal, hasDebt: boolean): RoadmapStep[] => {
  const roadmaps: Record<FinancialGoal, RoadmapStep[]> = {
    "Build an emergency fund": [
      {
        id: 1,
        title: "Track your spending",
        description: "Record all expenses for 30 days",
        explanation: "Understanding where your money goes is the foundation of financial wellness. By tracking all expenses for a month, you'll identify spending patterns and areas to trim.",
        completed: false
      },
      {
        id: 2,
        title: "Create a budget",
        description: "Allocate income to needs, wants, and savings",
        explanation: "A budget helps you prioritize your emergency fund. Aim to save at least 20% of your income, reduce non-essential spending, and consider the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
        completed: false
      },
      {
        id: 3,
        title: "Set up automatic transfers",
        description: "Move 10-15% of income to savings monthly",
        explanation: "Automation removes the temptation to spend. Set up a recurring transfer to a separate high-yield savings account on payday. Aim for 3-6 months of essential expenses in your emergency fund.",
        completed: false
      }
    ],
    "Pay off debt": [
      {
        id: 1,
        title: "List all debts",
        description: "Record balances, interest rates, and minimums",
        explanation: "Create a complete picture of what you owe. Organize your debts by listing the creditor, total balance, interest rate, and minimum payment for each. Knowledge is power when tackling debt.",
        completed: false
      },
      {
        id: 2,
        title: "Choose a repayment strategy",
        description: "Decide between avalanche or snowball method",
        explanation: "The avalanche method focuses on highest-interest debts first (saving the most money), while the snowball method pays off smallest balances first (providing quick wins). Choose the approach that best matches your psychology.",
        completed: false
      },
      {
        id: 3,
        title: "Accelerate payments",
        description: "Pay more than minimums on target debt",
        explanation: "Make minimum payments on all debts, but put any extra money toward your target debt. Even small additional payments can dramatically reduce the time to debt freedom and save significant interest.",
        completed: false
      }
    ],
    "Save for a home": [
      {
        id: 1,
        title: "Set a down payment goal",
        description: "Aim for 20% of your target home price",
        explanation: "While you can buy a home with less than 20% down, reaching this threshold helps you avoid private mortgage insurance (PMI), qualify for better rates, and start with more equity. Research home prices in your target area to set a specific dollar amount.",
        completed: false
      },
      {
        id: 2,
        title: "Open a dedicated account",
        description: "Choose a high-yield savings or CD account",
        explanation: "Keep your home savings separate from other funds to reduce temptation to spend it. High-yield savings accounts or certificates of deposit (CDs) offer better returns than regular savings while maintaining safety and liquidity.",
        completed: false
      },
      {
        id: 3,
        title: "Improve your credit score",
        description: "Pay bills on time and reduce credit utilization",
        explanation: "Your credit score significantly impacts mortgage rates. Pay all bills on time, keep credit card balances below 30% of your limits, and avoid opening new credit accounts in the months before applying for a mortgage.",
        completed: false
      }
    ],
    "Plan for retirement": [
      {
        id: 1,
        title: "Calculate retirement needs",
        description: "Estimate 80% of current income annually",
        explanation: "Most financial experts suggest you'll need about 80% of your pre-retirement income to maintain your lifestyle in retirement. Multiply by your expected years in retirement (often 25-30) to get your total savings target.",
        completed: false
      },
      {
        id: 2,
        title: "Maximize employer match",
        description: "Contribute enough to get full matching funds",
        explanation: "If your employer offers retirement matching, this is essentially free money. At minimum, contribute enough to your 401(k) or similar plan to receive the full employer match—typically 3-6% of your salary.",
        completed: false
      },
      {
        id: 3,
        title: "Diversify investments",
        description: "Spread retirement savings across asset classes",
        explanation: "Don't put all your eggs in one basket. Spread your investments across different asset classes (stocks, bonds, etc.) based on your age and risk tolerance. Generally, younger investors can take more risk with higher stock allocations.",
        completed: false
      }
    ]
  };
  
  // If the user has debt and didn't select debt payoff, add a debt step
  if (hasDebt && goal !== "Pay off debt") {
    const debtStep = {
      id: 0,
      title: "Address your debt first",
      description: "Consider paying off high-interest debt",
      explanation: "High-interest debt works against your financial goals. Before fully pursuing other goals, consider allocating resources to pay down debt with interest rates above 6-7%, particularly credit cards or personal loans.",
      completed: false
    };
    return [debtStep, ...roadmaps[goal]];
  }
  
  return roadmaps[goal];
};

// Initial HR metrics
const initialHRMetrics: HRMetrics = {
  usersOnboarded: 0,
  goalDistribution: {
    "Build an emergency fund": 0,
    "Pay off debt": 0,
    "Save for a home": 0,
    "Plan for retirement": 0,
  },
  featureInteractions: {
    "ExplainThis": 0,
    "GeneratePlan": 0,
    "CompleteStep": 0
  }
};

// Initial user data
const initialUserData: UserData = {
  monthlyIncome: "",
  financialGoal: "Build an emergency fund",
  hasDebt: false,
  progress: []
};

// Create the Zustand store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userData: initialUserData,
      roadmap: [],
      hrMetrics: initialHRMetrics,
      
      setUserData: (data) => set((state) => {
        // Update HR metrics when a new user completes onboarding
        if (!state.userData.monthlyIncome && data.monthlyIncome) {
          state.hrMetrics.usersOnboarded += 1;
        }
        
        // Update goal distribution if goal is changing
        if (data.financialGoal && data.financialGoal !== state.userData.financialGoal) {
          state.hrMetrics.goalDistribution[data.financialGoal] += 1;
        }
        
        return {
          userData: { ...state.userData, ...data },
          hrMetrics: { ...state.hrMetrics }
        };
      }),
      
      setRoadmap: (roadmap) => set({ roadmap }),
      
      updateStepCompletion: (stepId, completed) => set((state) => {
        // Update feature interaction metrics
        if (completed) {
          state.hrMetrics.featureInteractions.CompleteStep += 1;
        }
        
        // Update the roadmap
        const updatedRoadmap = state.roadmap.map(step => 
          step.id === stepId ? { ...step, completed } : step
        );
        
        // Calculate progress for the user data
        const completedCount = updatedRoadmap.filter(step => step.completed).length;
        const progressPercentage = Math.round((completedCount / updatedRoadmap.length) * 100);
        
        return {
          roadmap: updatedRoadmap,
          userData: {
            ...state.userData,
            progress: [...state.userData.progress, progressPercentage]
          },
          hrMetrics: { ...state.hrMetrics }
        };
      }),
      
      incrementFeatureInteraction: (feature) => set((state) => {
        if (state.hrMetrics.featureInteractions[feature] !== undefined) {
          state.hrMetrics.featureInteractions[feature] += 1;
        } else {
          state.hrMetrics.featureInteractions[feature] = 1;
        }
        return { hrMetrics: { ...state.hrMetrics } };
      }),
      
      resetUserData: () => set({ userData: initialUserData, roadmap: [] }),
    }),
    {
      name: 'financial-wellness-storage',
    }
  )
);

// Helper function to generate roadmap and store it
export const generateAndStoreRoadmap = () => {
  const { userData, setRoadmap } = useAppStore.getState();
  const roadmap = generateRoadmap(userData.financialGoal, userData.hasDebt);
  setRoadmap(roadmap);
  return roadmap;
};
