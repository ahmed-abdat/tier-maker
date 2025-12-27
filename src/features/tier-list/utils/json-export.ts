import type { TierList, TierRow, TierItem } from "../index";

// Version 1 export schema
export interface TierListExport {
  version: 1;
  exportedAt: string;
  tierList: {
    title: string;
    description?: string;
    rows: ExportedTierRow[];
    unassignedItems: ExportedTierItem[];
    createdAt: string;
    updatedAt: string;
    tags?: string[];
  };
}

// Serialized versions with ISO date strings
interface ExportedTierItem {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExportedTierRow {
  id: string;
  level: string;
  color: string;
  items: ExportedTierItem[];
  name?: string;
  description?: string;
}

/**
 * Check if a string is a base64 data URL image
 */
export function isBase64Image(url: string | undefined): boolean {
  return Boolean(url?.startsWith("data:image/"));
}

/**
 * Serialize a tier item, optionally replacing image URL
 */
function serializeItem(
  item: TierItem,
  imageUrlOverride?: string
): ExportedTierItem {
  return {
    id: item.id,
    name: item.name,
    imageUrl: imageUrlOverride ?? item.imageUrl,
    description: item.description,
    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : String(item.createdAt),
    updatedAt:
      item.updatedAt instanceof Date
        ? item.updatedAt.toISOString()
        : String(item.updatedAt),
  };
}

/**
 * Serialize a tier row, optionally replacing image URLs via map
 */
function serializeRow(
  row: TierRow,
  imageUrlMap?: Map<string, string>
): ExportedTierRow {
  return {
    id: row.id,
    level: row.level,
    color: row.color,
    items: row.items.map((item) =>
      serializeItem(item, imageUrlMap?.get(item.id))
    ),
    name: row.name,
    description: row.description,
  };
}

/**
 * Serialize dates from a tier list to ISO strings
 */
function serializeDates(tierList: TierList): {
  createdAt: string;
  updatedAt: string;
} {
  return {
    createdAt:
      tierList.createdAt instanceof Date
        ? tierList.createdAt.toISOString()
        : String(tierList.createdAt),
    updatedAt:
      tierList.updatedAt instanceof Date
        ? tierList.updatedAt.toISOString()
        : String(tierList.updatedAt),
  };
}

/**
 * Create export data from a tier list
 * @param imageUrlMap Optional map of item IDs to cloud URLs (for shareable exports)
 */
export function createTierListExport(
  tierList: TierList,
  imageUrlMap?: Map<string, string>
): TierListExport {
  const dates = serializeDates(tierList);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tierList: {
      title: tierList.title,
      description: tierList.description,
      rows: tierList.rows.map((row) => serializeRow(row, imageUrlMap)),
      unassignedItems: tierList.unassignedItems.map((item) =>
        serializeItem(item, imageUrlMap?.get(item.id))
      ),
      createdAt: dates.createdAt,
      updatedAt: dates.updatedAt,
      tags: tierList.tags,
    },
  };
}

/**
 * Sanitize a string for use as a filename
 */
function sanitizeFilename(title: string): string {
  return title
    .replace(/[^a-z0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 50);
}

/**
 * Download JSON data as a file
 */
function downloadJsonFile(
  data: TierListExport,
  filename: string
): { success: boolean; fileSizeBytes: number } {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    success: true,
    fileSizeBytes: blob.size,
  };
}

/**
 * Download a tier list as JSON (full backup with embedded images)
 */
export function downloadTierListAsJSON(tierList: TierList): {
  success: boolean;
  fileSizeBytes: number;
} {
  const exportData = createTierListExport(tierList);
  const filename = sanitizeFilename(tierList.title) || "tier-list";
  return downloadJsonFile(exportData, `${filename}.tierlist.json`);
}

/**
 * Download a shareable tier list as JSON (with URLs instead of base64)
 */
export function downloadShareableTierListAsJSON(
  tierList: TierList,
  imageUrlMap: Map<string, string>
): {
  success: boolean;
  fileSizeBytes: number;
} {
  const exportData = createTierListExport(tierList, imageUrlMap);
  const filename = sanitizeFilename(tierList.title) || "tier-list";
  return downloadJsonFile(exportData, `${filename}-shareable.tierlist.json`);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get all items with base64 images from a tier list
 */
export function getItemsWithBase64Images(
  tierList: TierList
): Array<{ id: string; base64: string; name: string }> {
  const items: Array<{ id: string; base64: string; name: string }> = [];

  const processItem = (item: TierItem) => {
    if (isBase64Image(item.imageUrl)) {
      items.push({
        id: item.id,
        base64: item.imageUrl!,
        name: item.name,
      });
    }
  };

  tierList.rows.forEach((row) => row.items.forEach(processItem));
  tierList.unassignedItems.forEach(processItem);

  return items;
}
