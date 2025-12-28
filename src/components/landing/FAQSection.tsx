"use client";

import { motion } from "framer-motion";
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-2xl px-4 py-16"
    >
      <div className="mb-8 text-center">
        <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground mt-2">
          Everything you need to know about LibreTier
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="text-left text-base">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}
