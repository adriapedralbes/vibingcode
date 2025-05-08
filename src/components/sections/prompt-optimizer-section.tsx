
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PromptResults } from "@/components/ui/prompt-results";
import { PromptLoading } from "@/components/ui/prompt-loading";
import { PromptError } from "@/components/ui/prompt-error";
import { cn } from "@/lib/utils";
import { saveResult } from "@/lib/utils/results-manager";
import { PromptOptimizerState, PromptResultTab } from "@/lib/types/prompt-optimizer";

export function PromptOptimizerSection() {
  const [userIdea, setUserIdea] = useState("");
  const [result, setResult] = useState<PromptOptimizerState>({
    userPrompt: "",
    documentation: "",
    actionPlan: "",
    isLoading: false,
    error: null,
  });
  const [resultId, setResultId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PromptResultTab>("documentation");
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userIdea.trim()) return;
    
    setResult({
      userPrompt: userIdea,
      documentation: "",
      actionPlan: "",
      isLoading: true,
      error: null,
    });
    setResultId(null);
    
    try {
      const response = await fetch("/api/optimize-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userIdea }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      

      // Save the result using the results manager
      try {
        const id = await saveResult(userIdea, data.documentation, data.actionPlan);
        setResultId(id);
      } catch (saveError) {
        console.error("Error saving result:", saveError);
        // Continue even if saving fails
      }
    
      
      setResult({
        userPrompt: userIdea,
        documentation: data.documentation,
        actionPlan: data.actionPlan,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error optimizing prompt:", error);
      setResult({
        userPrompt: userIdea,
        documentation: "",
        actionPlan: "",
        isLoading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleRetry = () => {
    if (userIdea.trim()) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              AI Prompt Optimizer
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Transform your project idea into an optimized AI prompt for coding. Get a clear documentation and action plan.
            </p>
          </div>
          
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">

               <Textarea
                 placeholder="Describe your project idea in a few sentences..."
                 value={userIdea}
                 onChange={(e) => setUserIdea(e.target.value)}
                 className="min-h-[150px] resize-y"
                 disabled={result.isLoading}
               />

              {result.error && (
                <div className="mt-2">
                  <PromptError 
                    error={result.error} 
                    onRetry={handleRetry}
                  />
                </div>
              )}

               <Button 
                 type="submit" 
                 className="w-full mt-4"
                 disabled={result.isLoading || !userIdea.trim()}
               >
                 {result.isLoading ? (
                   <span className="flex items-center">
                     <span className="h-4 w-4 mr-2 rounded-full border-t-2 border-b-2 border-background animate-spin"></span>
                     Optimizing...
                   </span>
                 ) : (
                   "Generate Optimized Prompt"
                 )}
               </Button>
    
            </form>
          </div>
          
          <PromptResults
            documentation={result.documentation}
            actionPlan={result.actionPlan}
            isLoading={result.isLoading}
            error={result.error}
          />
          
          {resultId && !result.isLoading && !result.error && (
            <div className="mt-8 flex justify-center">
              <Button asChild>
                <a href={`/results/${resultId}`} target="_blank" rel="noopener noreferrer">
                  View Full Results
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

