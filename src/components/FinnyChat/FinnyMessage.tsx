
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface FinnyMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

export function FinnyMessage({ content, isUser, timestamp }: FinnyMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-2 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-finpurple text-white flex items-center justify-center">
          <span className="text-sm font-medium">F</span>
        </Avatar>
      )}
      
      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3",
          isUser
            ? "bg-finpurple text-white rounded-tr-none"
            : "bg-white border border-gray-200 rounded-tl-none"
        )}
      >
        <p className="text-sm">{content}</p>
        {timestamp && (
          <p className={cn("text-xs mt-1", isUser ? "text-white/70" : "text-gray-400")}>
            {timestamp}
          </p>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-fingray-medium text-white flex items-center justify-center">
          <span className="text-sm font-medium">You</span>
        </Avatar>
      )}
    </div>
  );
}
