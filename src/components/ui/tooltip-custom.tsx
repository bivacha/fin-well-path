
import * as React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface ExplanationTooltipProps {
  explanation: string;
  triggerText?: string;
  className?: string;
}

export function ExplanationTooltip({ 
  explanation, 
  triggerText = "Explain This", 
  className 
}: ExplanationTooltipProps) {
  const incrementFeatureInteraction = useAppStore(state => state.incrementFeatureInteraction);
  
  const handleOpenChange = (open: boolean) => {
    if (open) {
      incrementFeatureInteraction("ExplainThis");
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("bg-finblue text-primary-foreground hover:bg-finblue-accent", className)}
          >
            {triggerText}
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-sm p-4 bg-white border border-finpurple-light shadow-lg rounded-lg text-left"
        >
          <p className="text-fingray-dark">{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
