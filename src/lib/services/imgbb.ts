export interface UploadResult {
  success: boolean;
  url?: string;
  deleteUrl?: string;
  error?: string;
}

export interface BatchUploadProgress {
  current: number;
  total: number;
  completed: UploadResult[];
}

export interface UploadOptions {
  customApiKey?: string;
  signal?: AbortSignal;
}

interface UploadApiResponse {
  success: boolean;
  url?: string;
  deleteUrl?: string;
  error?: { message: string };
}

/**
 * Upload a single image to ImgBB via our API route
 */
export async function uploadImage(
  base64Image: string,
  name?: string,
  options?: UploadOptions
): Promise<UploadResult> {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64Image,
        name,
        customApiKey: options?.customApiKey,
      }),
      signal: options?.signal,
    });

    const result = (await response.json()) as UploadApiResponse;

    if (!result.success) {
      return {
        success: false,
        error: result.error?.message ?? "Upload failed",
      };
    }

    return {
      success: true,
      url: result.url,
      deleteUrl: result.deleteUrl,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, error: "Cancelled" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export interface UploadedImage {
  url: string;
  deleteUrl?: string;
}

/**
 * Upload multiple images with rate limiting and progress callback
 * Delays 500ms between uploads to avoid rate limiting
 * Returns Map of itemId -> { url, deleteUrl }
 */
export async function uploadImages(
  images: Array<{ id: string; base64: string; name?: string }>,
  onProgress?: (current: number, total: number) => void,
  options?: UploadOptions
): Promise<Map<string, UploadedImage>> {
  const resultMap = new Map<string, UploadedImage>();
  const delayMs = 500;

  for (let i = 0; i < images.length; i++) {
    if (options?.signal?.aborted) break;

    const { id, base64, name } = images[i];

    const result = await uploadImage(base64, name, options);

    if (result.success && result.url) {
      resultMap.set(id, { url: result.url, deleteUrl: result.deleteUrl });
    } else if (!result.success && result.error !== "Cancelled") {
      throw new Error(result.error ?? "Upload failed");
    }

    onProgress?.(i + 1, images.length);

    // Delay between uploads (except for last one)
    if (i < images.length - 1 && !options?.signal?.aborted) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return resultMap;
}

/**
 * Delete images from imgbb using their delete URLs
 */
export async function deleteImages(
  deleteUrls: string[]
): Promise<{ success: boolean; deletedCount: number; errors: string[] }> {
  try {
    const response = await fetch("/api/upload/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleteUrls }),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      deletedCount: 0,
      errors: [error instanceof Error ? error.message : "Network error"],
    };
  }
}
