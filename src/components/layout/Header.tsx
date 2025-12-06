import { ThemeToggle } from "@/components/theme-toggle";
import { Layers } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold">Tier Maker</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
