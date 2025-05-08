"use client";

import { useState } from "react";
import { Markdown } from "@/components/ui/markdown";
import { ResponseStream } from "@/components/ui/response-stream";
import { Reasoning } from "@/components/ui/reasoning";
import { cn } from "@/lib/utils";
import { PromptResultTab } from "@/lib/types/prompt-optimizer";
import { 
  formatDocumentation, 
  formatActionPlan,
  sanitizeMarkdown,
  highlightImportantSections,
  addProgressIndicators
} from "@/lib/utils/prompt-formatter";
import { PromptLoading } from "@/components/ui/prompt-loading";
import { PromptError } from "@/components/ui/prompt-error";
import { CopyButton } from "@/components/ui/copy-button";

interface PromptResultsProps {
  documentation: string;
  actionPlan: string;
  isLoading: boolean;
  error: string | null;
}

export function PromptResults({
  documentation,
  actionPlan,
  isLoading,
  error
}: PromptResultsProps) {
  const [activeTab, setActiveTab] = useState<PromptResultTab>("documentation");


  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6">
        <PromptError error={error} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8">
        <PromptLoading />
      </div>
    );
  }
    
  if (!documentation && !actionPlan) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("documentation")}
          className={cn(
            "px-4 py-2 font-medium text-sm transition-colors",
            activeTab === "documentation"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-selected={activeTab === "documentation"}
          role="tab"
        >
          Documentation
        </button>
        <button
          onClick={() => setActiveTab("actionPlan")}
          className={cn(
            "px-4 py-2 font-medium text-sm transition-colors",
            activeTab === "actionPlan"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-selected={activeTab === "actionPlan"}
          role="tab"
        >
          Action Plan
        </button>
      </div>
      
      <div className="mt-6">
        {activeTab === "documentation" && (
          <div className="prose dark:prose-invert max-w-none">
            <Reasoning>
              <Reasoning.Trigger>View AI Reasoning</Reasoning.Trigger>
              <Reasoning.Content>
                <Reasoning.Response>
                  <ResponseStream text="Analyzing your project idea to create comprehensive documentation that outlines the architecture and structure without diving into technical implementation details." />
                </Reasoning.Response>
              </Reasoning.Content>
            </Reasoning>
            
            <div className="mt-4">
              {documentation ? (
                <div>
                  <div className="flex justify-end mb-2">
                    <CopyButton 
                      text={documentation} 
                      label="Copy Documentation" 
                      className="mb-2"
                    />
                  </div>
                  <Markdown>
                    {highlightImportantSections(
                      formatDocumentation(sanitizeMarkdown(documentation))
                    )}
                  </Markdown>
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  Documentation will appear here after optimization
                </div>
              )}
            </div>
    
          </div>
        )}
        
        {activeTab === "actionPlan" && (
          <div className="prose dark:prose-invert max-w-none">
            <Reasoning>
              <Reasoning.Trigger>View AI Reasoning</Reasoning.Trigger>
              <Reasoning.Content>
                <Reasoning.Response>
                  <ResponseStream text="Breaking down your project idea into a structured technical action plan with clear steps and subtasks that can be followed by an AI to implement your idea." />
                </Reasoning.Response>
              </Reasoning.Content>
            </Reasoning>
            
            <div className="mt-4">
              {actionPlan ? (
                <div>
                  <div className="flex justify-end mb-2">
                    <CopyButton 
                      text={actionPlan} 
                      label="Copy Action Plan" 
                      className="mb-2"
                    />
                  </div>
                  <Markdown>
                    {addProgressIndicators(
                      formatActionPlan(sanitizeMarkdown(actionPlan))
                    )}
                  </Markdown>
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  Action plan will appear here after optimization
                </div>
              )}
            </div>
    
          </div>
        )}
      </div>
    </div>
  );
}
