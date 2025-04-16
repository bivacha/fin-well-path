
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CircleDashed, CheckCircle2, TrendingUp, Trophy, ArrowUpRight, Sparkles } from "lucide-react";

const Progress = () => {
  const navigate = useNavigate();
  const { userData, roadmap } = useAppStore();
  
  // If there's no income data, redirect to onboarding
  useEffect(() => {
    if (!userData.monthlyIncome) {
      navigate("/");
      return;
    }
  }, [userData, navigate]);
  
  // Calculate current progress
  const completedSteps = roadmap.filter(step => step.completed).length;
  const totalSteps = roadmap.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  // Prepare progress data for chart
  const progressData = userData.progress.map((value, index) => ({
    checkpoint: index + 1,
    progress: value
  }));
  
  // If no progress data exists yet, add the current progress
  if (progressData.length === 0 && progressPercentage > 0) {
    progressData.push({
      checkpoint: 1,
      progress: progressPercentage
    });
  }
  
  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (progressPercentage === 0) return "Ready to take your first step? You've got this!";
    if (progressPercentage < 25) return "Great start! Small steps lead to big changes.";
    if (progressPercentage < 50) return "You're making solid progress! Keep building momentum.";
    if (progressPercentage < 75) return `You're ${progressPercentage}% of the way there! Keep it up!`;
    if (progressPercentage < 100) return "Almost there! You're doing amazing work.";
    return "Incredible! You've completed your full financial plan!";
  };
  
  // Get icon based on progress
  const getProgressIcon = () => {
    if (progressPercentage === 0) return <CircleDashed className="h-8 w-8 text-fingray" />;
    if (progressPercentage < 50) return <TrendingUp className="h-8 w-8 text-finpurple" />;
    if (progressPercentage < 100) return <ArrowUpRight className="h-8 w-8 text-finpurple-dark" />;
    return <Trophy className="h-8 w-8 text-finorange" />;
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-fingray-dark mb-2">Your Financial Journey</h1>
        <p className="text-fingray-medium mb-6">
          Track your progress and celebrate each achievement
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-finpurple-light md:col-span-2 bg-gradient-to-br from-white to-finpurple-light/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Your Overall Progress</span>
              <span className="text-finpurple">{progressPercentage}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar value={progressPercentage} className="h-5 mb-4" showValue />
            
            <div className="flex items-center justify-center space-x-4 p-6 bg-finpurple-light bg-opacity-20 rounded-lg mt-4">
              {getProgressIcon()}
              <div>
                <p className="text-lg font-medium text-fingray-dark flex items-center">
                  {getMotivationalMessage()}
                  <Sparkles className="h-4 w-4 ml-2 text-finpurple" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-finpurple-light md:col-span-2">
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <XAxis 
                      dataKey="checkpoint" 
                      label={{ value: 'Checkpoints', position: 'insideBottomRight', offset: -10 }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Completion']}
                      labelFormatter={(value) => `Checkpoint ${value}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="progress" 
                      stroke="#9b87f5" 
                      strokeWidth={3}
                      dot={{ stroke: '#7E69AB', strokeWidth: 2, fill: '#9b87f5', r: 5 }}
                      activeDot={{ r: 7, stroke: '#7E69AB', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-fingray-medium">
                  <CircleDashed className="h-10 w-10 mb-4" />
                  <p>You'll see your progress journey here as you complete steps!</p>
                  <p>Head back to your plan and start checking off those steps.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-finpurple-light md:col-span-2">
          <CardHeader>
            <CardTitle>Your Action Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roadmap.length > 0 ? (
                roadmap.map((step) => (
                  <div 
                    key={step.id} 
                    className={`flex items-center p-4 rounded-lg border ${
                      step.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'border-gray-100'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-6 w-6 mr-3 text-green-500" />
                    ) : (
                      <CircleDashed className="h-6 w-6 mr-3 text-fingray" />
                    )}
                    <div>
                      <p className={`font-medium ${step.completed ? 'text-green-600' : 'text-fingray-dark'}`}>
                        Step {step.id + 1}: {step.title}
                      </p>
                      <p className="text-sm text-fingray">{step.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-fingray-medium py-4">
                  <p>Your plan is being created.</p>
                  <p>Go to your roadmap to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate("/roadmap")} 
          className="bg-finpurple hover:bg-finpurple-dark text-white"
          size="lg"
        >
          Back to My Plan
        </Button>
      </div>
    </div>
  );
};

export default Progress;
