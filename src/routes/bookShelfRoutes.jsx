import { lazy } from "react";
import { Route } from "react-router-dom";

const MyBookShelf = lazy(() => import("../pages/bookshelf/MyBookShelf.jsx"));
const BookAnalytics = lazy(() => import("../pages/bookshelf/BookAnalytics.jsx"));
const TimeTracker = lazy(() => import("../pages/bookshelf/TimeTracker.jsx"));
const BookShelfPage = lazy(() => import("../pages/bookshelf/BookShelfPage.jsx"));
const BookNotes = lazy(() => import("../pages/bookshelf/BookNotes.jsx"));
const UserBookQuotes = lazy(
  () => import("../pages/bookshelf/UserBookQuotes.jsx"),
);
const UserSelection = lazy(() => import("../pages/bookshelf/UserSelection.jsx"));
const BookShelf = lazy(() => import("../pages/bookshelf/BookShelf.jsx"));

export const bookShelfRoutes = (
  <Route path="/book-shelf">
    <Route index element={<UserSelection />} />
    <Route path=":userName" element={<BookShelf />} />
    <Route path="cenhan" element={<MyBookShelf />} />
    <Route path=":userName/book/:bookId/quotes" element={<UserBookQuotes />} />
    <Route path="book/:bookId/analytics" element={<BookAnalytics />} />
    <Route path="book/:bookId/notes" element={<BookNotes />} />
    <Route path="cenhan/time-tracker" element={<TimeTracker />} />
  </Route>
);

// Separate route for edit (different path pattern)
export const editBookshelfRoute = <Route path="/edit-bookshelf" element={<BookShelfPage />} />;
