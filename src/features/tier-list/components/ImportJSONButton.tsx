"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useTierStore } from "../store";
import { importTierListFromFile } from "../utils/json-import";

interface ImportJSONButtonProps {
  onImportSuccess?: (listId: string) => void;
  redirectToEditor?: boolean;
}

export function ImportJSONButton({
  onImportSuccess,
  redirectToEditor = true,
}: ImportJSONButtonProps) {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const importList = useTierStore((state) => state.importList);
  const tierLists = useTierStore((state) => state.tierLists);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Reset input so same file can be selected again
      event.target.value = "";

      setIsImporting(true);
      const toastId = toast.loading("Importing tier list...");

      try {
        // Import and validate the file
        const tierListData = await importTierListFromFile(file);

        // Check for duplicate title and modify if needed
        const existingTitles = new Set(tierLists.map((l) => l.title));
        let finalTitle = tierListData.title;
        if (existingTitles.has(finalTitle)) {
          finalTitle = `${finalTitle} (Imported)`;
          tierListData.title = finalTitle;
        }

        // Import to store
        const newListId = importList(tierListData);

        // Count items for success message
        const itemCount =
          tierListData.rows.reduce((acc, row) => acc + row.items.length, 0) +
          tierListData.unassignedItems.length;

        toast.success(
          `Imported "${finalTitle}" with ${itemCount} item${itemCount !== 1 ? "s" : ""}`,
          { id: toastId }
        );

        // Callback
        onImportSuccess?.(newListId);

        // Redirect to editor
        if (redirectToEditor) {
          router.push(`/editor/${newListId}`);
        }
      } catch (error) {
        console.error("Import error:", error);
        const message =
          error instanceof Error ? error.message : "Failed to import tier list";
        toast.error(message, { id: toastId });
      } finally {
        setIsImporting(false);
      }
    },
    [importList, tierLists, onImportSuccess, redirectToEditor, router]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const button = (
    <Button
      onClick={handleClick}
      disabled={isImporting}
      variant="outline"
      aria-busy={isImporting}
      aria-label={
        isImporting ? "Importing tier list" : "Import tier list from JSON"
      }
      className="h-10 px-3 sm:h-9 sm:px-4"
    >
      {isImporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span className="ml-2 hidden sm:inline">Importing...</span>
        </>
      ) : (
        <>
          <FileUp className="h-4 w-4" aria-hidden="true" />
          <span className="ml-2 hidden sm:inline">Import</span>
        </>
      )}
    </Button>
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={(e) => void handleFileSelect(e)}
        className="hidden"
        aria-hidden="true"
      />
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p>Import tier list from JSON file</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
