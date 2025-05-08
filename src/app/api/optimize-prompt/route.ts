
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PromptOptimizerRequest, PromptOptimizerResponse, PromptOptimizerError } from "@/lib/types/prompt-optimizer";

// Initialize OpenAI client
// Note: In a production environment, you would use environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // For demo purposes, return mock data if no API key is provided
      return NextResponse.json({
        documentation: getMockDocumentation(prompt),
        actionPlan: getMockActionPlan(prompt),
      });
    }

    // Prepare the system message for the AI
    const systemMessage = `You are a specialized AI agent for optimizing coding prompts. 
    Your task is to take a brief project idea and transform it into a structured output that another AI can use to implement the idea.
    
    You will provide two outputs:
    1. Documentation: A non-technical overview of the project architecture, explaining the main components and how they fit together.
    2. Action Plan: A detailed, step-by-step technical plan with subtasks that another AI could follow to implement the idea.
    
    Format your response as a JSON object with two properties:
    - documentation: A markdown string with the project documentation
    - actionPlan: A markdown string with the technical action plan
    
    Make the documentation clear, concise, and focused on the architecture without diving into technical implementation details.
    Make the action plan detailed, technical, and structured with clear steps and subtasks.`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Parse the response
    const content = response.choices[0]?.message?.content || "";
    let parsedContent;

    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      // If the response is not valid JSON, try to extract documentation and action plan using regex
      const documentationMatch = content.match(/documentation[:\s]+([\s\S]+?)(?=actionPlan|$)/i);
      const actionPlanMatch = content.match(/actionPlan[:\s]+([\s\S]+?)(?=$)/i);

      parsedContent = {
        documentation: documentationMatch ? documentationMatch[1].trim() : "Failed to parse documentation",
        actionPlan: actionPlanMatch ? actionPlanMatch[1].trim() : "Failed to parse action plan",
      };
    }

    // Return the response
    return NextResponse.json({
      documentation: parsedContent.documentation || "No documentation provided",
      actionPlan: parsedContent.actionPlan || "No action plan provided",
    });
  } catch (error) {
    console.error("Error processing prompt:", error);
    
    // Determine the error message and status code
    let errorMessage = "Failed to process prompt";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types
      if (errorMessage.includes("API key")) {
        errorMessage = "API key is missing or invalid";
        statusCode = 401;
      } else if (errorMessage.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again later";
        statusCode = 429;
      } else if (errorMessage.includes("timeout")) {
        errorMessage = "Request timed out. Please try again";
        statusCode = 408;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

// Mock data for demonstration purposes when no API key is available
function getMockDocumentation(prompt: string): string {
  return `# Project Documentation: ${prompt}

## Overview
This project aims to create a solution based on the idea: "${prompt}". The architecture follows a modular approach with clear separation of concerns.

## Architecture
The system is composed of the following main components:

1. **User Interface Layer**
   - Provides intuitive interaction for users
   - Handles input validation and feedback
   - Responsive design for multiple device types

2. **Application Logic Layer**
   - Processes user inputs
   - Implements core business logic
   - Manages application state

3. **Data Management Layer**
   - Stores and retrieves necessary data
   - Ensures data integrity and security
   - Provides efficient data access patterns

## Component Interactions
- The UI Layer communicates with the Application Logic Layer through well-defined interfaces
- The Application Logic Layer accesses the Data Management Layer as needed
- All components follow a unidirectional data flow pattern

## Scalability Considerations
- The architecture supports horizontal scaling for increased load
- Components can be deployed independently
- Caching strategies are implemented at appropriate levels

This architecture provides a solid foundation for implementing the project while maintaining flexibility for future enhancements.`;
}

function getMockActionPlan(prompt: string): string {
  return `# Technical Action Plan: ${prompt}

## Step 1: Project Setup
- Initialize project repository
- Configure development environment
- Set up build system and dependencies
- Create basic project structure

## Step 2: Implement Core Data Models
- Define data structures and relationships
- Create model validation logic
- Implement data access patterns
- Add unit tests for models

## Step 3: Develop Business Logic
- Implement core algorithms
- Create service layer for business operations
- Add error handling and logging
- Write unit tests for business logic

## Step 4: Build User Interface
- Create component hierarchy
- Implement UI layouts and styling
- Add state management
- Connect UI to business logic layer

## Step 5: Implement API Layer
- Define API endpoints
- Create request/response handlers
- Add authentication and authorization
- Implement data validation

## Step 6: Testing and Quality Assurance
- Write integration tests
- Perform end-to-end testing
- Conduct performance testing
- Fix identified issues

## Step 7: Deployment and Documentation
- Set up deployment pipeline
- Configure production environment
- Write user documentation
- Create technical documentation

Each step includes detailed subtasks that should be implemented sequentially to ensure a coherent development process.`;
}
