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

function serializeItem(item: TierItem): ExportedTierItem {
  return {
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
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

function serializeRow(row: TierRow): ExportedTierRow {
  return {
    id: row.id,
    level: row.level,
    color: row.color,
    items: row.items.map(serializeItem),
    name: row.name,
    description: row.description,
  };
}

export function createTierListExport(tierList: TierList): TierListExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tierList: {
      title: tierList.title,
      description: tierList.description,
      rows: tierList.rows.map(serializeRow),
      unassignedItems: tierList.unassignedItems.map(serializeItem),
      createdAt:
        tierList.createdAt instanceof Date
          ? tierList.createdAt.toISOString()
          : String(tierList.createdAt),
      updatedAt:
        tierList.updatedAt instanceof Date
          ? tierList.updatedAt.toISOString()
          : String(tierList.updatedAt),
      tags: tierList.tags,
    },
  };
}

export function downloadTierListAsJSON(tierList: TierList): {
  success: boolean;
  fileSizeBytes: number;
} {
  const exportData = createTierListExport(tierList);
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  // Sanitize filename
  const filename = tierList.title
    .replace(/[^a-z0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 50);

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename || "tier-list"}.tierlist.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    success: true,
    fileSizeBytes: blob.size,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
