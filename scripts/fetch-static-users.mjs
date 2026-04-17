// scripts/fetch-static-users.mjs
// Run from the vite-app/ directory:
//   node scripts/fetch-static-users.mjs
//
// Fetches all user profiles from Firestore and writes them to
// src/data/static-users.json so the BookShelf page can render avatars
// instantly without waiting for a network round-trip.

import { collection, getDocs } from "firebase/firestore";
import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import db directly — firebase-config.js is plain JS, Node can load it fine.
const { db } = await import("../src/lib/firebase-config.js");

const fetchPromise = getDocs(collection(db, "userdata"));
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Firestore did not respond within 15 seconds — check your internet connection.")), 15000)
);

const snap  = await Promise.race([fetchPromise, timeout]);
const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

if (users.length === 0) {
  console.error("No users returned — Firestore may be unreachable or the collection is empty.");
  console.error("Check your connection: curl -I https://firestore.googleapis.com");
  process.exit(1);
}

const outPath = join(__dirname, "../src/data/static-users.json");
await writeFile(outPath, JSON.stringify(users, null, 2), "utf-8");

console.log(`Wrote ${users.length} user(s) to src/data/static-users.json`);
process.exit(0);
