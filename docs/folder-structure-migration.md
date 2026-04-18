# Folder Structure Migration Report

**Date:** 2026-04-18  
**Summary:** Restructured project to follow feature-based architecture with co-located styles and clear separation between static data and content.

---

## Before

```
src/
├── App.jsx / App.css
├── ThemeContext.jsx         ← context at root level
├── main.jsx / index.css
├── assets/images/
├── components/
│   ├── (misc shared components)
│   ├── bookShelf/
│   │   └── HideBtnsContext.jsx  ← context inside components folder
│   ├── Avatar.jsx
│   ├── Board.jsx
│   ├── ProfilePictureUpload.jsx
│   ├── header/
│   └── ui/
├── contexts/
│   └── authContext.jsx      ← inconsistent naming (camelCase)
├── data/
│   ├── static-users.json    ← mixed concerns
│   ├── books/
│   │   ├── books.json
│   │   ├── book-quotes.json
│   │   ├── introductions.json
│   │   ├── toggl-data.json
│   │   ├── books_modifications.json
│   │   └── books.csv
│   ├── projects/
│   │   └── *.md             ← markdown mixed with JSON
│   └── studyNotes/
│       └ *.md              ← PascalCase folder name
├── hooks/
│   ├── useBookShelf.js      ← feature-specific hook in shared folder
│   └── useUsers.js
├── lib/
│   └── firebase-config.js
├── pages/
│   ├── BookShelf/           ← PascalCase folder
│   │   ├── FirebaseBookShelf.jsx  ← implementation detail in filename
│   │   ├── BookAnalytics.jsx
│   │   ├── BookNotes.jsx
│   │   ├── TimeTracker.jsx
│   │   ├── MyBookShelf.jsx
│   │   ├── UserSelection.jsx
│   │   ├── BookShelf.jsx
│   │   └── index.js         ← barrel file
│   ├── Games/
│   │   ├── Games.jsx
│   │   ├── Games.module.css
│   │   ├── Sudoku/
│   │   │   ├── Sudoku.jsx
│   │   │   ├── Square.jsx
│   │   │   ├── Sudoku.module.css
│   │   │   ├── Square.module.css
│   │   │   └── index.js     ← unused barrel file
│   │   └── index.js
│   ├── Projects/
│   │   ├── Projects.jsx
│   │   ├── ProjectPage.jsx
│   │   ├── index.jsx        ← barrel file
│   └── StudyNotes.jsx
├── routes/
│   ├── bookShelfRoutes.jsx
│   └── gameRoutes.jsx
├── services/
│   ├── books.service.js
│   ├── profile.service.js
│   └── users.service.js
├── styles/
│   ├── Header.css           ← detached from component
│   ├── Introduction.css     ← detached from page
│   ├── NavBar.css           ← detached from component
│   ├── Projects.css         ← detached from page
│   ├── StudyNotes.css       ← detached from page
│   ├── BookShelf.css        ← detached from component
│   ├── ArticleCard.css      ← detached from component
│   └── index.js             ← all imports centralized
├── utils/
│   ├── HexToRBG.jsx         ← wrong extension, typo in name
│   ├── TagColors.jsx        ← wrong extension
│   ├── cropImage.js
│   └── userUtils.js
└── features/
    └── bookshelf/
        └── components/
            ├── (all bookshelf components)
```

### Problems Identified

