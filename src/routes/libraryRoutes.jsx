import { lazy } from "react";
import { Route } from "react-router-dom";

const BookAnalytics = lazy(
  () => import("../pages/library/BookAnalytics.jsx"),
);
const TimeTracker = lazy(() => import("../pages/library/TimeTracker.jsx"));
const EditLibrary = lazy(() => import("../pages/library/EditLibrary.jsx"));
const BookNotes = lazy(() => import("../pages/library/BookNotes.jsx"));
const UserBookQuotes = lazy(
  () => import("../pages/library/UserBookQuotes.jsx"),
);
const LibraryOwners = lazy(() => import("../pages/library/LibraryOwners.jsx"));
const Library = lazy(() => import("../pages/library/Library.jsx"));
const ReadingTimeline = lazy(
  () => import("../pages/library/ReadingTimeline.jsx"),
);

const createLibraryRoutes = (basePath) => (
  <Route path={basePath}>
    <Route index element={<LibraryOwners />} />
    <Route path=":userName" element={<Library />} />
    <Route path=":userName/book/:bookId/quotes" element={<UserBookQuotes />} />
    <Route path="book/:bookId/analytics" element={<BookAnalytics />} />
    <Route path="book/:bookId/notes" element={<BookNotes />} />
    <Route path="cenhan/time-tracker" element={<TimeTracker />} />
    <Route path="cenhan/reading-timeline" element={<ReadingTimeline />} />
  </Route>
);

export const libraryRoutes = (
  <>
    {createLibraryRoutes("/library")}
    {createLibraryRoutes("/book-shelf")}
  </>
);

// Separate route for edit (different path pattern)
export const editLibraryRoute = (
  <>
    <Route path="/edit-library" element={<EditLibrary />} />
    <Route path="/edit-bookshelf" element={<EditLibrary />} />
  </>
);
