"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ActionPlanHero() {
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
            Technical Action Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
            Step-by-step implementation guides for your AI coding projects with interactive checklists.
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
            <a href="#implementation-steps">View Steps</a>
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-8"
            asChild
          >
            <a href="#examples">See Examples</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative w-full max-w-[800px] mt-16 rounded-lg overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg" />
          <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div className="flex-1 text-xs text-muted-foreground ml-2">Action Plan</div>
            </div>
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-semibold">Implementation Overview</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded border border-primary/50 flex items-center justify-center mr-3">
                    <div className="h-3 w-3 bg-primary rounded-sm" />
                  </div>
                  <span className="text-sm">Project setup and configuration</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded border border-primary/50 flex items-center justify-center mr-3">
                    <div className="h-3 w-3 bg-primary rounded-sm" />
                  </div>
                  <span className="text-sm">Core functionality implementation</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded border border-border flex items-center justify-center mr-3">
                  </div>
                  <span className="text-sm">User interface development</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded border border-border flex items-center justify-center mr-3">
                  </div>
                  <span className="text-sm">Testing and optimization</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded border border-border flex items-center justify-center mr-3">
                  </div>
                  <span className="text-sm">Deployment and documentation</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
