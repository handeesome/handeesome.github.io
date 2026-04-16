// utils/userUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure string/display-name helpers only.
// All Firestore calls have been moved to src/services/users.service.js.
//
// Re-exports the service functions under their original names so any file
// that imported from here continues to work without changes.
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Re-exports from the service layer (backwards-compatible)
// ---------------------------------------------------------------------------
export {
  getAllUsers   as getUserList,
  getEmailFromDisplayName,
  getBookCountForUser,
  clearUsersCache as clearUserEmailCache,
  getAllUsers    as refreshUserEmailCache,
} from "../services/users.service";

// ---------------------------------------------------------------------------
// Pure helpers — no Firestore dependency
// ---------------------------------------------------------------------------

/**
 * Get the display name portion of an email (everything before @).
 * @param {string} email
 * @returns {string}
 */
export const getDisplayNameFromEmail = (email) => {
  if (!email) return "";
  return email.split("@")[0];
};

/**
 * Check whether a given email exists in the full user list.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export const doesEmailExist = async (email) => {
  if (!email) return false;
  const { getAllUsers } = await import("../services/users.service");
  const users = await getAllUsers();
  return users.some((u) => u.id === email);
};

/**
 * Get every user's display name (the part before @).
 * @returns {Promise<string[]>}
 */
export const getAllDisplayNames = async () => {
  const { getAllUsers } = await import("../services/users.service");
  const users = await getAllUsers();
  return users.map((u) => getDisplayNameFromEmail(u.id));
};

// ---------------------------------------------------------------------------
// Kept for any direct import of getProfileDataForUser that may exist in pages
// ---------------------------------------------------------------------------
export { getProfile as getProfileDataForUser } from "../services/profile.service";
