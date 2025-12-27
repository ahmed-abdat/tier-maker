"use client";

import { useState, useCallback, useMemo } from "react";
import {
  FileJson,
  HardDrive,
  Share2,
  Cloud,
  CheckCircle2,
  XCircle,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TierList } from "../index";
import {
  formatFileSize,
  getItemsWithBase64Images,
  createTierListExport,
} from "../utils/json-export";
import {
  useShareableExport,
  type ExportMode,
} from "../hooks/useShareableExport";

interface ExportJSONDialogProps {
  tierList: TierList | null;
  isMobile?: boolean;
}

export function ExportJSONDialog({
  tierList,
  isMobile = false,
}: ExportJSONDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    exportMode,
    setExportMode,
    exportState,
    uploadProgress,
    currentImageName,
    shareableEnabled,
    handleExport,
    handleSimpleExport,
    handleCancel,
    resetState,
    isExportingSimple,
  } = useShareableExport({
    tierList,
    onSuccess: () => setIsOpen(false),
  });

  // Calculate estimated file sizes
  const fileSizeEstimate = useMemo(() => {
    if (!tierList) return { backup: 0, shareable: 0, imageCount: 0 };

    const exportData = createTierListExport(tierList);
    const fullJson = JSON.stringify(exportData);
    const backupSize = new Blob([fullJson]).size;

    const itemsWithImages = getItemsWithBase64Images(tierList);
    let base64Size = 0;
    itemsWithImages.forEach((item) => {
      base64Size += item.base64.length;
    });
    const shareableSize = Math.max(
      backupSize - base64Size + itemsWithImages.length * 100,
      1024
    );

    return {
      backup: backupSize,
      shareable: shareableSize,
      imageCount: itemsWithImages.length,
    };
  }, [tierList]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && exportState === "uploading") {
        return;
      }
      setIsOpen(open);
      if (!open) {
        resetState();
      }
    },
    [exportState, resetState]
  );

  const hasContent = tierList !== null;
  const isDisabled = !hasContent;
  const isUploading = exportState === "uploading" && uploadProgress;

  const progressPercent = uploadProgress
    ? Math.round((uploadProgress.current / uploadProgress.total) * 100)
    : 0;

  // Simple button (no shareable option available)
  const simpleButton = (
    <Button
      onClick={handleSimpleExport}
      disabled={isDisabled || isExportingSimple}
      variant="outline"
      aria-label="Export tier list as JSON"
      className={`${isMobile ? "h-11 min-w-[44px] px-4" : "h-10 px-3 sm:h-9 sm:px-4"} ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {isExportingSimple ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <FileJson className="h-4 w-4" aria-hidden="true" />
      )}
      <span className={`ml-2 ${isMobile ? "" : "hidden sm:inline"}`}>JSON</span>
    </Button>
  );

  // Dialog trigger button (shareable option available)
  const dialogTriggerButton = (
    <Button
      disabled={isDisabled}
      variant="outline"
      aria-label="Export tier list as JSON"
      className={`${isMobile ? "h-11 min-w-[44px] px-4" : "h-10 px-3 sm:h-9 sm:px-4"} ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <FileJson className="h-4 w-4" aria-hidden="true" />
      <span className={`ml-2 ${isMobile ? "" : "hidden sm:inline"}`}>JSON</span>
    </Button>
  );

  // Still loading config - show simple button as fallback
  if (shareableEnabled === null) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {isDisabled ? (
            <span role="presentation">{simpleButton}</span>
          ) : (
            simpleButton
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isDisabled
              ? "Create a tier list first"
              : "Export tier list as JSON file"}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // No shareable option - show simple export button
  if (!shareableEnabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {isDisabled ? (
            <span role="presentation">{simpleButton}</span>
          ) : (
            simpleButton
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isDisabled
              ? "Create a tier list first"
              : "Export tier list as JSON file (for backup/transfer)"}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Shareable option available - show dialog with options
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            {isDisabled ? (
              <span role="presentation">{dialogTriggerButton}</span>
            ) : (
              dialogTriggerButton
            )}
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isDisabled ? "Create a tier list first" : "Export as JSON file"}
          </p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Tier List</DialogTitle>
          <DialogDescription>
            Choose how you want to export your tier list
          </DialogDescription>
        </DialogHeader>

        {/* Uploading State */}
        {isUploading && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 animate-pulse text-primary" />
              <p className="text-sm font-medium">
                Uploading images to cloud...
              </p>
            </div>

            <Progress value={progressPercent} className="h-2" />

            <div className="space-y-1">
              <p className="text-center text-sm text-muted-foreground">
                {uploadProgress.current} of {uploadProgress.total} images (
                {progressPercent}%)
              </p>
              {currentImageName && (
                <p className="truncate text-center text-xs text-muted-foreground">
                  Uploading: {currentImageName}
                </p>
              )}
            </div>

            <Button variant="outline" onClick={handleCancel} className="w-full">
              Cancel
            </Button>
          </div>
        )}

        {/* Success State */}
        {exportState === "success" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-sm font-medium">Export complete!</p>
          </div>
        )}

        {/* Error State */}
        {exportState === "error" && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-sm font-medium">Export failed</p>
              <p className="text-center text-sm text-muted-foreground">
                Please check your internet connection and try again.
              </p>
            </div>
            <Button onClick={resetState} className="w-full">
              Try Again
            </Button>
          </div>
        )}

        {/* Idle State - Selection */}
        {exportState === "idle" && (
          <div className="space-y-6 py-4">
            <RadioGroup
              value={exportMode}
              onValueChange={(v) => setExportMode(v as ExportMode)}
              className="space-y-3"
            >
              {/* Backup Option */}
              <label
                htmlFor="backup"
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                  exportMode === "backup"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <RadioGroupItem value="backup" id="backup" className="mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <HardDrive className="h-4 w-4" />
                      Full Backup
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ~{formatFileSize(fileSizeEstimate.backup)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Images embedded in file. Works offline.
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[200px]">
                    <p>
                      Best for personal backups. File includes all images as
                      base64 data. No internet needed to view.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </label>

              {/* Shareable Option */}
              <label
                htmlFor="shareable"
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                  exportMode === "shareable"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <RadioGroupItem
                  value="shareable"
                  id="shareable"
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <Share2 className="h-4 w-4" />
                      Shareable
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ~{formatFileSize(fileSizeEstimate.shareable)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {fileSizeEstimate.imageCount > 0
                      ? `${fileSizeEstimate.imageCount} image${fileSizeEstimate.imageCount > 1 ? "s" : ""} will be uploaded to cloud.`
                      : "No images to upload. Small file size."}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[200px]">
                    <p>
                      Best for sharing with friends. Images hosted on cloud
                      (ImgBB). Small file, easy to send via chat or email.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </label>
            </RadioGroup>

            <Button onClick={() => void handleExport()} className="w-full">
              <FileJson className="mr-2 h-4 w-4" />
              Export {exportMode === "backup" ? "Backup" : "Shareable"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
