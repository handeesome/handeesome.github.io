// utils/userUtils.js
import { db as firestore } from "../lib/firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

// Cache to avoid repeated Firestore calls
let cachedEmails = null;
let cacheTimestamp = null;

/**
 * Get all user emails from Firestore userdata collection
 * Uses caching to avoid repeated database calls
 * @returns {Promise<string[]>} Array of user emails
 */
export const getUserList = async () => {
  try {
    // Get all documents from userData collection
    const userDataSnapshot = await getDocs(collection(firestore, "userdata"));
    const users = [];

    userDataSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Update cache
    cachedEmails = users;
    cacheTimestamp = Date.now();

    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};

/**
 * Convert a display name (part before @) back to the full email
 * @param {string} displayName - The display name (e.g., "johnsmith")
 * @returns {Promise<string|null>} The full email or null if not found
 */
export const getEmailFromDisplayName = async (displayName) => {
  if (!displayName) return null;

  try {
    const users = await getUserList();
    const emails = users.map((user) => user.id);

    // Find email where the part before @ matches the displayName
    const foundEmail = emails.find((email) => {
      const emailDisplayName = email.split("@")[0];
      return emailDisplayName.toLowerCase() === displayName.toLowerCase();
    });

    if (foundEmail) {
    } else {
      console.warn(`No email found for display name "${displayName}"`);
    }

    return foundEmail || null;
  } catch (error) {
    console.error(
      `Error finding email for display name "${displayName}":`,
      error
    );
    return null;
  }
};

/**
 * Get display name from email (part before @)
 * @param {string} email - The full email address
 * @returns {string} The display name
 */
export const getDisplayNameFromEmail = (email) => {
  if (!email) return "";
  return email.split("@")[0];
};

/**
 * Check if an email exists in the system
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} True if email exists
 */
export const doesEmailExist = async (email) => {
  if (!email) return false;

  try {
    const users = await getUserList();
    const emails = users.map((user) => user.id);
    return emails.includes(email);
  } catch (error) {
    console.error(`Error checking if email exists "${email}":`, error);
    return false;
  }
};

/**
 * Get all display names (useful for dropdowns, etc.)
 * @returns {Promise<string[]>} Array of display names
 */
export const getAllDisplayNames = async () => {
  try {
    const users = await getUserList();
    const emails = users.map((user) => user.id);
    return emails.map((email) => getDisplayNameFromEmail(email));
  } catch (error) {
    console.error("Error getting display names:", error);
    return [];
  }
};

/**
 * Clear the email cache - useful when you know users have been added/removed
 */
export const clearUserEmailCache = () => {
  cachedEmails = null;
  cacheTimestamp = null;
};

/**
 * Force refresh the email cache
 * @returns {Promise<string[]>} Fresh list of emails
 */
export const refreshUserEmailCache = async () => {
  clearUserEmailCache();
  return await getUserList();
};

export const getBookCountForUser = async (email) => {
  const q = query(
    collection(firestore, "books"),
    where("userEmail", "==", email)
  );
  const snapshot = await getDocs(q);
  return snapshot.size; // number of matching documents
};

export const getProfileDataForUser = async (email) => {
  if (!email) return null;

  try {
    const userRef = doc(firestore, "userdata", email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return data;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error(`Error fetching profile data for "${email}":`, error);
    return null;
  }
};
