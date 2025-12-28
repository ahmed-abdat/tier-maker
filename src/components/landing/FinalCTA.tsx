"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto w-full overflow-hidden px-4 py-20 sm:py-28"
    >
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="from-primary/8 via-primary/4 to-background absolute inset-0 bg-gradient-to-b" />
        <div className="bg-primary/10 absolute top-0 left-1/4 h-72 w-72 rounded-full blur-[100px]" />
        <div className="bg-primary/8 absolute right-1/4 bottom-0 h-96 w-96 rounded-full blur-[120px]" />
      </div>

      {/* Decorative floating tier cards */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -12 }}
          whileInView={{ opacity: 0.6, y: 0, rotate: -12 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute top-12 left-[8%] hidden sm:block"
        >
          <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-[#FF7F7F] text-sm font-bold text-black shadow-lg">
            S
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20, rotate: 8 }}
          whileInView={{ opacity: 0.5, y: 0, rotate: 8 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute right-[10%] bottom-16 hidden sm:block"
        >
          <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-[#FFBF7F] text-sm font-bold text-black shadow-lg">
            A
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20, rotate: -6 }}
          whileInView={{ opacity: 0.4, x: 0, rotate: -6 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-20 left-[15%] hidden sm:block"
        >
          <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-[#7FFF7F] text-sm font-bold text-black shadow-lg">
            B
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-2xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
        >
          <Sparkles className="text-primary h-4 w-4" />
          <span className="text-primary text-sm font-medium">
            100% Free & Open Source
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        >
          Ready to rank?
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mx-auto mt-4 max-w-md text-lg sm:text-xl"
        >
          Start creating your tier list now. No account needed.
        </motion.p>

        {/* CTA Button with glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative mt-10"
        >
          {/* Button glow */}
          <div className="bg-primary/30 absolute inset-0 mx-auto h-14 w-48 rounded-2xl blur-xl" />

          <Button
            size="lg"
            asChild
            className="group relative rounded-2xl px-10 py-7 text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/30"
          >
            <Link href="/tiers">
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
        >
          {["Free forever", "Works offline", "No sign-up"].map((text) => (
            <span
              key={text}
              className="text-muted-foreground flex items-center gap-1.5"
            >
              <span className="bg-primary/60 h-1.5 w-1.5 rounded-full" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
