/**
 * Prompt Formatter Utilities
 * 
 * This file contains utility functions for formatting the results from the AI prompt optimizer,
 * including functions to format documentation and action plan outputs.
 */

import {
  DocumentationSection,
  ActionPlanStep,
  ActionPlanSubtask
} from "@/lib/types/prompt-optimizer";

/**
 * Format the documentation output from the AI prompt optimizer
 * 
 * @param documentation The raw documentation string from the AI
 * @returns Formatted documentation string
 */
export function formatDocumentation(documentation: string): string {
  if (!documentation || typeof documentation !== 'string') {
    return 'No documentation was generated.';
  }

  // Ensure documentation starts with a heading
  if (!documentation.trim().startsWith('#')) {
    documentation = `# Project Documentation\n\n${documentation}`;
  }

  // Add section dividers for better readability
  documentation = documentation.replace(/^## (.+)$/gm, '\n---\n\n## $1');

  // Enhance code blocks with syntax highlighting hints if not already present
  documentation = documentation.replace(/```(?!\w)/g, '```typescript');

  return documentation;
}

/**
 * Format the action plan output from the AI prompt optimizer
 * 
 * @param actionPlan The raw action plan string from the AI
 * @returns Formatted action plan string
 */
export function formatActionPlan(actionPlan: string): string {
  if (!actionPlan || typeof actionPlan !== 'string') {
    return 'No action plan was generated.';
  }

  // Ensure action plan starts with a heading
  if (!actionPlan.trim().startsWith('#')) {
    actionPlan = `# Technical Action Plan\n\n${actionPlan}`;
  }

  // Add section dividers for better readability
  actionPlan = actionPlan.replace(/^## Step (\d+):/gm, '\n---\n\n## Step $1:');

  // Enhance code blocks with syntax highlighting hints if not already present
  actionPlan = actionPlan.replace(/```(?!\w)/g, '```typescript');

  // Add checkboxes to list items for better visual representation of tasks
  actionPlan = actionPlan.replace(/^- (.+)$/gm, '- [ ] $1');

  return actionPlan;
}

/**
 * Parse the documentation string into a structured format
 * 
 * @param documentation The raw documentation string from the AI
 * @returns Array of DocumentationSection objects
 */
export function parseDocumentationSections(documentation: string): DocumentationSection[] {
  if (!documentation) {
    return [];
  }

  const sections: DocumentationSection[] = [];
  const lines = documentation.split('\n');

  let currentSection: DocumentationSection | null = null;
  let currentSubsection: DocumentationSection | null = null;
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle main sections (## headings)
    if (line.startsWith('## ')) {
      // Save previous section if exists
      if (currentSection) {
        if (currentContent.length > 0) {
          if (currentSubsection) {
            currentSubsection.content = currentContent.join('\n');
            currentSection.subsections = [...(currentSection.subsections || []), currentSubsection];
            currentSubsection = null;
          } else {
            currentSection.content = currentContent.join('\n');
          }
          currentContent = [];
        }
        sections.push(currentSection);
      }

      // Create new section
      currentSection = {
        title: line.replace('## ', ''),
        content: '',
        subsections: []
      };
    }
    // Handle subsections (### headings)
    else if (line.startsWith('### ') && currentSection) {
      // Save previous subsection if exists
      if (currentSubsection) {
        currentSubsection.content = currentContent.join('\n');
        currentSection.subsections = [...(currentSection.subsections || []), currentSubsection];
        currentContent = [];
      } else if (currentContent.length > 0) {
        // If we have content but no current subsection, it belongs to the main section
        currentSection.content = currentContent.join('\n');
        currentContent = [];
      }

      // Create new subsection
      currentSubsection = {
        title: line.replace('### ', ''),
        content: ''
      };
    }
    // Add content to current section or subsection
    else {
      currentContent.push(line);
    }
  }

  // Save the last section and subsection
  if (currentSection) {
    if (currentSubsection) {
      currentSubsection.content = currentContent.join('\n');
      currentSection.subsections = [...(currentSection.subsections || []), currentSubsection];
    } else if (currentContent.length > 0) {
      currentSection.content = currentContent.join('\n');
    }
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Parse the action plan string into a structured format
 * 
 * @param actionPlan The raw action plan string from the AI
 * @returns Array of ActionPlanStep objects
 */
export function parseActionPlanSteps(actionPlan: string): ActionPlanStep[] {
  if (!actionPlan) {
    return [];
  }

  const steps: ActionPlanStep[] = [];
  const lines = actionPlan.split('\n');

  let currentStep: ActionPlanStep | null = null;
  let currentDescription: string[] = [];
  let collectingSubtasks = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle step headings (## Step X:)
    if (line.match(/^## Step \d+:/)) {
      // Save previous step if exists
      if (currentStep) {
        if (currentDescription.length > 0) {
          currentStep.description = currentDescription.join('\n').trim();
        }
        steps.push(currentStep);
      }

      // Create new step
      currentStep = {
        title: line.replace(/^## /, ''),
        subtasks: []
      };
      currentDescription = [];
      collectingSubtasks = false;
    }
    // Handle subtasks (- or * list items)
    else if ((line.startsWith('- ') || line.startsWith('* ') || line.startsWith('- [ ] ')) && currentStep) {
      collectingSubtasks = true;

      // Add subtask to current step
      const subtaskText = line
        .replace(/^- \[ \] /, '')
        .replace(/^- /, '')
        .replace(/^\* /, '');

      if (subtaskText.trim()) {
        currentStep.subtasks = [
          ...(currentStep.subtasks || []),
          {
            description: subtaskText,
            completed: false
          }
        ];
      }
    }
    // Add content to current step description
    else if (currentStep && !collectingSubtasks && line) {
      currentDescription.push(line);
    }
    // Reset subtask collection if we hit an empty line after subtasks
    else if (collectingSubtasks && !line) {
      collectingSubtasks = false;
    }
  }

  // Save the last step
  if (currentStep) {
    if (currentDescription.length > 0) {
      currentStep.description = currentDescription.join('\n').trim();
    }
    steps.push(currentStep);
  }

  return steps;
}

/**
 * Generate a markdown checklist from action plan steps
 * 
 * @param steps Array of ActionPlanStep objects
 * @returns Markdown string with a checklist
 */
export function generateActionPlanChecklist(steps: ActionPlanStep[]): string {
  if (!steps || steps.length === 0) {
    return 'No action plan steps available.';
  }

  let markdown = '# Action Plan Checklist\n\n';

  steps.forEach((step, index) => {
    markdown += `## ${step.title}\n\n`;

    if (step.description) {
      markdown += `${step.description}\n\n`;
    }

    if (step.subtasks && step.subtasks.length > 0) {
      step.subtasks.forEach(subtask => {
        markdown += `- [ ] ${subtask.description}\n`;
      });
      markdown += '\n';
    }
  });

  return markdown;
}

/**
 * Extract code examples from documentation or action plan
 * 
 * @param content The documentation or action plan string
 * @returns Array of code examples with language and code
 */
export function extractCodeExamples(content: string): { language: string; code: string }[] {
  if (!content) {
    return [];
  }

  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const examples: { language: string; code: string }[] = [];

  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    examples.push({
      language: match[1] || 'typescript',
      code: match[2].trim()
    });
  }

  return examples;
}

/**
 * Sanitize and validate markdown content
 * 
 * @param markdown The markdown string to sanitize
 * @returns Sanitized markdown string
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown) {
    return '';
  }

  // Remove potentially unsafe HTML
  markdown = markdown.replace(/<(script|iframe|object|embed|style)[\s\S]*?<\/\1>/gi, '');

  // Remove inline JavaScript events
  markdown = markdown.replace(/on\w+="[^"]*"/g, '');

  // Remove data URLs
  markdown = markdown.replace(/data:[^"']+/g, '');

  // Ensure code blocks are properly formatted
  markdown = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `\`\`\`${lang || 'typescript'}\n${code.trim()}\n\`\`\``;
  });

  return markdown;
}

/**
 * Highlight important sections in the documentation
 * 
 * @param documentation The documentation string
 * @returns Documentation with highlighted important sections
 */
export function highlightImportantSections(documentation: string): string {
  if (!documentation) {
    return '';
  }

  // Highlight architecture sections
  documentation = documentation.replace(
    /## (Architecture|Structure|Components|Design)/g,
    '## 🏗️ $1'
  );

  // Highlight overview sections
  documentation = documentation.replace(
    /## (Overview|Introduction|Summary)/g,
    '## 📋 $1'
  );

  // Highlight interaction sections
  documentation = documentation.replace(
    /## (Interactions|Flow|Communication|Integration)/g,
    '## 🔄 $1'
  );

  // Highlight considerations sections
  documentation = documentation.replace(
    /## (Considerations|Notes|Limitations|Constraints)/g,
    '## 💡 $1'
  );

  return documentation;
}

/**
 * Add progress indicators to action plan steps
 * 
 * @param actionPlan The action plan string
 * @returns Action plan with progress indicators
 */
export function addProgressIndicators(actionPlan: string): string {
  if (!actionPlan) {
    return '';
  }

  // Add progress indicators to step headings
  return actionPlan.replace(
    /## Step (\d+):/g,
    (match, stepNumber) => `## Step ${stepNumber} of ? :`
  ).replace(
    /## Step (\d+) of \? :/g,
    (match, stepNumber) => {
      // Count total steps
      const totalSteps = (actionPlan.match(/## Step \d+:/g) || []).length;
      return `## Step ${stepNumber} of ${totalSteps} :`;
    }
  );
}
