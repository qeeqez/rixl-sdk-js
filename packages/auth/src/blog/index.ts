import { authenticatedFetch } from "../api/fetchers";
import { apiCall } from "../api/utils";
import { getToken } from "../authStore";
import { HTTP_STATUS } from "../constants";

export interface BlogSubscriptionStatus {
  subscribed: boolean;
  subscribed_at?: string;
}

const BLOG_SUBSCRIPTION_ERRORS = {
  [HTTP_STATUS.UNAUTHORIZED]: () => new Error("User is not authorized to manage blog subscription"),
  [HTTP_STATUS.FORBIDDEN]: () => new Error("Account is inactive"),
  [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Too many requests - please try again later"),
};

export const getBlogSubscriptionStatus = async (): Promise<BlogSubscriptionStatus> => {
  return apiCall(async () => {
    return await authenticatedFetch<BlogSubscriptionStatus>("blog/subscription", getToken, {
      method: "GET",
    });
  }, BLOG_SUBSCRIPTION_ERRORS);
};

export const subscribeToBlog = async (): Promise<void> => {
  return apiCall(
    async () => {
      await authenticatedFetch<void>("blog/subscribe", getToken, { method: "POST" });
    },
    {
      ...BLOG_SUBSCRIPTION_ERRORS,
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: () => new Error("Failed to subscribe to blog updates"),
    },
  );
};

export const unsubscribeFromBlog = async (): Promise<void> => {
  return apiCall(
    async () => {
      await authenticatedFetch<void>("blog/unsubscribe", getToken, { method: "POST" });
    },
    {
      ...BLOG_SUBSCRIPTION_ERRORS,
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: () =>
        new Error("Failed to unsubscribe from blog updates"),
    },
  );
};
