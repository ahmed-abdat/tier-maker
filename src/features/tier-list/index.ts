import { type TierLevel } from "./constants";

// Represents a single item that can be placed in a tier
export interface TierItem {
  id: string;
  name: string;
  imageUrl?: string;
  imageDeleteUrl?: string; // imgbb delete URL for cleanup
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Represents a row in the tier list
export interface TierRow {
  id: string;
  level: TierLevel;
  color: string;
  items: TierItem[];
  name?: string;
  description?: string;
}

// Represents the complete tier list with an unassigned pool
export interface TierList {
  id: string;
  title: string;
  description?: string;
  rows: TierRow[];
  unassignedItems: TierItem[]; // Items not yet placed in any tier
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// State for drag and drop operations
export interface DragState {
  isDragging: boolean;
  draggedItemId?: string;
  sourceRowId?: string; // null means from unassigned pool
  targetRowId?: string; // null means to unassigned pool
}

// Re-export store
export { useTierStore } from "./store";

// Re-export constants
export { TIER_LEVELS, TIER_COLORS, type TierLevel } from "./constants";
