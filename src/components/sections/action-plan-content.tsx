"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ActionStep {
  id: string;
  title: string;
  description: string;
  subtasks: ActionSubtask[];
}

interface ActionSubtask {
  id: string;
  description: string;
  completed: boolean;
}

export function ActionPlanContent() {
  const [activeSection, setActiveSection] = useState<string>("implementation-steps");
  const [steps, setSteps] = useState<ActionStep[]>([
    {
      id: "step-1",
      title: "Project Setup",
      description: `
## Step 1: Project Setup

Before diving into implementation, we need to set up the project structure and install necessary dependencies.

### Key Tasks:

- Initialize the project repository
- Configure the development environment
- Set up build system and dependencies
- Create the basic project structure
      `,
      subtasks: [
        { id: "1-1", description: "Create a new project directory", completed: false },
        { id: "1-2", description: "Initialize version control", completed: false },
        { id: "1-3", description: "Set up package.json and install core dependencies", completed: false },
        { id: "1-4", description: "Configure TypeScript and linting", completed: false },
        { id: "1-5", description: "Create basic folder structure", completed: false }
      ]
    },
    {
      id: "step-2",
      title: "Core Data Models",
      description: `
## Step 2: Implement Core Data Models

Define the data structures and relationships that will form the foundation of your application.

### Key Tasks:

- Define data structures and relationships
- Create model validation logic
- Implement data access patterns
- Add unit tests for models
      `,
      subtasks: [
        { id: "2-1", description: "Define interfaces for main data models", completed: false },
        { id: "2-2", description: "Implement validation functions", completed: false },
        { id: "2-3", description: "Create data access layer", completed: false },
        { id: "2-4", description: "Write unit tests for models", completed: false },
        { id: "2-5", description: "Document data model architecture", completed: false }
      ]
    },
    {
      id: "step-3",
      title: "Business Logic",
      description: `
## Step 3: Develop Business Logic

Implement the core algorithms and business operations that power your application.

### Key Tasks:

- Implement core algorithms
- Create service layer for business operations
- Add error handling and logging
- Write unit tests for business logic
      `,
      subtasks: [
        { id: "3-1", description: "Create service classes/functions", completed: false },
        { id: "3-2", description: "Implement core business logic", completed: false },
        { id: "3-3", description: "Add comprehensive error handling", completed: false },
        { id: "3-4", description: "Implement logging system", completed: false },
        { id: "3-5", description: "Write unit tests for services", completed: false }
      ]
    },
    {
      id: "step-4",
      title: "User Interface",
      description: `
## Step 4: Build User Interface

Create the user interface components and connect them to the business logic layer.

### Key Tasks:

- Create component hierarchy
- Implement UI layouts and styling
- Add state management
- Connect UI to business logic layer
      `,
      subtasks: [
        { id: "4-1", description: "Design component architecture", completed: false },
        { id: "4-2", description: "Implement core UI components", completed: false },
        { id: "4-3", description: "Create layouts and apply styling", completed: false },
        { id: "4-4", description: "Implement state management", completed: false },
        { id: "4-5", description: "Connect UI components to services", completed: false }
      ]
    },
    {
      id: "step-5",
      title: "API Layer",
      description: `
## Step 5: Implement API Layer

Define and implement the API endpoints that will handle data exchange.

### Key Tasks:

- Define API endpoints
- Create request/response handlers
- Add authentication and authorization
- Implement data validation
      `,
      subtasks: [
        { id: "5-1", description: "Define API routes and controllers", completed: false },
        { id: "5-2", description: "Implement request handlers", completed: false },
        { id: "5-3", description: "Add response formatting", completed: false },
        { id: "5-4", description: "Implement authentication middleware", completed: false },
        { id: "5-5", description: "Add input validation", completed: false }
      ]
    },
    {
      id: "step-6",
      title: "Testing & QA",
      description: `
## Step 6: Testing and Quality Assurance

Ensure the application works correctly and meets quality standards.

### Key Tasks:

- Write integration tests
- Perform end-to-end testing
- Conduct performance testing
- Fix identified issues
      `,
      subtasks: [
        { id: "6-1", description: "Write integration tests", completed: false },
        { id: "6-2", description: "Set up end-to-end testing", completed: false },
        { id: "6-3", description: "Perform performance testing", completed: false },
        { id: "6-4", description: "Fix bugs and issues", completed: false },
        { id: "6-5", description: "Conduct code review", completed: false }
      ]
    },
    {
      id: "step-7",
      title: "Deployment",
      description: `
## Step 7: Deployment and Documentation

Prepare the application for production and create documentation.

### Key Tasks:

- Set up deployment pipeline
- Configure production environment
- Write user documentation
- Create technical documentation
      `,
      subtasks: [
        { id: "7-1", description: "Set up CI/CD pipeline", completed: false },
        { id: "7-2", description: "Configure production environment", completed: false },
        { id: "7-3", description: "Deploy application", completed: false },
        { id: "7-4", description: "Write user documentation", completed: false },
        { id: "7-5", description: "Create technical documentation", completed: false }
      ]
    }
  ]);

  const sections = [
    { id: "implementation-steps", title: "Implementation Steps" },
    { id: "examples", title: "Examples" },
    { id: "best-practices", title: "Best Practices" },
    { id: "resources", title: "Resources" }
  ];

  const toggleSubtask = (stepId: string, subtaskId: string) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subtasks: step.subtasks.map(subtask => {
            if (subtask.id === subtaskId) {
              return { ...subtask, completed: !subtask.completed };
            }
            return subtask;
          })
        };
      }
      return step;
    }));
  };

  const getStepProgress = (step: ActionStep) => {
    const completed = step.subtasks.filter(subtask => subtask.completed).length;
    const total = step.subtasks.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const currentSection = activeSection === "implementation-steps" ? (
    <div className="space-y-8">
      {steps.map(step => {
        const progress = getStepProgress(step);
        
        return (
          <div key={step.id} id={step.id} className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    {progress.completed}/{progress.total} completed
                  </div>
                  <div className="w-24 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" 
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <Markdown>{step.description}</Markdown>
              </div>
              
              <div className="space-y-2 mt-4">
                <h4 className="font-medium">Checklist</h4>
                <div className="space-y-2">
                  {step.subtasks.map(subtask => (
                    <div 
                      key={subtask.id}
                      className="flex items-start gap-3 p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <button
                        onClick={() => toggleSubtask(step.id, subtask.id)}
                        className={cn(
                          "h-5 w-5 rounded-sm flex-shrink-0 border transition-colors mt-0.5",
                          subtask.completed 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "border-input"
                        )}
                      >
                        {subtask.completed && <Check className="h-4 w-4" />}
                      </button>
                      <span className={cn(
                        "text-sm transition-colors",
                        subtask.completed && "line-through text-muted-foreground"
                      )}>
                        {subtask.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : activeSection === "examples" ? (
    <div className="prose dark:prose-invert max-w-none">
      <h2>Example Action Plans</h2>
      
      <h3>Web Application Example</h3>
      <p>
        This example shows an action plan for building a web application with user authentication,
        data management, and a responsive UI.
      </p>
      
      <div className="not-prose border border-border rounded-lg overflow-hidden mt-4 mb-8">
        <div className="bg-muted p-4">
          <h4 className="text-lg font-medium">Todo List Application</h4>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm bg-primary flex items-center justify-center text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm line-through text-muted-foreground">Set up React project with TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm bg-primary flex items-center justify-center text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm line-through text-muted-foreground">Implement user authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm bg-primary flex items-center justify-center text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm line-through text-muted-foreground">Create todo data model</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm border border-input flex items-center justify-center">
              </div>
              <span className="text-sm">Implement CRUD operations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm border border-input flex items-center justify-center">
              </div>
              <span className="text-sm">Create responsive UI components</span>
            </div>
          </div>
        </div>
      </div>
      
      <h3>Mobile App Example</h3>
      <p>
        This example demonstrates an action plan for developing a mobile application
        with offline capabilities and push notifications.
      </p>
      
      <div className="not-prose border border-border rounded-lg overflow-hidden mt-4">
        <div className="bg-muted p-4">
          <h4 className="text-lg font-medium">Fitness Tracker App</h4>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm bg-primary flex items-center justify-center text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm line-through text-muted-foreground">Set up React Native project</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm bg-primary flex items-center justify-center text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm line-through text-muted-foreground">Implement user profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm border border-input flex items-center justify-center">
              </div>
              <span className="text-sm">Create workout tracking functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm border border-input flex items-center justify-center">
              </div>
              <span className="text-sm">Implement offline data storage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-sm border border-input flex items-center justify-center">
              </div>
              <span className="text-sm">Add push notifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : activeSection === "best-practices" ? (
    <div className="prose dark:prose-invert max-w-none">
      <h2>Best Practices for Action Plans</h2>
      
      <h3>Breaking Down Tasks</h3>
      <p>
        Effective action plans break down complex projects into manageable tasks and subtasks.
        Here are some best practices for creating well-structured action plans:
      </p>
      
      <ul>
        <li>Break large tasks into smaller, actionable subtasks</li>
        <li>Ensure each subtask is specific and measurable</li>
        <li>Organize tasks in a logical sequence</li>
        <li>Set realistic timeframes for each task</li>
        <li>Identify dependencies between tasks</li>
      </ul>
      
      <h3>Implementation Strategies</h3>
      <p>
        When implementing your action plan, consider these strategies:
      </p>
      
      <ul>
        <li>Start with a minimum viable product (MVP)</li>
        <li>Use iterative development approaches</li>
        <li>Regularly review and adjust your plan</li>
        <li>Document decisions and changes</li>
        <li>Test early and often</li>
      </ul>
      
      <h3>Common Pitfalls to Avoid</h3>
      <p>
        Watch out for these common pitfalls when executing your action plan:
      </p>
      
      <ul>
        <li>Scope creep - adding features beyond the original plan</li>
        <li>Underestimating task complexity</li>
        <li>Neglecting testing and quality assurance</li>
        <li>Poor documentation</li>
        <li>Ignoring technical debt</li>
      </ul>
    </div>
  ) : (
    <div className="prose dark:prose-invert max-w-none">
      <h2>Resources</h2>
      
      <h3>Development Tools</h3>
      <p>
        These tools can help you implement your action plan more efficiently:
      </p>
      
      <ul>
        <li>Version Control: Git, GitHub, GitLab</li>
        <li>Project Management: Jira, Trello, Asana</li>
        <li>Development Environments: VS Code, WebStorm, Atom</li>
        <li>Testing Tools: Jest, Cypress, Selenium</li>
        <li>CI/CD: GitHub Actions, Jenkins, CircleCI</li>
      </ul>
      
      <h3>Learning Resources</h3>
      <p>
        Expand your knowledge with these resources:
      </p>
      
      <ul>
        <li>Documentation: MDN Web Docs, React Docs, TypeScript Handbook</li>
        <li>Courses: Udemy, Coursera, freeCodeCamp</li>
        <li>Communities: Stack Overflow, Reddit, Discord</li>
        <li>Blogs: CSS-Tricks, Smashing Magazine, Dev.to</li>
        <li>Books: "Clean Code", "Refactoring", "Design Patterns"</li>
      </ul>
      
      <h3>Templates and Boilerplates</h3>
      <p>
        Save time with these templates and boilerplates:
      </p>
      
      <ul>
        <li>React: Create React App, Next.js, Vite</li>
        <li>Node.js: Express Generator, NestJS CLI</li>
        <li>Mobile: React Native CLI, Expo</li>
        <li>Full-Stack: MERN/MEAN stacks, T3 Stack</li>
        <li>Design Systems: Material-UI, Tailwind CSS, Chakra UI</li>
      </ul>
    </div>
  );

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar Navigation */}
          <div className="md:w-1/4 space-y-1 md:sticky md:top-20 md:self-start">
            <div className="text-lg font-semibold mb-4">Action Plan</div>
            {sections.map((section) => (
              <button
                key={section.id}
                id={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-md text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="md:w-3/4"
          >
            {currentSection}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