1. **ThemeContext.jsx** at `src/` root — contexts should be in `contexts/`
2. **HideBtnsContext.jsx** inside `components/bookShelf/` — contexts belong in `contexts/`
3. **FirebaseBookShelf.jsx** — implementation detail ("Firebase") leaked into filename
4. **styles/** — flat folder of CSS files detached from their components
5. **components/bookShelf/** — mixed pure UI components with complex modals and context
6. **data/** — mixed static JSON seed data with markdown content files
7. **utils/** — contained `.jsx` files for pure utility functions (no JSX rendered)
8. **No clear features/ grouping** — bookshelf logic spread across multiple locations
9. **PascalCase folder names** — inconsistent with kebab-case convention
10. **Barrel files** — unnecessary indirection for lazy imports

---

## After

```
src/
├── App.jsx / App.css
├── main.jsx / index.css
├── assets/
│   └── images/
│       └── games/
│           ├── sudoku.png
│           └── index.js     ← kept: aggregates image exports
├── components/
│   ├── ArticleCard.jsx
│   ├── ArticleCard.css      ← co-located
│   ├── GoBackButton.jsx
│   ├── GoToTopButton.jsx
│   ├── Layout.jsx
│   ├── ScrollToRef.jsx
│   ├── layout/
│   │   └── header/
│   │       ├── Header.jsx
│   │       ├── Header.css   ← co-located
│   │       ├── HomeHeader.jsx
│   │       ├── NavBar.jsx
│   │       ├── NavBar.css   ← co-located
│   │       └── PageHeader.jsx
│   └── ui/
│       ├── Avatar.jsx
│       └── Modal.jsx
├── contexts/
│   ├── AuthContext.jsx      ← PascalCase
│   ├── HideBtnsContext.jsx  ← moved from components/
│   └── ThemeContext.jsx     ← moved from root
├── content/
│   ├── projects/
│   │   ├── auto-pptx.md
│   │   └── hello-world.md
│   └── study-notes/         ← kebab-case
│       └── react-router-dom.md
├── features/
│   ├── bookshelf/
│   │   ├── components/
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookDetailed.jsx
│   │   │   ├── BookFormModal.jsx
│   │   │   ├── BookInfoHeader.jsx
│   │   │   ├── BookQuote.jsx
│   │   │   ├── BookRow.jsx
│   │   │   ├── BookSearchBar.jsx
│   │   │   ├── BookShelf.jsx
│   │   │   ├── BookShelf.css  ← co-located
│   │   │   ├── BookShelfLayouts.jsx
│   │   │   ├── BookShelfNameModal.jsx
│   │   │   ├── BookTimeAnalytics.jsx
│   │   │   ├── CoverDropZone.jsx
│   │   │   ├── FormDataTags.jsx
│   │   │   ├── FormRow.jsx
│   │   │   ├── ProfileFormModal.jsx
│   │   │   ├── ProfilePictureUpload.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── TagManagementModal.jsx
│   │   │   └── UserToggleModal.jsx
│   │   └── hooks/
│   │       └── useBookShelf.js  ← feature-scoped
│   ├── games/
│   │   └── sudoku/
│   │       ├── Sudoku.jsx
│   │       ├── Sudoku.module.css
│   │       ├── Square.jsx
│   │       └── Square.module.css
│   └── profile/
│       └── components/
│           └── Board.jsx    ← shared layout component
├── hooks/
│   └── useUsers.js          ← truly shared hook
├── lib/
│   └── firebase-config.js
├── pages/
│   ├── Home.jsx
│   ├── Introduction.jsx
│   ├── Introduction.css     ← co-located
│   ├── StudyNotes.jsx
│   ├── StudyNotes.css       ← co-located
│   ├── bookshelf/           ← lowercase
│   │   ├── BookAnalytics.jsx
│   │   ├── BookNotes.jsx
│   │   ├── BookShelf.jsx
│   │   ├── BookShelfPage.jsx  ← renamed from FirebaseBookShelf
│   │   ├── MyBookShelf.jsx
│   │   ├── TimeTracker.jsx
│   │   └── UserSelection.jsx
│   ├── games/               ← lowercase
│   │   ├── Games.jsx
│   │   └── Games.module.css
│   └── projects/            ← lowercase
│       ├── Projects.jsx
│       ├── Projects.css     ← co-located
│       └── ProjectPage.jsx
├── routes/
│   ├── bookShelfRoutes.jsx
│   └── gameRoutes.jsx
├── services/
│   ├── books.service.js
│   ├── profile.service.js
│   └── users.service.js
├── static/
│   ├── users.json           ← renamed from static-users.json
│   └── books/
│       ├── books.json
│       ├── book-quotes.json
│       ├── introductions.json
│       ├── toggl-data.json
│       ├── books_modifications.json
│       └── books.csv
├── styles/
│   └── index.js             ← global styles only (Header, NavBar, Bootstrap, ArticleCard)
└── utils/
    ├── cropImage.js
    ├── hexToRgb.js          ← renamed: .js, camelCase, typo fixed
    ├── tagColors.js         ← renamed: .js, camelCase
    └── userUtils.js
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Folders | kebab-case | `bookshelf/`, `study-notes/` |
| Components | PascalCase.jsx | `BookCard.jsx` |
| Contexts | PascalCase.jsx | `AuthContext.jsx` |
| Pages | PascalCase.jsx | `BookShelfPage.jsx` |
| Hooks | camelCase.js | `useBookShelf.js` |
| Services | camelCase.js | `books.service.js` |
| Utils | camelCase.js | `hexToRgb.js` |
| CSS | PascalCase.css or module.css | `BookShelf.css`, `Sudoku.module.css` |

---

## Key Decisions

### 1. Feature-Based Structure
Feature-specific components, hooks, and logic live in `src/features/<feature>/`. Only promote to `src/components/` or `src/hooks/` if used by 2+ unrelated features.

### 2. CSS Co-location with Split
- **Page-specific CSS** → imported directly in the page component
- **Global CSS** → aggregated in `src/styles/index.js` (NavBar, Header, Bootstrap, ArticleCard)

### 3. Data vs Content
- `src/static/` — JSON/CSV seed data bundled at build time
- `src/content/` — Markdown files loaded dynamically via `import.meta.glob`

### 4. Board Component Location
`Board.jsx` moved to `src/features/profile/components/` despite being used by 11 files across multiple features. Consider moving to `src/components/layout/` if it's truly a shared layout primitive.

### 5. Barrel Files Removed
Deleted unnecessary barrel files (`index.js` exports) and simplified lazy imports to point directly at component files:
```js
// Before
const X = lazy(() => import("../pages/bookshelf").then(m => ({ default: m.X })));

// After
const X = lazy(() => import("../pages/bookshelf/X.jsx")));
```

Kept `assets/images/games/index.js` for image aggregation.

---

## Files Moved

| From | To | Reason |
|------|----|----|
| `src/ThemeContext.jsx` | `src/contexts/ThemeContext.jsx` | Contexts folder |
| `src/components/bookShelf/HideBtnsContext.jsx` | `src/contexts/HideBtnsContext.jsx` | Contexts folder |
| `src/contexts/authContext.jsx` | `src/contexts/AuthContext.jsx` | PascalCase naming |
| `src/components/Board.jsx` | `src/features/profile/components/Board.jsx` | Profile-scoped |
| `src/hooks/useBookShelf.js` | `src/features/bookshelf/hooks/useBookShelf.js` | Feature-scoped hook |
| `src/pages/BookShelf/` | `src/pages/bookshelf/` | Lowercase folder |
| `src/pages/BookShelf/FirebaseBookShelf.jsx` | `src/pages/bookshelf/BookShelfPage.jsx` | Remove impl detail |
| `src/pages/Games/Sudoku/` | `src/features/games/sudoku/` | Self-contained feature |
| `src/pages/Games/` | `src/pages/games/` | Lowercase folder |
| `src/pages/Projects/` | `src/pages/projects/` | Lowercase folder |
| `src/data/static-users.json` | `src/static/users.json` | Static data folder |
| `src/data/books/*.json` | `src/static/books/*.json` | Static data folder |
| `src/data/projects/*.md` | `src/content/projects/*.md` | Content folder |
| `src/data/studyNotes/*.md` | `src/content/study-notes/*.md` | Content folder, kebab-case |
| `src/utils/HexToRBG.jsx` | `src/utils/hexToRgb.js` | .js extension, camelCase, typo fix |
| `src/utils/TagColors.jsx` | `src/utils/tagColors.js` | .js extension, camelCase |
| `src/components/Avatar.jsx` | `src/components/ui/Avatar.jsx` | UI primitive |
| CSS files | Co-located with components/pages | See CSS section below |

---

## CSS Migration Details

| From | To | Import Location |
|------|----|----|
| `src/styles/NavBar.css` | `src/components/layout/header/NavBar.css` | `src/styles/index.js` (global) |
| `src/styles/Header.css` | `src/components/layout/header/Header.css` | `src/styles/index.js` (global) |
| `src/styles/ArticleCard.css` | `src/components/ArticleCard.css` | `src/styles/index.js` (global) |
| `src/styles/Introduction.css` | `src/pages/Introduction.css` | Direct import in `Introduction.jsx` |
| `src/styles/StudyNotes.css` | `src/pages/StudyNotes.css` | Direct import in `StudyNotes.jsx` |
| `src/styles/Projects.css` | `src/pages/projects/Projects.css` | Direct import in `Projects.jsx` |
| `src/styles/BookShelf.css` | `src/features/bookshelf/components/BookShelf.css` | Direct import in `BookShelf.jsx` |

**`src/styles/index.js` now contains only:**
```js
import "../components/layout/header/Header.css";
import "../components/layout/header/NavBar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/ArticleCard.css";
```

---

## Deleted Files

| File | Reason |
|------|--------|
| `src/data/` (folder) | Empty after migration |
| `src/pages/bookshelf/index.js` | Barrel file — unnecessary |
| `src/pages/projects/index.jsx` | Barrel file — unnecessary |
| `src/features/games/sudoku/index.js` | Barrel file — unused and broken import |

---

## Verification Checklist

After migration, verify:

1. **Dev server starts** without import errors
2. **All routes work:**
   - `/` (Home)
   - `/projects` and `/projects/:slug`
   - `/study-notes`
   - `/book-shelf`, `/book-shelf/:userName`, `/book-shelf/cenhan`
   - `/book-shelf/book/:id/analytics`, `/book-shelf/book/:id/notes`
   - `/book-shelf/cenhan/time-tracker`
   - `/edit-bookshelf`
   - `/games` and `/games/sudoku`
3. **Styles render correctly** on all pages
4. **Firebase/auth flows work** on `/edit-bookshelf`
5. **No console errors** about missing imports

---

## Future Recommendations

1. **Consider moving Board.jsx** to `src/components/layout/Board.jsx` since it's used across many features (not just profile)
2. **Add feature folders** for other self-contained domains as they emerge (e.g., `features/blog/`, `features/analytics/`)
3. **Keep barrel files** only for truly useful aggregation (image assets, complex subfolder exports)
4. **Document this structure** in CLAUDE.md for AI assistant context