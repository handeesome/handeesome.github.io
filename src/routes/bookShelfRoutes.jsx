import { lazy } from "react";
import { Route } from "react-router-dom";

const MyBookShelf = lazy(() => import("../pages/bookshelf").then((module) => ({ default: module.MyBookShelf })));
const BookAnalytics = lazy(() => import("../pages/bookshelf").then((module) => ({ default: module.BookAnalytics })));
const TimeTracker = lazy(() => import("../pages/bookshelf").then((module) => ({ default: module.TimeTracker })));
const BookShelfPage = lazy(() => import("../pages/bookshelf").then((module) => ({ default: module.BookShelfPage })));
const BookNotes = lazy(() => import("../pages/bookshelf").then((module) => ({ default: module.BookNotes })));
const UserSelection = lazy(() => import("../pages/bookshelf").then((module) => ({ default: module.UserSelection })));
const BookShelf = lazy(() => import("../pages/bookshelf").then((module) => ({ default: module.BookShelf })));

export const bookShelfRoutes = (
  <Route path="/book-shelf">
    <Route index element={<UserSelection />} />
    <Route path=":userName" element={<BookShelf />} />
    <Route path="cenhan" element={<MyBookShelf />} />
    <Route path="book/:bookId/analytics" element={<BookAnalytics />} />
    <Route path="book/:bookId/notes" element={<BookNotes />} />
    <Route path="cenhan/time-tracker" element={<TimeTracker />} />
  </Route>
);

// Separate route for edit (different path pattern)
export const editBookshelfRoute = <Route path="/edit-bookshelf" element={<BookShelfPage />} />;
