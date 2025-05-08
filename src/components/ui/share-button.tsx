"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({
  title = "AI Prompt Optimizer",
  text = "Check out this optimized AI prompt for coding!",
  url,
  className,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleShare = async () => {
    setIsSharing(true);
    setShareResult(null);
    
    try {
      // Use the current URL if none provided
      const shareUrl = url || window.location.href;
      
      // Check if the Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        
        setShareResult({
          success: true,
          message: "Shared successfully!",
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(shareUrl);
        
        setShareResult({
          success: true,
          message: "URL copied to clipboard!",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      
      setShareResult({
        success: false,
        message: "Failed to share. Please try again.",
      });
    } finally {
      setIsSharing(false);
      
      // Clear the result message after a delay
      setTimeout(() => {
        setShareResult(null);
      }, 3000);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className={cn("flex items-center gap-1", className)}
        onClick={handleShare}
        disabled={isSharing}
      >
        <Share className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:inline-block">Share</span>
      </Button>
      
      {shareResult && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 text-xs px-2 py-1 rounded z-50 whitespace-nowrap",
            shareResult.success
              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
          )}
        >
          {shareResult.message}
        </div>
      )}
    </div>
  );
}
