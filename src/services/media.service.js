import { db } from "../lib/firebase-config";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  query,
  where,
} from "firebase/firestore";

const mediaDoc = (mediaId) => doc(db, "media", mediaId);
const BATCH_LIMIT = 499;

export async function getMediaByUser(userEmail) {
  const q = query(collection(db, "media"), where("userEmail", "==", userEmail));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addMedia(userEmail, userId, mediaData) {
  const payload = {
    ...mediaData,
    userId,
    userEmail,
    dateAdded: mediaData.dateAdded || new Date().toISOString().split("T")[0],
    createdAt: new Date(),
  };
  const ref = await addDoc(collection(db, "media"), payload);
  return { id: ref.id, ...payload };
}

export async function updateMedia(mediaId, updates) {
  await updateDoc(mediaDoc(mediaId), updates);
}

export async function deleteMedia(mediaId) {
  await deleteDoc(mediaDoc(mediaId));
}

export async function removeTagFromMedia(mediaItems, tagName) {
  const affected = mediaItems.filter((item) => item.tags?.includes(tagName));
  if (affected.length === 0) return;

  for (let i = 0; i < affected.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    affected.slice(i, i + BATCH_LIMIT).forEach((item) => {
      batch.update(mediaDoc(item.id), {
        tags: item.tags.filter((tag) => tag !== tagName),
      });
    });
    await batch.commit();
  }
}

export async function renameShelfOnMedia(mediaItems, oldName, newName) {
  const affected = mediaItems.filter((item) => item.shelves?.includes(oldName));
  if (affected.length === 0) return;

  for (let i = 0; i < affected.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    affected.slice(i, i + BATCH_LIMIT).forEach((item) => {
      batch.update(mediaDoc(item.id), {
        shelves: item.shelves.map((shelf) =>
          shelf === oldName ? newName : shelf
        ),
      });
    });
    await batch.commit();
  }
}

export async function removeShelfFromMedia(mediaItems, shelfName) {
  const affected = mediaItems.filter((item) =>
    item.shelves?.includes(shelfName)
  );
  if (affected.length === 0) return;

  for (let i = 0; i < affected.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    affected.slice(i, i + BATCH_LIMIT).forEach((item) => {
      batch.update(mediaDoc(item.id), {
        shelves: item.shelves.filter((shelf) => shelf !== shelfName),
      });
    });
    await batch.commit();
  }
}
