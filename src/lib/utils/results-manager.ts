/**
 * Results Manager Utilities
 * 
 * This file contains utility functions for managing optimization results,
 * including functions to generate unique IDs, format and store results,
 * and retrieve saved results.
 */

import { v4 as uuidv4 } from 'uuid';
import { PromptOptimizerResponse } from '@/lib/types/prompt-optimizer';

/**
 * Interface for stored result data
 */
export interface StoredResult extends PromptOptimizerResponse {
  id: string;
  userPrompt: string;
  createdAt: string;
  expiresAt: string;
}

/**
 * Generate a unique ID for a result
 * 
 * @returns A unique ID string
 */
export function generateResultId(): string {
  return uuidv4();
}

/**
 * Format a result for storage
 * 
 * @param userPrompt The original user prompt
 * @param documentation The generated documentation
 * @param actionPlan The generated action plan
 * @returns A formatted result object ready for storage
 */
export function formatResultForStorage(
  userPrompt: string,
  documentation: string,
  actionPlan: string
): StoredResult {
  const now = new Date();
  
  // Results expire after 30 days
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  return {
    id: generateResultId(),
    userPrompt,
    documentation,
    actionPlan,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
}

/**
 * Save a result to the server
 * 
 * @param result The result to save
 * @returns The ID of the saved result
 */
export async function saveResult(
  userPrompt: string,
  documentation: string,
  actionPlan: string
): Promise<string> {
  try {
    const response = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userPrompt,
        documentation,
        actionPlan,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error saving result:', error);
    throw error;
  }
}

/**
 * Retrieve a result by ID
 * 
 * @param id The ID of the result to retrieve
 * @returns The retrieved result or null if not found
 */
export async function getResultById(id: string): Promise<StoredResult | null> {
  try {
    const response = await fetch(`/api/results/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error retrieving result ${id}:`, error);
    return null;
  }
}

/**
 * Retrieve all results
 * 
 * @param limit Maximum number of results to retrieve (default: 100)
 * @returns Array of retrieved results
 */
export async function getAllResults(limit: number = 100): Promise<StoredResult[]> {
  try {
    const response = await fetch('/api/results');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
    }

    const results = await response.json();
    return results.slice(0, limit);
  } catch (error) {
    console.error('Error retrieving results:', error);
    return [];
  }
}

/**
 * Delete a result by ID
 * 
 * @param id The ID of the result to delete
 * @returns True if the result was deleted successfully, false otherwise
 */
export async function deleteResultById(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/results/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting result ${id}:`, error);
    return false;
  }
}

/**
 * Check if a result exists
 * 
 * @param id The ID of the result to check
 * @returns True if the result exists, false otherwise
 */
export async function resultExists(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/results/${id}`, {
      method: 'HEAD',
    });

    return response.ok;
  } catch (error) {
    console.error(`Error checking if result ${id} exists:`, error);
    return false;
  }
}

/**
 * Format a result for display
 * 
 * @param result The result to format
 * @returns A formatted result object ready for display
 */
export function formatResultForDisplay(result: StoredResult): {
  title: string;
  summary: string;
  createdAt: string;
  expiresAt: string;
  documentationPreview: string;
  actionPlanPreview: string;
} {
  // Extract a title from the user prompt (first sentence or first 50 chars)
  const title = result.userPrompt.split(/[.!?]/)[0].trim().substring(0, 50) + 
    (result.userPrompt.length > 50 ? '...' : '');
  
  // Create a summary from the user prompt (first 100 chars)
  const summary = result.userPrompt.substring(0, 100) + 
    (result.userPrompt.length > 100 ? '...' : '');
  
  // Format dates for display
  const createdAt = new Date(result.createdAt).toLocaleDateString();
  const expiresAt = new Date(result.expiresAt).toLocaleDateString();
  
  // Create previews of documentation and action plan (first 150 chars)
  const documentationPreview = result.documentation.substring(0, 150) + 
    (result.documentation.length > 150 ? '...' : '');
  
  const actionPlanPreview = result.actionPlan.substring(0, 150) + 
    (result.actionPlan.length > 150 ? '...' : '');
  
  return {
    title,
    summary,
    createdAt,
    expiresAt,
    documentationPreview,
    actionPlanPreview,
  };
}

/**
 * Clean up expired results
 * 
 * This function is meant to be called periodically to remove expired results
 * 
 * @returns The number of expired results that were deleted
 */
export async function cleanupExpiredResults(): Promise<number> {
  try {
    const results = await getAllResults();
    const now = new Date();
    let deletedCount = 0;
    
    for (const result of results) {
      const expiresAt = new Date(result.expiresAt);
      
      if (expiresAt < now) {
        const deleted = await deleteResultById(result.id);
        if (deleted) {
          deletedCount++;
        }
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired results:', error);
    return 0;
  }
}

/**
 * Generate a shareable URL for a result
 * 
 * @param id The ID of the result
 * @returns A shareable URL for the result
 */
export function generateShareableUrl(id: string): string {
  // Use window.location if available (client-side), otherwise use a fallback
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : process.env.NEXT_PUBLIC_BASE_URL || '';
  
  return `${baseUrl}/results/${id}`;
}

/**
 * Combine documentation and action plan into a single prompt
 * 
 * @param documentation The documentation section
 * @param actionPlan The action plan section
 * @returns A combined prompt
 */
export function combineIntoFullPrompt(documentation: string, actionPlan: string): string {
  return `# Project Documentation

${documentation}

# Technical Action Plan

${actionPlan}`;
}
