
/**
 * Prompt Optimizer Service
 * 
 * This service handles the processing of user prompts for AI optimization.
 * It formats requests to the AI model and structures the responses.
 */


import {
  formatDocumentation,
  formatActionPlan,
  sanitizeMarkdown,
  highlightImportantSections,
  addProgressIndicators
} from "@/lib/utils/prompt-formatter";

import {
  PromptOptimizerRequest,
  PromptOptimizerResponse,
  PromptOptimizerError,
  ActionPlanStep,
  DocumentationSection
} from "@/lib/types/prompt-optimizer";
    

/**
 * Process a user prompt and generate optimized documentation and action plan
 */
export async function optimizePrompt(
  userPrompt: string
): Promise<OptimizePromptResponse> {
  try {
    // Validate input
    if (!userPrompt || typeof userPrompt !== 'string') {
      throw createError('Invalid prompt provided', 'INVALID_INPUT', 400);
    }

    if (userPrompt.trim().length < 10) {
      throw createError(
        'Please provide a more detailed description of your project idea',
        'PROMPT_TOO_SHORT',
        400
      );
    }

    // Make API request
    const response = await fetch('/api/optimize-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createError(
        errorData.error || `Error: ${response.status} ${response.statusText}`,
        'API_ERROR',
        response.status
      );
    }

    // Parse response
    const data = await response.json();
    
    // Validate response structure
    if (!isValidResponse(data)) {
      throw createError(
        'Invalid response format from API',
        'INVALID_RESPONSE',
        500
      );
    }


    

    // Format and enhance the response
    return {
      documentation: highlightImportantSections(
        formatDocumentation(sanitizeMarkdown(data.documentation))
      ),
      actionPlan: addProgressIndicators(
        formatActionPlan(sanitizeMarkdown(data.actionPlan))
      ),
    };
  } catch (error) {
    // Re-throw our formatted errors
    if (isOptimizePromptError(error)) {
      throw error;
    }
    
    // Format specific error types
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        throw createError(
          "Network error. Please check your internet connection and try again.",
          "NETWORK_ERROR",
          503
        );
      }
      
      if (error.message.includes("timeout") || error.message.includes("timed out")) {
        throw createError(
          "Request timed out. The server took too long to respond.",
          "TIMEOUT_ERROR",
          408
        );
      }
      
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        throw createError(
          "Rate limit exceeded. Please try again later.",
          "RATE_LIMIT_ERROR",
          429
        );
      }
    }
    
    // Format unknown errors
    throw createError(
      error instanceof Error ? error.message : "An unknown error occurred",
      "UNKNOWN_ERROR",
      500
    );
  }
}

/**
 * Validate the response structure
 */
function isValidResponse(data: any): data is OptimizePromptResponse {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.documentation === 'string' &&
    typeof data.actionPlan === 'string'
  );
}

/**
 * Create a standardized error object
 */
function createError(
  message: string,
  code: string = 'ERROR',
  status: number = 500
): OptimizePromptError {
  return {
    message,
    code,
    status,
  };
}

/**
 * Type guard for OptimizePromptError
 */
function isOptimizePromptError(error: any): error is OptimizePromptError {
  return (
    error &&
    typeof error === 'object' &&
    typeof error.message === 'string' &&
    (error.code === undefined || typeof error.code === 'string') &&
    (error.status === undefined || typeof error.status === 'number')
  );
}

/**
 * Extract key insights from the user prompt to guide the AI
 * This helps focus the AI on the most important aspects of the project
 */
export function extractPromptInsights(prompt: string): string {
  const insights = [];
  
  // Check for project type indicators
  if (prompt.match(/web|website|app|application|platform/i)) {
    insights.push('This appears to be a web application project.');
  } else if (prompt.match(/mobile|ios|android|app/i)) {
    insights.push('This appears to be a mobile application project.');
  } else if (prompt.match(/api|service|backend|server/i)) {
    insights.push('This appears to be a backend service project.');
  }
  
  // Check for technology mentions
  const techMatches = prompt.match(/react|vue|angular|node|express|django|flask|spring|dotnet/gi);
  if (techMatches && techMatches.length > 0) {
    insights.push(`Technologies mentioned: ${techMatches.join(', ')}`);
  }
  
  // Check for complexity indicators
  if (prompt.match(/complex|complicated|advanced|sophisticated/i)) {
    insights.push('This appears to be a complex project that may require detailed planning.');
  } else if (prompt.match(/simple|basic|straightforward/i)) {
    insights.push('This appears to be a relatively simple project.');
  }
  
  // Return insights or a default message
  return insights.length > 0 
    ? insights.join(' ') 
    : 'No specific insights extracted. Providing general documentation and action plan.';
}

/**
 * Enhance the prompt with additional context and instructions
 * This helps the AI generate more relevant and structured responses
 */
export function enhancePrompt(prompt: string): string {
  const insights = extractPromptInsights(prompt);
  
  return `
Project Idea: ${prompt.trim()}

${insights}

Based on this project idea, please provide:

1. Documentation: A clear, non-technical overview of the project architecture, explaining the main components and how they fit together. Focus on the overall structure without diving into technical implementation details.

2. Action Plan: A detailed, step-by-step technical plan with subtasks that another AI could follow to implement this idea. Include specific technologies, patterns, and approaches that would be appropriate for this project.

Format your response as a JSON object with two properties:
- documentation: A markdown string with the project documentation
- actionPlan: A markdown string with the technical action plan
`;
}


