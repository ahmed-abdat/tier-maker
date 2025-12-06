"use client";

import { motion } from "framer-motion";
import { Plus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNew: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-12"
    >
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
        <Layers className="w-10 h-10 text-muted-foreground/50" />
      </div>

      {/* Text content */}
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-2xl font-bold text-foreground">
          No tier lists yet
        </h2>
        <p className="text-muted-foreground">
          Create your first tier list to start ranking and organizing your favorite things.
        </p>
      </div>

      {/* CTA Button */}
      <Button
        size="lg"
        onClick={onCreateNew}
        className="mt-8 gap-2 group shadow-lg hover:shadow-xl hover:shadow-primary/20"
      >
        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        Create Your First Tier List
      </Button>
    </motion.div>
  );
}
