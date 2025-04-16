
import { ReactNode, useEffect, useRef } from "react";
import { FinnyChat } from "./FinnyChat";

interface FinnyProviderProps {
  children: ReactNode;
}

export function FinnyProvider({ children }: FinnyProviderProps) {
  const finnyRef = useRef<{ askQuestion: (q: string) => void } | null>(null);
  
  useEffect(() => {
    // Listen for custom events to ask Finny questions
    const handleAskFinny = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.question && finnyRef.current) {
        finnyRef.current.askQuestion(customEvent.detail.question);
      }
    };
    
    window.addEventListener('ask-finny', handleAskFinny);
    
    return () => {
      window.removeEventListener('ask-finny', handleAskFinny);
    };
  }, []);
  
  return (
    <>
      {children}
      <FinnyChat ref={finnyRef} />
    </>
  );
}
