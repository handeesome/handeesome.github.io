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

/**
 * Provides the full user list from Firestore (cached).
 *
 * @returns {{
 *   users: Array,
 *   loading: boolean,
 *   getBookCount: (email: string) => Promise<number>,
 *   getEmailFromDisplayName: (name: string) => Promise<string|null>,
 * }}
 */
export const useUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getAllUsers()
      .then((list) => { if (!cancelled) setUsers(list); })
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
