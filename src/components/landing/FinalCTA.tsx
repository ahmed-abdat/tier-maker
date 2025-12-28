"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-muted/30 mx-auto w-full px-4 py-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
          Ready to rank?
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Start creating your tier list now. No account needed.
        </p>

        <div className="mt-8">
          <Button
            size="lg"
            asChild
            className="group hover:shadow-primary/25 rounded-xl px-8 py-6 text-base font-semibold shadow-xl hover:shadow-2xl sm:text-lg"
          >
            <Link href="/tiers">
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground mt-4 text-sm">
          Free forever. Works offline. Open source.
        </p>
      </div>
    </motion.section>
  );
}
