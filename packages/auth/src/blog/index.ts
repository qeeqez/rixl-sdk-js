import {
  getAuthV1BlogSubscription,
  postAuthV1BlogSubscribe,
  postAuthV1BlogUnsubscribe,
} from "@rixl/sdk";
import { apiCall } from "../api/utils";
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
    const { data } = await getAuthV1BlogSubscription({
      throwOnError: true,
    });
    return data as unknown as BlogSubscriptionStatus;
  }, BLOG_SUBSCRIPTION_ERRORS);
};

export const subscribeToBlog = async (): Promise<void> => {
  return apiCall(
    async () => {
      await postAuthV1BlogSubscribe({
        throwOnError: true,
      });
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
      await postAuthV1BlogUnsubscribe({
        throwOnError: true,
      });
    },
    {
      ...BLOG_SUBSCRIPTION_ERRORS,
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: () =>
        new Error("Failed to unsubscribe from blog updates"),
    },
  );
};
