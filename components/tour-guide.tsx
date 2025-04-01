"use client";

import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const STORAGE_KEY = "currency-tour-seen";

interface TourGuideProps {
  children: React.ReactNode;
}

export function TourGuide({ children }: TourGuideProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the tour has been seen before
    const hasSeenTour = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenTour) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  if (!show) return <>{children}</>;

  return (
    <TooltipProvider>
      <Tooltip open={show} onOpenChange={handleClose}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-[300px] p-4"
          onPointerDownOutside={handleClose}
        >
          <div className="space-y-2">
            <p className="font-medium">New Feature!</p>
            <p className="text-sm text-muted-foreground">
              We now support multiple currencies! Click settings to change your
              preferred currency.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={handleClose}
            >
              Got it
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
