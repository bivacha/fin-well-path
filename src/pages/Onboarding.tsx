
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore, generateAndStoreRoadmap } from "@/lib/store";
import { FinancialGoal } from "@/types";
import { DollarSign, PiggyBank, Home, Landmark, CreditCard, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const formSchema = z.object({
  monthlyIncome: z.string().min(1, "Please enter your monthly income"),
  financialGoal: z.enum(["Build an emergency fund", "Pay off debt", "Save for a home", "Plan for retirement"] as const),
  hasDebt: z.enum(["yes", "no"]),
});

type FormValues = z.infer<typeof formSchema>;

const Onboarding = () => {
  const navigate = useNavigate();
  const { setUserData, incrementFeatureInteraction } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: "",
      financialGoal: "Build an emergency fund",
      hasDebt: "no",
    },
  });
  
  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    incrementFeatureInteraction("GeneratePlan");
    
    // Update user data in store
    setUserData({
      monthlyIncome: values.monthlyIncome,
      financialGoal: values.financialGoal as FinancialGoal,
      hasDebt: values.hasDebt === "yes",
    });
    
    // Generate roadmap
    generateAndStoreRoadmap();
    
    // Navigate to roadmap page
    setTimeout(() => {
      navigate("/roadmap");
    }, 500);
  };
  
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex p-4 rounded-full bg-finpurple-light mb-4">
          <PiggyBank className="w-10 h-10 text-finpurple" />
        </div>
        <h1 className="text-3xl font-bold text-fingray-dark mb-2">Welcome to FinWell</h1>
        <p className="text-fingray-medium mb-4">Let's create your personalized financial wellness plan</p>
        
        <Card className="bg-finpurple-light bg-opacity-20 border-finpurple-light mb-6">
          <CardContent className="p-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-finpurple" />
            <p className="text-fingray-dark text-left">
              Hi! I'm your AI Financial Coach. I'll help you take control of your money, one step at a time.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-finpurple-light">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fingray-dark font-medium text-base">What's your monthly take-home pay?</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-fingray" />
                      <Input
                        placeholder="3000"
                        {...field}
                        className="pl-10"
                        type="number"
                        min="0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="financialGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fingray-dark font-medium text-base">Which goal matters most to you right now?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Build an emergency fund">
                        <div className="flex items-center gap-2">
                          <PiggyBank className="h-4 w-4" />
                          <span>Build an emergency fund</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Pay off debt">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Pay off debt</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Save for a home">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>Save for a home</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Plan for retirement">
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4" />
                          <span>Plan for retirement</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasDebt"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-fingray-dark font-medium text-base">Do you currently have any debt?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full bg-finpurple hover:bg-finpurple-dark transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Your Plan..." : "Create My Personal Plan"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;
