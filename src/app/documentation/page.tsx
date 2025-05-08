
import { Metadata } from "next";
import { DocumentationHero } from "@/components/sections/documentation-hero";
import { DocumentationContent } from "@/components/sections/documentation-content";

export const metadata: Metadata = {
  title: "Documentation | AI Prompt Optimizer",
  description: "Detailed documentation for the AI Prompt Optimizer platform. Learn how to create optimized prompts for AI coding projects.",
};

export default function DocumentationPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full">
      <DocumentationHero />
      <DocumentationContent />
    </main>
  );
}
