"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  className,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      // Reset the copied state after a delay
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("flex items-center gap-1", className)}
      onClick={handleCopy}
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="sr-only md:not-sr-only md:inline-block">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-block">{label}</span>
        </>
      )}
    </Button>
  );
}
