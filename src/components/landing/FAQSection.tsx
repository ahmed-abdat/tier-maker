"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export function FAQSection() {
  return (
    <section className="bg-muted/30 dark:bg-muted/10 relative w-full py-20 sm:py-24">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-background via-transparent to-background absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="bg-muted mb-4 inline-flex items-center justify-center rounded-full p-3">
            <HelpCircle className="text-foreground h-6 w-6" />
          </div>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Everything you need to know about LibreTier
          </p>
        </motion.div>

        {/* FAQ Accordion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-border/50 dark:ring-border/30 w-full rounded-2xl border px-6 py-2 shadow-lg ring-1 sm:px-8"
          >
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-border/50 dark:border-border/30 border-dashed last:border-b-0"
              >
                <AccordionTrigger className="text-foreground py-5 text-left text-base font-medium hover:no-underline sm:text-lg [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="text-foreground/80 dark:text-foreground/70 text-base leading-relaxed"
                  contentClassName="pb-5"
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mt-8 text-center text-sm"
        >
          Have more questions?{" "}
          <a
            href="https://github.com/libretier/libretier/issues"
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
