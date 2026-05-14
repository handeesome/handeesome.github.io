# Library and Media Refactor Report

**Date:** 2026-05-15  
**Summary:** Renamed the bookshelf experience into a broader Library, added a standalone Media collection, shared authentication/profile controls, and refactored common collection UI so Books and Media can evolve together without mixing their data.

---

## 1. Overview

### Goal
Add a place for movie and TV reviews without turning books and media into one combined collection. The new experience keeps Books as the default collection, adds Media as an optional second collection, and presents both under a single Library entry point.

### Scope
- Renamed the main bookshelf route/page concept into Library
- Added a standalone Media collection backed by a separate Firestore collection
- Kept Books and Media under one shared Google-authenticated Library experience
- Added a centered Books/Media switch inside the collection body
- Reused bookshelf modal primitives for the Media form
- Shared collection filters and layout switch controls
- Added Media grid, detailed, and table views
- Added Media add/edit modals with TinyMCE review editing
- Cleaned up first-pass media UI differences to better match Books
- Preserved legacy bookshelf routes for backwards compatibility

---

## 2. User-Facing Changes

### Navigation
The navbar now shows `Library` instead of `Book Shelf`.

The Library owner selection page is now the entry point for user libraries. Each user is treated as a library owner, and users enter a single Library route rather than choosing between separate book/media routes from the navbar.

### Collection Switch
Inside a library, Books and Media are switched with a centered toggle above the Grid/Detailed/Table layout controls.

Key details:
- Books remains the default collection
- Media is optional and does not add extra navbar clutter
- The switch uses a distinct green button style so it does not look like the blue layout switch
- The label is `Media`, not `Media Room`

### Edit Library
The edit page now manages the whole Library.

Key changes:
- Books are shown first by default
- Media can be reached from the Books/Media switch
- The same Google auth session controls both collections
- The same profile modal is shared
- `Modify Profile` is available in the edit page title area
- The old separate `Set Private` button was removed because profile visibility already lives inside the profile modal

---

## 3. Media Collection

### Data Model
Media items are stored in a separate Firestore collection:

```txt
media
```

This keeps media reads and writes separate from books, so users who only use books do not pay extra data-fetch cost for media item documents.

### Media Fields
Media supports:
- Cover image
- Shelves
- Tags
- Added date
- Title
- Director
- Cast
- Rating
- Review

Media intentionally does not include:
- Book author
- Page count
- Started date
- Finished date
- Quotes
- Reading sessions
- Time tracker

### Add/Edit Media Modal
The Media modal mirrors the polished book modal style while keeping media-specific fields.

Key changes:
- Uses the shared modal shell and form sections
- Uses the shared cover dropzone
- Uses the shared shelf manager
- Uses the shared tag manager
- Uses TinyMCE for Review, matching the book Notes editor behavior
- Review takes a full-width section for easier writing
- Cover upload has a larger area for posters/screenshots
- Shelves and Tags sit side by side so their Manage buttons stay close to the options
- Cast placeholder uses `cast1, cast2` to communicate multiple names

---

## 4. Shared Collection UI

### New Shared Components
The Library feature now has shared collection-level controls:

```txt
src/features/library/components/
├── CollectionFilters.jsx
├── CollectionLayoutSwitch.jsx
└── LibraryCollectionSwitch.jsx
```

### CollectionFilters
Shared by Books and Media.

Responsibilities:
- Shelf filter
- Tag filter
- Filter count display
- Clear filter behavior
- Tag color rendering

### CollectionLayoutSwitch
Shared by Books and Media.

Layout options:
- `🏁 Grid View`
- `📖 Detailed View`
- `📋 Table View`

### LibraryCollectionSwitch
Shared by public and edit library pages.

Collection options:
- Books
- Media

This switch is now passed into `BookShelf` and `MediaRoom` as a body-level slot instead of being placed in the page title actions.

---

## 5. Books vs Media Behavior

### Books
Books keep their existing richer reading-specific behavior:
- Reading Sessions
- Time Tracker
- Notes/Quotes routes
- Started/Finished/Added dates
- Pages
- Static Cenhan bookshelf support
- Existing book cover fallback logic

### Media
Media mirrors the main collection browsing behavior:
- Grid view
- Detailed view
- Table view
- Shelf filtering
- Tag filtering
- Tag color display
- Add/edit/delete actions on the edit page
- Public read-only display

Media-specific display:
- Director replaces Author
- Cast is shown in grid, detailed, and table contexts
- Review appears at the bottom of detailed view, like book notes/introduction
- Long reviews use the same Show More / Show Less clamp behavior as books

---

## 6. Refactor: Folder and Naming Changes

### Library Feature Structure
Bookshelf and Media now live under the broader Library feature:

