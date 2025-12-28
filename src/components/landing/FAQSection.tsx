"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is a tier list?",
    answer:
      "A tier list is a ranking system that organizes items into tiers (usually S, A, B, C, D, F) from best to worst. Tier lists are popular for ranking games, characters, movies, music, and anything else you want to compare.",
  },
  {
    question: "Is LibreTier really free?",
    answer:
      "Yes, LibreTier is 100% free and open source. No hidden costs, no premium features, no subscriptions. All features are available to everyone.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account required. Start creating tier lists immediately. Your data is stored locally on your device, giving you full privacy and control.",
  },
  {
    question: "Does it work without internet?",
    answer:
      "Yes! LibreTier is a Progressive Web App (PWA) that works offline. Install it on your device and create tier lists anywhere, anytime.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your tier lists are stored locally on your device. We don't collect, store, or have access to your data. Share only when you choose to.",
  },
];

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "border-b border-border/30 dark:border-border/20",
        "transition-colors duration-200"
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left sm:py-5"
      >
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-200 sm:text-base",
            isOpen ? "text-primary" : "text-foreground"
          )}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "ml-4 flex-shrink-0 transition-colors duration-200",
            isOpen ? "text-primary" : "text-foreground/50"
          )}
        >
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-foreground/70 pb-4 text-sm leading-relaxed sm:pb-5 sm:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 md:py-24">
      {/* Subtle centered glow - blends with adjacent sections */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/[0.03] dark:bg-primary/[0.02] absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] sm:h-[500px] sm:w-[500px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center sm:mb-12"
        >
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/70 mt-3 text-base sm:text-lg">
            Everything you need to know about LibreTier
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-foreground/60 mt-6 text-center text-xs sm:mt-8 sm:text-sm"
        >
          Have more questions?{" "}
          <a
            href="https://github.com/ahmed-abdat/LibreTier/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Open an issue on GitHub
          </a>
        </motion.p>
      </div>
    </section>
  );
}
