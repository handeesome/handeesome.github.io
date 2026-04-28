// services/users.service.js
// ─────────────────────────────────────────────────────────────────────────────
// All Firestore operations for listing / looking up users in the "userdata"
// collection.  Module-level TTL cache prevents repeated full collection scans.
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "../lib/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { countBooksByUser } from "./books.service";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Module-level cache — shared across all callers within the same session.
let _cache = null;
let _cacheAt = 0;

// ---------------------------------------------------------------------------
// User listing
// ---------------------------------------------------------------------------

/**
 * Fetch all documents from the "userdata" collection.
 * Results are cached for CACHE_TTL_MS to avoid repeated full scans.
 * This is the only function in the codebase allowed to do a collection scan
 * without a where() clause.
 *
 * @param {boolean} forceRefresh - bypass cache
 * @returns {Promise<Array>}
 */
export async function getAllUsers(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && _cache && now - _cacheAt < CACHE_TTL_MS) {
    return _cache;
  }

  const snap = await getDocs(collection(db, "userdata"));
  _cache = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  _cacheAt = now;
  return _cache;
}

/**
 * Invalidate the in-memory user cache.
 * Call this after adding or removing a user document.
 */
export function clearUsersCache() {
  _cache = null;
  _cacheAt = 0;
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

/**
 * Resolve a URL user name to the full email.
 * Prefers the user-set profile name, with the old email-prefix route kept as a
 * fallback for existing links.
 * Uses the cached user list — no extra Firestore read if cache is warm.
 *
 * @param {string} displayName
 * @returns {Promise<string|null>}
 */
export async function getEmailFromDisplayName(displayName) {
  if (!displayName) return null;
  const normalizedDisplayName = displayName.trim().toLowerCase();
  const users = await getAllUsers();
  return (
    users.find(
      (u) => (u.userName ?? "").trim().toLowerCase() === normalizedDisplayName
    )?.id ??
    users.find(
      (u) => u.id.split("@")[0].toLowerCase() === normalizedDisplayName
    )?.id ?? null
  );
}

/**
 * Count books for a user (delegates to books.service to avoid duplication).
 *
 * @param {string} userEmail
 * @returns {Promise<number>}
 */
export async function getBookCountForUser(userEmail) {
  return countBooksByUser(userEmail);
}
