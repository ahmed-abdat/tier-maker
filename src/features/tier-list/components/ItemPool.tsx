"use client";

import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { type TierItem as TierItemType } from "../index";
import { TierItem } from "./TierItem";

interface ItemPoolProps {
  items: TierItemType[];
  isOver?: boolean;
}

export const ItemPool = memo(function ItemPool({ items }: ItemPoolProps) {
  const { setNodeRef } = useDroppable({
    id: "unassigned-pool",
    data: {
      type: "pool",
      tierId: null,
    },
  });

  const itemIds = items.map((item) => item.id);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Package className="h-4 w-4" />
          Unassigned Items
        </h3>
        {items.length > 0 && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
            {items.length}
          </span>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "border-muted-foreground/20 bg-muted/20 min-h-20 rounded-xl border-2 border-dashed p-4",
          items.length === 0 && "flex items-center justify-center"
        )}
      >
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          {items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <TierItem key={item.id} item={item} containerId={null} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground/50 text-sm">
              Upload images below to get started
            </p>
          )}
        </SortableContext>
      </div>
    </div>
  );
});
