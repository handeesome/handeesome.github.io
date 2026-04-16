// services/books.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all Firestore operations on the "books" collection.
// No React state, no hooks. Accepts and returns plain JS objects.
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "../lib/firebase-config";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getCountFromServer,
  writeBatch,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// ---------------------------------------------------------------------------
// NOTE: The flat "books" collection is kept intact so the migration is
// non-breaking.  The only queries that touch it are centralised here, so
// switching to a subcollection path later only requires changing the two
// helpers below — nothing else in the app.
// ---------------------------------------------------------------------------

/** @param {string} userEmail */
const booksCol = (userEmail) =>
  query(
    collection(db, "books"),
    where("userEmail", "==", userEmail)
  );

/** @param {string} bookId */
const bookDoc = (bookId) => doc(db, "books", bookId);

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/**
 * Fetch all books for a user, sorted newest-first.
 * Uses an indexed where("userEmail") query — no full collection scan.
 * Required Firestore index: books [ userEmail ASC, createdAt DESC ]
 *
 * @param {string} userEmail
 * @returns {Promise<Array>}
 */
export async function getBooksByUser(userEmail) {
  const q = query(
    collection(db, "books"),
    where("userEmail", "==", userEmail),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Count books for a user without downloading document payloads.
 * Replaces the old getDocs(q).size pattern.
 *
 * @param {string} userEmail
 * @returns {Promise<number>}
 */
export async function countBooksByUser(userEmail) {
  const snap = await getCountFromServer(booksCol(userEmail));
  return snap.data().count;
}

// ---------------------------------------------------------------------------
// Write — single document
// ---------------------------------------------------------------------------

/**
 * Add a new book document and return the created object with its Firestore id.
 *
 * @param {string} userEmail
 * @param {string} userId
 * @param {object} bookData
 * @returns {Promise<object>}
 */
export async function addBook(userEmail, userId, bookData) {
  const payload = {
    ...bookData,
    userId,
    userEmail,
    dateAdded: new Date().toISOString().split("T")[0],
    createdAt: new Date(),
  };
  const ref = await addDoc(collection(db, "books"), payload);
  return { id: ref.id, ...payload };
}

/**
 * Overwrite specific fields on a book document.
 *
 * @param {string} bookId
 * @param {object} updates
 */
export async function updateBook(bookId, updates) {
  await updateDoc(bookDoc(bookId), updates);
}

/**
 * Delete a single book document.
 *
 * @param {string} bookId
 */
export async function deleteBook(bookId) {
  await deleteDoc(bookDoc(bookId));
}

// ---------------------------------------------------------------------------
// Write — bulk / batch operations
// ---------------------------------------------------------------------------

const BATCH_LIMIT = 499; // Firestore max is 500 ops per batch

/**
 * Remove a tag name from every book in the provided list that contains it.
 * Uses writeBatch for atomicity. Handles > 499 books via chunking.
 *
 * @param {Array}  books    - Current in-memory book list (already fetched)
 * @param {string} tagName
 */
export async function removeTagFromBooks(books, tagName) {
  const affected = books.filter((b) => b.tags?.includes(tagName));
  if (affected.length === 0) return;

  for (let i = 0; i < affected.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    affected.slice(i, i + BATCH_LIMIT).forEach((book) => {
      batch.update(bookDoc(book.id), {
        tags: book.tags.filter((t) => t !== tagName),
      });
    });
    await batch.commit();
  }
}

/**
 * Rename a shelf on every book in the provided list that references it.
 * Atomic per chunk.
 *
 * @param {Array}  books
 * @param {string} oldName
 * @param {string} newName
 */
export async function renameShelfOnBooks(books, oldName, newName) {
  const affected = books.filter((b) => b.shelves?.includes(oldName));
  if (affected.length === 0) return;

  for (let i = 0; i < affected.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    affected.slice(i, i + BATCH_LIMIT).forEach((book) => {
      batch.update(bookDoc(book.id), {
        shelves: book.shelves.map((s) => (s === oldName ? newName : s)),
      });
    });
    await batch.commit();
  }
}

/**
 * Remove a shelf name from every book in the provided list that references it.
 * Atomic per chunk.
 *
 * @param {Array}  books
 * @param {string} shelfName
 */
export async function removeShelfFromBooks(books, shelfName) {
  const affected = books.filter((b) => b.shelves?.includes(shelfName));
  if (affected.length === 0) return;

  for (let i = 0; i < affected.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    affected.slice(i, i + BATCH_LIMIT).forEach((book) => {
      batch.update(bookDoc(book.id), {
        shelves: book.shelves.filter((s) => s !== shelfName),
      });
    });
    await batch.commit();
  }
}
