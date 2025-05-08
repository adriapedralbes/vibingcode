import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Navbar } from "@/components/sections/navbar";
import { FooterSection } from "@/components/sections/footer-section";

export const metadata: Metadata = {
  title: {
    default: "Documentation | AI Prompt Optimizer",
    template: "%s | AI Prompt Optimizer Documentation",
  },
  description: "Detailed documentation for the AI Prompt Optimizer platform. Learn how to create optimized prompts for AI coding projects.",
};

interface DocumentationLayoutProps {
  children: React.ReactNode;
}

export default function DocumentationLayout({
  children,
}: DocumentationLayoutProps) {
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