```txt
src/features/library/
├── bookshelf/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── components/
└── media/
    ├── components/
    └── hooks/
```

This reflects the product model:
- Library is the parent experience
- Bookshelf is one collection inside Library
- Media is another collection inside Library

### Page Names
The old bookshelf page names were renamed where the page is now library-wide:

| Old | New |
|-----|-----|
| `UserSelection.jsx` | `LibraryOwners.jsx` |
| `BookShelf.jsx` | `Library.jsx` |
| `BookShelfPage.jsx` | `EditLibrary.jsx` |
| `MyBookShelf.jsx` | `StaticBookshelf.jsx` |

Book-specific pages remain book-specific:
- `BookNotes.jsx`
- `BookAnalytics.jsx`
- `UserBookQuotes.jsx`
- `ReadingTimeline.jsx`
- `TimeTracker.jsx`

### Routes
Primary routes now use Library naming:

```txt
/library
/library/:userName
/edit-library
```

Legacy bookshelf routes remain available:

```txt
/book-shelf
/book-shelf/:userName
/edit-bookshelf
```

---

## 7. Firestore and Hook Changes

### New Media Service
New file:

```txt
src/services/media.service.js
```

Responsibilities:
- `getMediaByUser`
- `addMedia`
- `updateMedia`
- `deleteMedia`
- `removeTagFromMedia`
- `renameShelfOnMedia`
- `removeShelfFromMedia`

### New Media Hook
New file:

```txt
src/features/library/media/hooks/useMediaRoom.js
```

Responsibilities:
- Media item state
- Media profile state
- Media loading state
- Editing media state
- Permission checks
- Media CRUD callbacks
- Media tag color callbacks
- Media shelf rename/delete callbacks
- 5-minute media/profile cache

### Tag Color Sync
Book and Media use the same profile document for tag colors, but they keep separate item collections.

When adding or updating a tag color from the edit page:
- Book tag state is updated
- Media tag state is updated
- The Media modal can see new tags without refreshing the page

This prevents a tag added in the Add Book modal from being missing in the Add Media modal during the same session.

### Shelf State
Shelves are derived from existing items in both Books and Media.

The add/edit modals also keep local shelf options so a newly added shelf appears immediately before any item has been saved with that shelf.

---

## 8. First-Pass Cleanup

After the initial media implementation, several rough edges were aligned with Books.

### Loading State
Before:
- Media displayed plain `Loading media...`

After:
- Media uses the same skeleton loader style as Books
- Media title also uses a skeleton title loader

### Tag Overflow
Before:
- Media grid/table silently truncated tags

After:
- Media grid shows `+N more`
- Media table shows `+N` with a tooltip for additional tags

### Detailed Review
Before:
- Media review appeared under tags in the right-side metadata column

After:
- Media review appears at the bottom of the detailed card
- Long review text supports Show More / Show Less

### Error Handling
Before:
- Some media tag/shelf operations could throw directly from async Firebase calls

After:
- Media hook operations use `try/catch`
- Failures return `false`, matching the book hook style

### Public Hide Flags
Before:
- Public media used fewer hidden-action context flags than books

After:
- Public media receives the same relevant hidden-action context flags for consistency

---

## 9. File-by-File Changes

### `src/components/layout/header/NavBar.jsx`
- Changed nav label/route from bookshelf to Library

### `src/routes/libraryRoutes.jsx`
- Replaces the old bookshelf route file
- Defines `/library`, `/library/:userName`, and `/edit-library`
- Keeps legacy bookshelf routes working

### `src/pages/library/LibraryOwners.jsx`
- Replaces the old user selection page concept
- Presents users as Library owners
- Entry action is now `Enter Library`
- Google sign-in wording/icon was tightened

### `src/pages/library/Library.jsx`
- Public Library route
- Resolves user display name to email
- Shows Books by default
- Shows Media when `collection=media`
- Passes the Books/Media switch into the collection body

### `src/pages/library/EditLibrary.jsx`
- Authenticated edit page for both Books and Media
- Books are default
- Media is selected with `collection=media`
- Adds Add Book / Add Media actions depending on active collection
- Shares profile editing, user switching, sign out, and Google auth
- Syncs tag add/update across book and media tag states

### `src/pages/library/StaticBookshelf.jsx`
- Supports the same body-level collection switch slot for the static Cenhan bookshelf

### `src/features/library/bookshelf/components/BookShelf.jsx`
- Uses shared `CollectionFilters`
- Uses shared `CollectionLayoutSwitch`
- Accepts a body-level `collectionSwitch` prop
- Keeps book-specific loading skeletons and time-tracker behavior

### `src/features/library/media/components/MediaRoom.jsx`
- New Media collection display component
- Supports grid, detailed, and table layouts
- Uses shared filters and layout switch
- Accepts the same body-level `collectionSwitch` prop
- Uses skeleton loading
- Keeps URL state for layout/shelf/tags

