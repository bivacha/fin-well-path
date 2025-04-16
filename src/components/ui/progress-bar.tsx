
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showValue?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  showValue = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  return (
    <div className={cn("relative w-full h-4 bg-finpurple-light rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-500 ease-in-out bg-finpurple", barClassName)}
        style={{ width: `${percentage}%` }}
      />
      {showValue && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
