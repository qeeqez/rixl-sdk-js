import { updateEntityField } from "./utils/nameUpdates";

/**
 * Updates an organization's name
 * @param fullName The new full name (1-30 characters)
 * @param orgId The ID of the organization to update
 * @returns A promise that resolves when the name is updated
 * @throws Error if the name is invalid, user is not an admin, or name was changed recently
 */
export const updateOrgName = async (fullName: string, orgId: string): Promise<void> => {
  return updateEntityField({
    value: fullName,
    type: "name",
    endpoint: `memberships/${orgId}/name`,
    method: "PUT",
  });
};

/**
 * Updates an organization's username
 * @param username The new username (4-24 characters, only letters, numbers, underscores, and periods)
 * @param orgId The ID of the organization to update
 * @returns A promise that resolves when the username is updated
 * @throws Error if the username is invalid, not unique, user is not an admin, or username was changed recently
 */
export const updateOrgUsername = async (username: string, orgId: string): Promise<void> => {
  return updateEntityField({
    value: username,
    type: "username",
    endpoint: `memberships/${orgId}/username`,
    method: "PUT",
  });
};
