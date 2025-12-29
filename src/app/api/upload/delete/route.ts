import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export interface DeleteResult {
  success: boolean;
  deletedCount: number;
  errors: string[];
}

/**
 * Delete images from imgbb using their delete URLs
 * POST /api/upload/delete
 * Body: { deleteUrls: string[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deleteUrls } = body as { deleteUrls: string[] };

    if (!Array.isArray(deleteUrls) || deleteUrls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          deletedCount: 0,
          errors: ["No delete URLs provided"],
        },
        { status: 400 }
      );
    }

    // Filter valid imgbb delete URLs using proper URL parsing
    const validUrls = deleteUrls.filter((urlStr) => {
      if (!urlStr || typeof urlStr !== "string") return false;
      try {
        const url = new URL(urlStr);
        return (
          url.hostname.endsWith("ibb.co") || url.hostname.endsWith("imgbb.com")
        );
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { success: true, deletedCount: 0, errors: [] },
        { status: 200 }
      );
    }

    const errors: string[] = [];
    let deletedCount = 0;

    // Delete images with rate limiting (500ms between requests)
    for (let i = 0; i < validUrls.length; i++) {
      const deleteUrl = validUrls[i];

      try {
        // imgbb delete URLs are visited via GET request
        const response = await fetch(deleteUrl, {
          method: "GET",
          redirect: "follow",
        });

        if (response.ok || response.status === 404) {
          // 404 means already deleted, which is fine
          deletedCount++;
        } else {
          errors.push(
            `Failed to delete: ${deleteUrl} (status: ${response.status})`
          );
        }
      } catch (error) {
        errors.push(
          `Error deleting ${deleteUrl}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }

      // Rate limit: wait 500ms between deletions (except last one)
      if (i < validUrls.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      deletedCount,
      errors,
    });
  } catch (error) {
    logger.prod.error("Image deletion error", error as Error);
    return NextResponse.json(
      {
        success: false,
        deletedCount: 0,
        errors: [
          error instanceof Error ? error.message : "Internal server error",
        ],
      },
      { status: 500 }
    );
  }
}
