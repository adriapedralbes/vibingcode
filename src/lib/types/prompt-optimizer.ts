/**
 * Types for the AI Prompt Optimizer
 * 
 * This file contains TypeScript interfaces for the request and response data
 * used in the prompt optimizer feature, including types for documentation and
 * action plan structures.
 */

/**
 * Request payload for the prompt optimizer API
 */
export interface PromptOptimizerRequest {
  /**
   * The user's project idea or description
   */
  prompt: string;
}

/**
 * Response payload from the prompt optimizer API
 */
export interface PromptOptimizerResponse {
  /**
   * Markdown-formatted documentation about the project architecture
   */
  documentation: string;
  
  /**
   * Markdown-formatted technical action plan with steps and subtasks
   */
  actionPlan: string;
}

/**
 * Error response from the prompt optimizer API
 */
export interface PromptOptimizerError {
  /**
   * Error message
   */
  error: string;
  
  /**
   * Optional error code
   */
  code?: string;
  
  /**
   * Optional HTTP status code
   */
  status?: number;
}

/**
 * State for the prompt optimizer UI component
 */
export interface PromptOptimizerState {
  /**
   * The user's input prompt
   */
  userPrompt: string;
  
  /**
   * Markdown-formatted documentation about the project architecture
   */
  documentation: string;
  
  /**
   * Markdown-formatted technical action plan with steps and subtasks
   */
  actionPlan: string;
  
  /**
   * Whether the optimizer is currently processing a request
   */
  isLoading: boolean;
  
  /**
   * Error message, if any
   */
  error: string | null;
}

/**
 * Represents a single step in the action plan
 */
export interface ActionPlanStep {
  /**
   * The title or description of the step
   */
  title: string;
  
  /**
   * The description or details of the step
   */
  description?: string;
  
  /**
   * Subtasks for this step
   */
  subtasks?: ActionPlanSubtask[];
}

/**
 * Represents a subtask within an action plan step
 */
export interface ActionPlanSubtask {
  /**
   * The description of the subtask
   */
  description: string;
  
  /**
   * Whether the subtask is completed
   */
  completed?: boolean;
}

/**
 * Represents a section of the project documentation
 */
export interface DocumentationSection {
  /**
   * The title of the section
   */
  title: string;
  
  /**
   * The content of the section in markdown format
   */
  content: string;
  
  /**
   * Subsections, if any
   */
  subsections?: DocumentationSection[];
}

/**
 * Tab options for the prompt results display
 */
export type PromptResultTab = 'documentation' | 'actionPlan';
