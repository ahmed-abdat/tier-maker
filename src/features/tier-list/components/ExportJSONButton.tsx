"use client";

import { useState, useCallback } from "react";
import { FileJson, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { TierList } from "../index";
import { downloadTierListAsJSON, formatFileSize } from "../utils/json-export";

interface ExportJSONButtonProps {
  tierList: TierList | null;
  isMobile?: boolean;
}

export function ExportJSONButton({
  tierList,
  isMobile = false,
}: ExportJSONButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(() => {
    if (!tierList) {
      toast.error("No tier list to export");
      return;
    }

    setIsExporting(true);

    try {
      const result = downloadTierListAsJSON(tierList);

      if (result.success) {
        const sizeStr = formatFileSize(result.fileSizeBytes);

        if (result.fileSizeBytes > 1024 * 1024) {
          toast.success(`Exported! (${sizeStr} - consider removing some images to reduce size)`);
        } else {
          toast.success(`Tier list exported as JSON (${sizeStr})`);
        }
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export tier list");
    } finally {
      setIsExporting(false);
    }
  }, [tierList]);

  const hasContent = tierList !== null;
  const isDisabled = isExporting || !hasContent;

  const button = (
    <Button
      onClick={handleExport}
      disabled={isDisabled}
      variant="outline"
      aria-busy={isExporting}
      aria-label={
        isExporting ? "Exporting tier list" : "Export tier list as JSON"
      }
      className={`${isMobile ? "h-11 min-w-[44px] px-4" : "h-10 px-3 sm:h-9 sm:px-4"} ${!hasContent ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span className={`ml-2 ${isMobile ? "" : "hidden sm:inline"}`}>
            Exporting...
          </span>
        </>
      ) : (
        <>
          <FileJson className="h-4 w-4" aria-hidden="true" />
          <span className={`ml-2 ${isMobile ? "" : "hidden sm:inline"}`}>
            JSON
          </span>
        </>
      )}
    </Button>
  );

  const tooltipMessage =
    !hasContent && !isExporting
      ? "Create a tier list first"
      : "Export tier list as JSON file (for backup/transfer)";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {!hasContent && !isExporting ? (
          <span role="presentation">{button}</span>
        ) : (
          button
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipMessage}</p>
      </TooltipContent>
    </Tooltip>
  );
}
