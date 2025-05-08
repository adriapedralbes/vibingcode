"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DocumentationHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background border-b border-border">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-[800px]"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            AI Prompt Optimizer Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
            Comprehensive guide to using our AI Prompt Optimizer for creating effective coding prompts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Button
            className={cn(
              "rounded-full px-8",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            asChild
          >
            <a href="#getting-started">Get Started</a>
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-8"
            asChild
          >
            <a href="#examples">View Examples</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative w-full max-w-[800px] mt-16 rounded-lg overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg" />
          <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div className="flex-1 text-xs text-muted-foreground ml-2">Documentation</div>
            </div>
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-semibold">Quick Reference</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">→</span>
                  <span>Describe your project idea in a few sentences</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">→</span>
                  <span>Get detailed documentation and technical action plan</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">→</span>
                  <span>Use the optimized prompt with your preferred AI coding assistant</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">→</span>
                  <span>Implement your project with clear guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