### `src/features/library/media/components/MediaCard.jsx`
- Defines Media grid card, detailed card, and table row
- Shows title, director, cast, shelf, tags, rating, actions
- Detailed review appears at the bottom with Show More / Show Less
- Tag overflow display matches Books

### `src/features/library/media/components/MediaFormModal.jsx`
- New add/edit media modal
- Reuses book modal primitives and shared form helpers
- Uses TinyMCE review editor
- Provides media-specific fields only

### `src/features/library/media/hooks/useMediaRoom.js`
- New media state hook
- Mirrors the book hook where appropriate
- Adds media cache and safer async operation handling

### `src/services/media.service.js`
- New Firestore service for the `media` collection
- Keeps media CRUD and media batch updates separate from books

### `src/features/library/components/CollectionFilters.jsx`
- Shared collection filter UI for Books and Media

### `src/features/library/components/CollectionLayoutSwitch.jsx`
- Shared layout toggle for Books and Media

### `src/features/library/components/LibraryCollectionSwitch.jsx`
- Shared Books/Media switch
- Uses green button styling to distinguish it from the blue layout switch

---

## 10. Before vs After

| Area | Before | After |
|------|--------|-------|
| Navbar | `Book Shelf` route entry | `Library` route entry |
| Public entry page | User selection for bookshelves | Library owners page |
| Collections | Books only | Books by default, optional Media |
| Routes | `/book-shelf`, `/edit-bookshelf` | `/library`, `/edit-library`, legacy routes preserved |
| Media data | Did not exist | Separate `media` Firestore collection |
| Auth | Bookshelf-specific edit experience | Shared Library auth for Books and Media |
| Collection switching | Not needed | Centered Books/Media switch inside collection body |
| Layout switch | Books only | Shared by Books and Media |
| Filters | Books only | Shared shelf/tag filters |
| Media modal | Did not exist | Add/Edit Media modal using shared primitives |
| Media review | N/A | TinyMCE editor and detailed-view clamp |
| Tag colors | Book-only local view | Add/update syncs across Books and Media |
| Loading state | Book skeletons only | Media now uses matching skeletons |

---

## 11. Verification

Build verification:

```bash
npm run build
```

Final build result:
- Vite production build passes
- No import or JSX compilation errors
- Existing chunk-size warnings remain unrelated to this work

Manual behavior checked during development:
- Library route renders Books by default
- Media route is selected with `collection=media`
- Add Media modal opens and submits through media hook/service
- Tag added in book modal appears in media modal without refresh
- Media detailed review uses bottom placement and expand behavior
- Books/Media switch appears above Grid/Detailed/Table controls

---

## 12. Notes and Tradeoffs

### Shared Enough, Not Over-Abstracted
Books and Media now share collection-level controls, modal primitives, tag management, shelf management, cover dropzone, and rating display.

The actual cards/rows remain separate because Books and Media have different fields and actions. This avoids a generic component that would require too many conditionals too early.

### Shared Profile, Separate Collections
Books and Media share:
- Google auth
- Profile data
- Avatar
- Public/private visibility
- Tag colors

Books and Media do not share:
- Item documents
- Shelves derived from items
- CRUD services
- Reading-specific actions

### Legacy Route Compatibility
Legacy bookshelf routes are preserved so old links do not break immediately. The primary user-facing path is now Library.

---

## 13. Future Recommendations

### Extract Collection Item Primitives
If Media grows, consider extracting smaller reusable pieces rather than one giant generic card:
- `CollectionTagList`
- `CollectionShelfList`
- `CollectionRatingBlock`
- `CollectionActionButtons`
- `ExpandableMarkdown`

This would reduce duplication while keeping Book and Media cards readable.

### Decide Whether Tag Delete Should Sync
Tag add/update currently syncs across Books and Media. Tag delete remains collection-specific to avoid double confirmation and accidental removal from the other collection.

If the intended model is one global library tag set, create a shared delete flow that removes the tag from both item collections with one confirmation.

### Consider Media Search/Import Later
Books have a search/import affordance. Media currently relies on uploaded covers and manual entry. If the Media collection grows, consider adding metadata lookup later.

### Move Shared Modal Components Out of Bookshelf
Media currently imports shared modal helpers from the bookshelf component folder. This works, but long-term those helpers could move to:

```txt
src/features/library/components/forms/
```

Candidates:
- `CoverDropZone`
- `FormDataTags`
- `FormRow`
- `BookShelfNameModal`
- `TagManagementModal`
- `ModalFormParts`

### Rename Shelf Terminology Later
Books use “Bookshelves” naturally. Media also uses shelves for now. If Media grows, a future pass could rename UI copy to “Collections” or “Lists” while keeping the underlying field name stable.

