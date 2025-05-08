
import { Metadata } from "next";
import { ActionPlanHero } from "@/components/sections/action-plan-hero";
import { ActionPlanContent } from "@/components/sections/action-plan-content";

export const metadata: Metadata = {
  title: "Action Plan | AI Prompt Optimizer",
  description: "Technical action plans for implementing your AI coding projects. Get step-by-step guidance with interactive checklists.",
};

export default function ActionPlanPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full">
      <ActionPlanHero />
      <ActionPlanContent />
    </main>
  );
}
