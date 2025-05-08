"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PromptErrorProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export function PromptError({
  error,
  onRetry,
  className
}: PromptErrorProps) {
  return (
    <div className={cn(
      "w-full rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10",
      className
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-red-400 dark:text-red-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error generating prompt
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{error}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-red-300 hover:bg-red-50 text-red-700 hover:text-red-800 dark:border-red-800 dark:hover:bg-red-900/20 dark:text-red-300 dark:hover:text-red-200"
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PromptErrorInline({
  error,
  className
}: {
  error: string;
  className?: string;
}) {
  return (
    <p className={cn(
      "text-sm text-red-600 dark:text-red-400",
      className
    )}>
      {error}
    </p>
  );
}
