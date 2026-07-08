// Initialize urlParams lazily to avoid accessing window during module import
// This is important for test environments and SSR
export const urlParams: URLSearchParams = new URLSearchParams(typeof window !== "undefined" ? fromURL(window.location.href) : "");

function fromURL(urlString: string): string {
  return (
    urlString
      // Replace everything before this first hashtag or question sign.
      .replace(/^[^?#]*[?#]/, "")
      // Replace all hashtags and question signs to make it look like some search params.
      .replace(/[?#]/g, "&")
  );
}
