"use client";

import { cn } from "@/lib/utils";

interface PromptLoadingProps {
  message?: string;
  className?: string;
}

export function PromptLoading({
  message = "Generating optimized prompt...",
  className
}: PromptLoadingProps) {
  return (
    <div className={cn(
      "w-full flex flex-col items-center justify-center py-8 space-y-4",
      className
    )}>
      <div className="relative flex">
        <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-background"></div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-md">
          This may take a moment as we analyze your project idea and generate detailed documentation and action plans.
        </p>
      </div>
    </div>
  );
}

export function PromptLoadingInline({
  message = "Loading...",
  className
}: PromptLoadingProps) {
  return (
    <div className={cn(
      "flex items-center space-x-2",
      className
    )}>
      <div className="h-4 w-4 rounded-full border-t-2 border-b-2 border-current animate-spin"></div>
      <span className="text-sm">{message}</span>
    </div>
  );
}

export function PromptLoadingDots({
  className
}: {
  className?: string
}) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
    </div>
  );
}
