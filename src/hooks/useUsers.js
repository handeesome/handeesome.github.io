// hooks/useUsers.js
// ─────────────────────────────────────────────────────────────────────────────
// React state wrapper around users.service.js.
// Pages that need the user list import this hook — they never call
// getAllUsers() directly.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  getAllUsers,
  getEmailFromDisplayName,
  getBookCountForUser,
} from "../services/users.service";
import staticUsers from "../data/static-users.json";

/**
 * Provides the full user list from Firestore (cached).
 * Seeds immediately from static-users.json so avatars render without waiting
 * for the network. The Firestore fetch runs in the background and merges in
 * any users not present in the static file.
 *
 * @returns {{
 *   users: Array,
 *   loading: boolean,
 *   getBookCount: (email: string) => Promise<number>,
 *   getEmailFromDisplayName: (name: string) => Promise<string|null>,
 * }}
 */
export const useUsers = () => {
  const [users,   setUsers]   = useState(staticUsers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAllUsers()
      .then((list) => {
        if (cancelled) return;
        // Merge: live data wins for existing ids, new ids are appended
        const staticIds = new Set(staticUsers.map((u) => u.id));
        const extra = list.filter((u) => !staticIds.has(u.id));
        if (extra.length > 0) setUsers([...staticUsers, ...extra]);
      })
      .catch((err) => { console.error("useUsers:", err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return {
    users,
    loading,
    getBookCount:            getBookCountForUser,
    getEmailFromDisplayName,
  };
};
