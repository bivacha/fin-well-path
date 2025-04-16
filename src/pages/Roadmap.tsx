
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore, generateAndStoreRoadmap } from "@/lib/store";
import { CheckCircle2, CircleDashed, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { toast } from "sonner";

const Roadmap = () => {
  const navigate = useNavigate();
  const { userData, roadmap, updateStepCompletion } = useAppStore();
  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});
  
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
    if (checked) {
      toast.success("Great job completing this step!");
    }
  };

  const toggleExplanation = (stepId: number) => {
    setOpenExplanations(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // If all steps are completed, show a congratulations message
  const allCompleted = roadmap.length > 0 && completedSteps === roadmap.length;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-fingray-dark mb-2">Your Personal Financial Plan</h1>
        <p className="text-fingray-medium mb-4">
          Follow these simple steps toward your goal: <span className="font-medium text-finpurple-dark">{userData.financialGoal}</span>
        </p>
        
        <div className="mb-6 max-w-md mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span>Your Progress</span>
            <span className="font-medium">{progressPercentage}% Complete</span>
          </div>
          <ProgressBar value={progressPercentage} className="h-3" />
        </div>
        
        {allCompleted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <p className="text-lg font-medium flex items-center justify-center">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Amazing job! You've completed all steps in your financial plan.
            </p>
          </div>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        {roadmap.map((step) => (
          <Card 
            key={step.id} 
            className={`border-l-4 transition-all duration-200 ${
              step.completed 
                ? 'border-l-green-500 bg-green-50 bg-opacity-30' 
                : 'border-l-finpurple'
            }`}
          >
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
              
              <Collapsible 
                open={openExplanations[step.id]} 
                onOpenChange={() => toggleExplanation(step.id)}
                className="border rounded-md bg-finpurple-light bg-opacity-10 overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full flex justify-between items-center p-3 text-left"
                  >
                    <span>Explain this in more detail</span>
                    {openExplanations[step.id] ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 text-fingray-dark">
                  <p>{step.explanation}</p>
                  <p className="mt-2 font-medium text-finpurple-dark">You've got this! I'm here to help.</p>
                </CollapsibleContent>
              </Collapsible>
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
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate("/progress")} 
          className="bg-finpurple hover:bg-finpurple-dark"
          size="lg"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          View My Progress
        </Button>
      </div>
    </div>
  );
};

export default Roadmap;
