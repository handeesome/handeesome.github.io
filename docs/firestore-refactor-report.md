# Firestore Refactor Report

## 1. Overview

### Goal
Eliminate scattered, inconsistent Firestore access spread across React components, hooks, and utility files. Replace it with a clean three-layer architecture: **services → hooks → UI**.

### Scope
- **3 new service files** created (`books.service.js`, `profile.service.js`, `users.service.js`)
- **2 new/rewritten hook files** (`useBookshelf.js`, `useUsers.js`)
- **4 files updated** (`BookShelf.jsx`, `FirebaseBookShelf.jsx`, `UserSelection.jsx`, `UserToggleModal.jsx`)
- **1 utility file** stripped of Firestore logic and converted to re-exports (`userUtils.js`)
- Zero breaking changes to the UI component API

---

## 2. Before (Problems)

### Scattered Firestore Access
Firestore imports (`getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `setDoc`, `writeBatch`, `collection`, `doc`, `query`, `where`, `orderBy`) appeared in at minimum:
- `hooks/useBookShelf.js` (the largest offender — ~782 lines of mixed state and Firestore logic)
- `utils/userUtils.js` (utility file doubling as a data-access layer)
- Page-level components calling `getProfileDataForUser()` directly

### Inefficient Query Patterns

**Full collection scan on every user list load:**
```js
// userUtils.js — old pattern
getDocs(collection(db, "userdata"))  // No WHERE clause — downloads all user records
```
This ran on every page that needed the user list, with no caching. If 100 users existed, all 100 profiles were downloaded just to show avatars.

**Bandwidth-wasting book counts:**
```js
// old pattern — downloads every book document to count them
const snap = await getDocs(q);
return snap.size;
```
Every avatar hover in `UserSelection` triggered a full books collection fetch for that user, just to display a number.

**Duplicate profile fetch in `BookShelf.jsx`:**
```js
// BookShelf.jsx — useEffect called BOTH:
const foundEmail    = await getEmailFromDisplayName(userName);
const profileData   = await getProfileDataForUser(foundEmail);  // fetch #1 (direct)
// ...
useBookshelf(null, userEmail);  // fetch #2 — hook internally called getProfile() again
```
The same `userdata/{email}` document was read twice on every route load.

**Sequential N+1 writes in tag/shelf deletion:**
```js
// Old pattern — one updateDoc per book, awaited in a loop
for (const book of affected) {
  await updateDoc(doc(db, "books", book.id), { tags: ... });  // N round trips
}
```
Deleting a tag from 50 books triggered 50 sequential Firestore write operations.

**No caching on the user list:**
`getUserList()` in `userUtils.js` called `getDocs(collection(db, "userdata"))` with no memoization — every component mount that needed users re-fetched the entire collection.

**`UserToggleModal.jsx` fetching users independently:**
The admin "Switch User" modal ran its own `useEffect → getUserList()` fetch, even though `UserSelection.jsx` had already loaded the same data moments before.

### Data Flow Issues
- `useBookShelf.js` contained ~782 lines combining React state, Firestore queries, business logic, and UI helpers — no clear boundaries
- `userUtils.js` mixed pure string helpers (`getDisplayNameFromEmail`) with async Firestore calls (`getUserList`, `getBookCountForUser`)
- Components imported directly from `userUtils.js` creating tight coupling between UI and the database layer

---

## 3. After (New Architecture)

```
src/
├── services/              ← ALL Firestore I/O lives here
│   ├── books.service.js   ← books collection CRUD + batch ops
│   ├── profile.service.js ← userdata/{email} document ops
│   └── users.service.js   ← user listing with TTL cache
│
├── hooks/                 ← React state wrappers over services
│   ├── useBookShelf.js    ← all bookshelf state (rewritten, same API)
│   └── useUsers.js        ← user list state (new)
│
├── utils/
│   └── userUtils.js       ← pure helpers + backwards-compatible re-exports only
│
└── pages / components     ← consume hooks only, zero Firestore imports
```

### Services Layer
Each service file imports from `firebase-config.js` and exports plain async functions. No React, no `useState`, no `useEffect`.

- **`books.service.js`** — `getBooksByUser`, `addBook`, `updateBook`, `deleteBook`, `countBooksByUser`, `removeTagFromBooks`, `renameShelfOnBooks`, `removeShelfFromBooks`
- **`profile.service.js`** — `getProfile`, `updateProfile`, `upsertTagColor`, `removeTagColor`
- **`users.service.js`** — `getAllUsers` (with TTL cache), `getBookCountForUser`, `getEmailFromDisplayName`, `clearUsersCache`

### Hooks Layer
Hooks consume services and own React state. Components never call service functions directly.

- **`useBookshelf(user, currentViewingUserEmail)`** — manages books, profileData, editingBook, allShelves, tagColors. Exposes stable callbacks via `useCallback`.
- **`useUsers()`** — loads and caches the user list; exposes `users`, `loading`, `getBookCount`.

### Backwards Compatibility
`userUtils.js` re-exports the service functions under their original names:
```js
export { getAllUsers as getUserList, getEmailFromDisplayName, ... } from "../services/users.service";
```
This means any file that was not explicitly updated continues to work without modification.

---

## 4. Key Improvements

### Query Optimization
| Old | New |
|-----|-----|
| `getDocs(collection(db, "userdata"))` — full scan | Retained (necessary for user list), but now cached with TTL |
| `getDocs(query).size` to count books | `getCountFromServer(query)` — zero document payload, metadata only |
| Two separate `getDoc` calls for books + profile | `Promise.all([getBooksByUser(email), getProfile(email)])` — parallel |
| Sequential `await updateDoc()` per book in loops | `writeBatch` with 499-op chunk limit — single round trip per 499 books |

### Reduced Duplicate Reads
- `BookShelf.jsx` previously fetched `getProfileDataForUser` in its own `useEffect` then `useBookshelf` fetched the same document internally. The page-level fetch was removed; `profileData` now comes exclusively from the hook.
- `UserToggleModal.jsx` previously ran its own `useEffect → getUserList()` fetch on modal open. It now consumes `useUsers()`, which shares the same in-memory cached result already populated by `UserSelection.jsx`.

### Caching Strategy
```js
// users.service.js — module-level TTL cache
let _cache   = null;
let _cacheAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;  // 5 minutes

export async function getAllUsers(forceRefresh = false) {
  if (!forceRefresh && _cache && Date.now() - _cacheAt < CACHE_TTL_MS)
    return _cache;
  // ... fetch and populate _cache
}
```
Multiple components calling `useUsers()` within the same 5-minute window share a single Firestore read.

### Batch Writes
Tag deletion, shelf deletion, and shelf renaming now use `writeBatch` with automatic chunking:
```js
for (let i = 0; i < affected.length; i += 499) {
  const batch = writeBatch(db);
  affected.slice(i, i + 499).forEach((book) => {
    batch.update(bookDoc(book.id), { ... });
  });
  await batch.commit();  // one network round trip per 499 books
}
```

### Cleaner State Management
- `allShelves` changed from a manually maintained `useState` array (requiring a setter) to a `useMemo` derived value: `[...new Set(books.flatMap(b => b.shelves ?? []))]` — always in sync, never stale.
- `setAllShelves` is exposed as a no-op for backwards compatibility with any component that calls it.
- `tagColors` is derived directly from `profileData.tagColors` — no separate state to keep synchronized.

---

## 5. File-by-File Changes

### `src/services/books.service.js` *(new)*
- All `books` collection Firestore logic centralized here
- `getBooksByUser` uses `where("userEmail", "==", email)` + `orderBy("createdAt", "desc")` — indexed, not a collection scan
- `countBooksByUser` uses `getCountFromServer` — no document payload
- `removeTagFromBooks`, `renameShelfOnBooks`, `removeShelfFromBooks` use `writeBatch` with 499-op chunking

### `src/services/profile.service.js` *(new)*
- All `userdata/{email}` document operations centralized here
- `getProfile` uses a direct `getDoc(doc(db, "userdata", email))` — O(1) lookup, not a scan
- `updateProfile` uses `setDoc(..., { merge: true })` — safe partial update
- `removeTagColor` uses `deleteField()` to remove a single map key without overwriting the rest

### `src/services/users.service.js` *(new)*
- Houses the only full `userdata` collection scan in the entire app
- TTL cache prevents repeat scans within 5-minute windows
- `getBookCountForUser` delegates to `countBooksByUser` in `books.service.js`
- `getEmailFromDisplayName` does a linear scan of the cached list (no extra Firestore read)

### `src/hooks/useBookShelf.js` *(rewritten)*
- Removed: all `firebase/firestore` imports (~15 imports), inline query construction, sequential write loops
- Added: imports from `books.service.js` and `profile.service.js` only
- `fetchBooks` now calls `Promise.all([getBooksByUser, getProfile])` — parallel instead of sequential
- `allShelves` converted from `useState` to `useMemo`
- `tagColors` extracted from `profileData` rather than stored separately
- `setAllShelves` kept as a no-op for backwards compatibility
- Public API surface is **identical** — no UI components required changes

### `src/hooks/useUsers.js` *(new)*
- Thin React wrapper: calls `getAllUsers()` on mount, exposes `users`, `loading`, `getBookCount`
- Cancellation flag prevents state updates after unmount
- Shares the module-level cache from `users.service.js` — multiple hook instances don't multiply reads

### `src/utils/userUtils.js` *(stripped)*
- Removed: all direct Firestore imports and logic
- Retained: `getDisplayNameFromEmail` (pure string helper), `doesEmailExist`, `getAllDisplayNames`
- Added: re-exports of service functions under original names for backwards compatibility (`getUserList`, `getEmailFromDisplayName`, `getBookCountForUser`, `clearUserEmailCache`, `getProfileDataForUser`)

### `src/pages/BookShelf/BookShelf.jsx` *(updated)*
- Removed: `getProfileDataForUser` import, local `user` state, second `getProfileDataForUser` call in `useEffect`
- Removed: the `loading` state variable (renamed to `resolving` to avoid shadowing the hook's `loading`)
- Added: `profileData` destructured from `useBookshelf` — `profileData.shelfName` replaces `user?.shelfName`
- `useEffect` now only resolves the email from the URL slug; all profile data comes from the hook
- Added: cancellation flag (`cancelled`) to the `useEffect` cleanup

### `src/pages/BookShelf/FirebaseBookShelf.jsx` *(updated)*
- Removed: separate `useEffect` + `fetchShelfName` + local `shelfName` state
- Removed: `getProfileDataForUser` import from `userUtils`
- `profileData.shelfName` from `useBookshelf` used directly in the title render

### `src/pages/BookShelf/UserSelection.jsx` *(updated)*
- Removed: manual `useEffect` + `getUserList()` call + `useLocation()` dependency
- Replaced: with `useUsers()` hook — `users` and `loading` come from the hook
- `getBookCount` sourced from the hook's return value (delegates to `getCountFromServer`)

### `src/components/bookShelf/UserToggleModal.jsx` *(updated)*
- Removed: `useEffect` that called `getUserList()` on modal open
- Removed: `authorizedUsers` and `fetchingUsers` local state
- Added: `useUsers()` hook — list is already cached from `UserSelection`'s earlier load
- `authorizedUsers` is now a `useMemo` derived from `rawUsers` — no async state needed

---

## 6. Before vs After Comparison

| Aspect | Before | After |
|--------|--------|-------|
| **Firestore access** | Scattered across hooks, utils, and page components | Centralized in 3 service files only |
| **User list fetch** | `getDocs(collection(db, "userdata"))` on every component mount, no caching | Single fetch, TTL-cached for 5 min, shared across all consumers |
| **Book count** | Full `getDocs` query to read every book doc, then use `.size` | `getCountFromServer` — metadata only, zero document payload |
| **Profile fetch** | Fetched independently in `BookShelf.jsx` useEffect AND inside `useBookshelf` (duplicate) | Single fetch inside `useBookshelf`, exposed as `profileData` |
| **UserToggleModal users** | Own `useEffect → getUserList()` triggered on every modal open | Reads from `useUsers()` cache — no extra Firestore call |
| **Batch writes** | Sequential `await updateDoc()` per book in a loop | `writeBatch` with 499-op chunking — one commit per batch |
| **`useBookShelf.js` size** | ~782 lines mixing Firestore, state, and business logic | ~480 lines, zero Firestore imports, clear separation |
| **`allShelves` state** | Manual `useState` requiring explicit setter synchronization | `useMemo` derived from books — always accurate, never stale |
| **`tagColors` state** | Stored in its own `useState` separately from profile | Extracted directly from `profileData.tagColors` |
| **Code structure** | No enforced layering; components could reach Firestore directly | Strict layers: services → hooks → UI, enforced by import structure |

---

## 7. Performance Impact (Estimated)

### Firestore Reads Reduced
| Scenario | Before | After | Reduction |
|----------|--------|-------|-----------|
| Load `UserSelection` page (5 users) | 1 full `userdata` scan + up to 5 book-count full scans | 1 `userdata` scan (cached) + 5 `getCountFromServer` calls | ~80% payload reduction on book counts |
| Open `UserToggleModal` (admin) | 1 additional full `userdata` scan | 0 — uses cached result from `UserSelection` | 100% |
| Load `BookShelf.jsx` (public shelf) | 2 profile reads (useEffect + hook) + 1 books query | 1 profile read + 1 books query (parallel) | 50% on profile, parallel execution |
| Delete a tag from 50 books | 50 sequential `updateDoc` round trips | 1 `writeBatch.commit()` | ~98% latency reduction |

### Network Request Reduction
- Book count for each user avatar: from downloading all book documents → single aggregate metadata call
- User list: from N fetches per session → 1 fetch per 5-minute window across all consumers

### Rendering Improvements
- `allShelves` no longer triggers unnecessary re-renders from manual `setAllShelves` synchronization — derived via `useMemo`
- `tagColors` reads from already-loaded `profileData` instead of a separate state variable — one fewer state update per profile load
- `BookShelf.jsx` eliminates a double-render cycle caused by two sequential async state updates (`setUserEmail` then implicit profile refetch)

---

## 8. Future Recommendations

### Firestore Indexes
Ensure the following composite index exists for the books query:
```
Collection: books
Fields:     userEmail ASC, createdAt DESC
```
Without it, `where("userEmail", "==", ...) + orderBy("createdAt", "desc")` will fail or fall back to a client-side sort.

### Cache Invalidation
The current TTL cache in `users.service.js` is module-scoped and survives route changes. Consider calling `clearUsersCache()` after profile updates (e.g., after `updateEntireProfile` in the hook) so the user list reflects new `userName` or `avatarBase64` without waiting 5 minutes.

### Pagination for Large Bookshelves
`getBooksByUser` currently fetches all books for a user. For users with hundreds of books, add Firestore cursor pagination:
```js
query(booksCol(email), orderBy("createdAt", "desc"), limit(50), startAfter(lastDoc))
```

### Real-time Listeners (Optional)
For the `edit-bookshelf` page (`FirebaseBookshelf.jsx`), consider replacing `getDocs` with `onSnapshot` so edits from other devices/tabs reflect immediately without a page refresh. The service layer already isolates this change to `books.service.js` only.

### Schema: `userEmail` Field on Books
The current schema stores books in a flat `books` collection with a `userEmail` field. If user counts grow significantly, a subcollection model (`userdata/{email}/books/{bookId}`) would allow Firestore security rules to enforce per-user access at the database level, removing the need for `where("userEmail", "==", email)` queries entirely.

### Error Boundary
Service functions currently `throw` on error and rely on callers to catch. Consider adding a top-level React error boundary around `FirebaseBookshelf` and `BookShelf` to handle network failures gracefully instead of showing a blank or broken page.
