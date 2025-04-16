
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AskFinnyButtonProps {
  question: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AskFinnyButton({ 
  question, 
  className,
  variant = "outline",
  size = "sm" 
}: AskFinnyButtonProps) {
  const [askFinny, setAskFinny] = useState<((question: string) => void) | null>(null);
  
  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      // Create a function to dispatch the custom event
      const askQuestion = (q: string) => {
        const event = new CustomEvent('ask-finny', { detail: { question: q } });
        window.dispatchEvent(event);
      };
      
      setAskFinny(() => askQuestion);
    }
  }, []);
  
  const handleClick = () => {
    if (askFinny) {
      askFinny(question);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("bg-finpurple-light text-finpurple-dark hover:bg-finpurple hover:text-white", className)}
      onClick={handleClick}
    >
      <Bot className="mr-1 h-4 w-4" />
      Ask Finny
    </Button>
  );
}
