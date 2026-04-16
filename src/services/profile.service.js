// services/profile.service.js
// ─────────────────────────────────────────────────────────────────────────────
// All Firestore operations on the "userdata" collection (profile + tagColors).
// No React state, no hooks. Returns plain JS objects.
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "../lib/firebase-config";
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";

const DEFAULT_PROFILE = {
  userName: "",
  shelfName: "",
  shelfDescription: "",
  avatarBase64: "",
  isPublic: true,
  tagColors: {},
};

/** @param {string} email - used as the document ID */
const userDataDoc = (email) => doc(db, "userdata", email);

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/**
 * Fetch the userdata document for an email.
 * Uses a direct doc reference (O(1)) — not a collection scan.
 *
 * @param {string} email
 * @returns {Promise<object>} - always returns a full profile shape, never null
 */
export async function getProfile(email) {
  const snap = await getDoc(userDataDoc(email));
  if (!snap.exists()) return { ...DEFAULT_PROFILE };

  const d = snap.data();
  return {
    userName:         d.userName         ?? "",
    shelfName:        d.shelfName        ?? "",
    shelfDescription: d.shelfDescription ?? "",
    avatarBase64:     d.avatarBase64     ?? "",
    isPublic:         d.isPublic         ?? true,
    tagColors:        d.tagColors        ?? {},
  };
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/**
 * Merge any subset of profile fields into the userdata document.
 * Always stamps userEmail + updatedAt so the document stays consistent.
 *
 * @param {string} email
 * @param {object} updates  - partial profile fields
 */
export async function updateProfile(email, updates) {
  await setDoc(
    userDataDoc(email),
    { ...updates, userEmail: email, updatedAt: new Date() },
    { merge: true }
  );
}

// ---------------------------------------------------------------------------
// Tag colour helpers
// ---------------------------------------------------------------------------

/**
 * Add or update a single tag colour entry.
 *
 * @param {string} email
 * @param {string} tagName
 * @param {string} color   - hex string
 */
export async function upsertTagColor(email, tagName, color) {
  await setDoc(
    userDataDoc(email),
    { tagColors: { [tagName]: color }, userEmail: email },
    { merge: true }
  );
}

/**
 * Remove a tag colour key from the userdata document.
 *
 * @param {string} email
 * @param {string} tagName
 */
export async function removeTagColor(email, tagName) {
  await updateDoc(userDataDoc(email), {
    [`tagColors.${tagName}`]: deleteField(),
  });
}
