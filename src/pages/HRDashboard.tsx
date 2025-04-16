
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { FinancialGoal } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Users, Target, HeartHandshake } from "lucide-react";

const HRDashboard = () => {
  const { hrMetrics } = useAppStore();
  
  // Transform goal distribution data for chart
  const goalData = Object.entries(hrMetrics.goalDistribution).map(([name, value]) => ({
    name,
    value: typeof value === 'number' ? value : 0,
  }));
  
  // Transform feature interaction data for chart
  const featureData = Object.entries(hrMetrics.featureInteractions).map(([name, value]) => ({
    name: name === "ExplainThis" 
      ? "Explain This" 
      : name === "GeneratePlan" 
        ? "Generate Plan" 
        : "Complete Step",
    value: typeof value === 'number' ? value : 0,
  }));
  
  // Pie chart colors
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#E5DEFF'];
  
  // Get the most popular goal
  const getMostPopularGoal = (): FinancialGoal | "None" => {
    const usersOnboarded = typeof hrMetrics.usersOnboarded === 'number' ? hrMetrics.usersOnboarded : 0;
    if (usersOnboarded === 0) return "None";
    
    let maxCount = 0;
    let mostPopular: FinancialGoal | "None" = "None";
    
    Object.entries(hrMetrics.goalDistribution).forEach(([goal, count]) => {
      const countNumber = typeof count === 'number' ? count : 0;
      if (countNumber > maxCount) {
        maxCount = countNumber;
        mostPopular = goal as FinancialGoal;
      }
    });
    
    return mostPopular;
  };
  
  // Get the most used feature
  const getMostUsedFeature = (): string => {
    const hasInteractions = Object.values(hrMetrics.featureInteractions).some(
      count => typeof count === 'number' && count > 0
    );
    
    if (!hasInteractions) {
      return "None";
    }
    
    let maxCount = 0;
    let mostUsed = "None";
    
    Object.entries(hrMetrics.featureInteractions).forEach(([feature, count]) => {
      const countNumber = typeof count === 'number' ? count : 0;
      if (countNumber > maxCount) {
        maxCount = countNumber;
        mostUsed = feature === "ExplainThis" 
          ? "Explain This" 
          : feature === "GeneratePlan" 
            ? "Generate Plan" 
            : "Complete Step";
      }
    });
    
    return mostUsed;
  };
  
  const usersOnboarded = typeof hrMetrics.usersOnboarded === 'number' ? hrMetrics.usersOnboarded : 0;
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fingray-dark mb-2">HR Dashboard</h1>
        <p className="text-fingray-medium">
          Anonymized employee financial wellness metrics
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Employees Onboarded
            </CardTitle>
            <Users className="h-4 w-4 text-finpurple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersOnboarded}</div>
            <p className="text-xs text-fingray-medium mt-1">
              Total users engaging with the platform
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Selected Goal
            </CardTitle>
            <Target className="h-4 w-4 text-finpurple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{getMostPopularGoal()}</div>
            <p className="text-xs text-fingray-medium mt-1">
              The financial goal employees prioritize
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Used Feature
            </CardTitle>
            <HeartHandshake className="h-4 w-4 text-finpurple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getMostUsedFeature()}</div>
            <p className="text-xs text-fingray-medium mt-1">
              Feature with highest engagement
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Financial Goal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {usersOnboarded > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={goalData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {goalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} employees`, 'Count']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-fingray-medium">
                  <p>No data available yet.</p>
                  <p>Data will appear as employees onboard.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Feature Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {featureData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} interactions`, 'Count']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#9b87f5" 
                      name="Interactions" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-fingray-medium">
                  <p>No feature engagement data yet.</p>
                  <p>Data will appear as employees use features.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>About HR Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fingray-dark text-sm">
              This dashboard provides anonymized data to help HR teams measure employee engagement with the financial wellness program. 
              No personally identifiable information is collected or displayed. Employee privacy is maintained throughout the platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;
