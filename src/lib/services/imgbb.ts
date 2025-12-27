export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface BatchUploadProgress {
  current: number;
  total: number;
  completed: UploadResult[];
}

interface UploadApiResponse {
  success: boolean;
  url?: string;
  error?: { message: string };
}

/**
 * Upload a single image to ImgBB via our API route
 */
export async function uploadImage(
  base64Image: string,
  name?: string,
  signal?: AbortSignal
): Promise<UploadResult> {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image, name }),
      signal,
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

/**
 * Upload multiple images with rate limiting and progress callback
 * Delays 500ms between uploads to avoid rate limiting
 */
export async function uploadImages(
  images: Array<{ id: string; base64: string; name?: string }>,
  onProgress?: (progress: BatchUploadProgress) => void,
  signal?: AbortSignal
): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();
  const completed: UploadResult[] = [];
  const delayMs = 500;

  for (let i = 0; i < images.length; i++) {
    if (signal?.aborted) break;

    const { id, base64, name } = images[i];

    const result = await uploadImage(base64, name, signal);
    completed.push(result);

    if (result.success && result.url) {
      urlMap.set(id, result.url);
    }

    onProgress?.({
      current: i + 1,
      total: images.length,
      completed,
    });

    // Delay between uploads (except for last one)
    if (i < images.length - 1 && !signal?.aborted) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return urlMap;
}
