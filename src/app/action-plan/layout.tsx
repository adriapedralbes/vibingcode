import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Navbar } from "@/components/sections/navbar";
import { FooterSection } from "@/components/sections/footer-section";

export const metadata: Metadata = {
  title: {
    default: "Action Plan | AI Prompt Optimizer",
    template: "%s | AI Prompt Optimizer Action Plan",
  },
  description: "Technical action plans for implementing your AI coding projects. Get step-by-step guidance with interactive checklists.",
};

interface ActionPlanLayoutProps {
  children: React.ReactNode;
}

export default function ActionPlanLayout({
  children,
}: ActionPlanLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="container px-4 md:px-6 pt-4 md:pt-6">
        <Breadcrumb />
      </div>
      {children}
      <FooterSection />
    </>
  );
}
