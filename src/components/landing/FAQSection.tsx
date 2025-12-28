"use client";

import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "what-is-libretier",
    question: "What is LibreTier?",
    answer:
      "LibreTier is a free, open-source tier list maker. Create beautiful rankings with drag-and-drop, customize tiers with colors and names, export as images, and share with friends. No account required - everything runs in your browser.",
  },
  {
    id: "why-libretier",
    question: "Why LibreTier over TierMaker?",
    answer:
      "Unlike TierMaker, LibreTier requires no Twitter login or invasive permissions. Your data stays on YOUR device - no tracking, no ads, no watermarks. Plus features like 50-step undo/redo, text-only items, and unlimited custom tiers that others don't have.",
  },
  {
    id: "privacy",
    question: "Is my data private?",
    answer:
      "Yes. LibreTier is privacy-first. All tier lists are stored locally in your browser using compressed localStorage. We don't collect, track, or have access to your data. You only share when you explicitly choose to.",
  },
  {
    id: "offline",
    question: "Does it work offline?",
    answer:
      "Yes! LibreTier is a Progressive Web App (PWA). Install it on your phone or desktop and use it without internet. All features work offline - create, edit, and export tier lists anywhere.",
  },
  {
    id: "sharing",
    question: "How do I share my tier list?",
    answer:
      "You can export as PNG image, generate a shareable URL link, or create a JSON backup. URL sharing uploads images to ImgBB (free) so others can view and clone your tier list.",
  },
  {
    id: "open-source",
    question: "Is LibreTier open source?",
    answer:
      "Yes, LibreTier is MIT licensed and fully open source. You can view the code, contribute, or self-host it. We believe tier list tools should be free and respect your privacy.",
  },
];

export function FAQSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 md:py-24">
      {/* Subtle centered glow - blends with adjacent sections */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/3 dark:bg-primary/2 absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] sm:h-[500px] sm:w-[500px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/60 mt-3 text-sm sm:text-base">
            Everything you need to know about LibreTier.{" "}
            <a
              href="https://github.com/ahmed-abdat/LibreTier/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Contact us
            </a>{" "}
            for more info.
          </p>
        </motion.div>

        {/* FAQ Accordion with vertical line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          {/* Vertical guide line */}
          <div
            aria-hidden="true"
            className="bg-border/50 dark:bg-border/30 pointer-events-none absolute inset-y-0 left-3 h-full w-px"
          />

          <Accordion type="single" collapsible>
            {faqs.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="group border-border/40 dark:border-border/20 relative border-b pl-5 first:border-t"
              >
                {/* Plus icon on the line */}
                <PlusIcon
                  aria-hidden="true"
                  className="text-muted-foreground/60 pointer-events-none absolute -bottom-[5px] left-[7px] h-2.5 w-2.5 -translate-x-1/2 group-last:hidden"
                />

                <AccordionTrigger className="text-foreground data-[state=open]:text-primary py-4 pr-2 text-left text-sm leading-relaxed hover:no-underline sm:text-[15px]">
                  {item.question}
                </AccordionTrigger>

                <AccordionContent className="text-foreground/70 pr-2 pb-4 text-sm leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
