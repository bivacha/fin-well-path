
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore, generateAndStoreRoadmap } from "@/lib/store";
import { ExplanationTooltip } from "@/components/ui/tooltip-custom";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";

const Roadmap = () => {
  const navigate = useNavigate();
  const { userData, roadmap, updateStepCompletion } = useAppStore();
  
  // If there's no income data, redirect to onboarding
  useEffect(() => {
    if (!userData.monthlyIncome) {
      navigate("/");
      return;
    }
    
    // If roadmap is empty, generate it
    if (roadmap.length === 0) {
      generateAndStoreRoadmap();
    }
  }, [userData, roadmap, navigate]);
  
  // Calculate progress
  const completedSteps = roadmap.filter(step => step.completed).length;
  const progressPercentage = roadmap.length > 0 
    ? Math.round((completedSteps / roadmap.length) * 100) 
    : 0;
  
  const handleStepToggle = (stepId: number, checked: boolean) => {
    updateStepCompletion(stepId, checked);
  };

  // If all steps are completed, show a congratulations message
  const allCompleted = roadmap.length > 0 && completedSteps === roadmap.length;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-fingray-dark mb-2">Your Financial Roadmap</h1>
        <p className="text-fingray-medium mb-4">
          Follow these steps toward your goal: <span className="font-medium text-finpurple-dark">{userData.financialGoal}</span>
        </p>
        
        <div className="mb-6 max-w-md mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{progressPercentage}% Complete</span>
          </div>
          <ProgressBar value={progressPercentage} className="h-3" />
        </div>
        
        {allCompleted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <p className="text-lg font-medium flex items-center justify-center">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Congratulations! You've completed all steps in your financial plan.
            </p>
          </div>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        {roadmap.map((step) => (
          <Card key={step.id} className={`border-l-4 ${step.completed ? 'border-l-green-500' : 'border-l-finpurple'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-start">
                <div className="mr-3 mt-1">
                  {step.completed ? 
                    <CheckCircle2 className="h-6 w-6 text-green-500" /> : 
                    <CircleDashed className="h-6 w-6 text-finpurple" />
                  }
                </div>
                <div>
                  Step {step.id + 1}: {step.title}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fingray-dark mb-4">{step.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-0">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`step-${step.id}`} 
                  checked={step.completed}
                  onCheckedChange={(checked) => handleStepToggle(step.id, checked as boolean)}
                />
                <label
                  htmlFor={`step-${step.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Mark as completed
                </label>
              </div>
              <ExplanationTooltip explanation={step.explanation} />
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate("/progress")} 
          className="bg-finpurple hover:bg-finpurple-dark"
        >
          View Your Progress
        </Button>
      </div>
    </div>
  );
};

export default Roadmap;
