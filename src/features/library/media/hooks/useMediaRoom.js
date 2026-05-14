import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addMedia as svcAddMedia,
  deleteMedia as svcDeleteMedia,
  getMediaByUser,
  removeShelfFromMedia,
  removeTagFromMedia,
  renameShelfOnMedia,
  updateMedia as svcUpdateMedia,
} from "../../../../services/media.service";
import {
  getProfile,
  removeTagColor,
  upsertTagColor,
} from "../../../../services/profile.service";

const ADMIN_EMAIL = "ducenhandee@gmail.com";
const MEDIA_CACHE_TTL_MS = 5 * 60 * 1000;
const mediaCache = new Map();

const DEFAULT_PROFILE = {
  userName: "",
  shelfName: "",
  shelfDescription: "",
  avatarBase64: "",
  isPublic: true,
  quoteCount: 0,
  tagColors: {},
};

const getCachedMediaRoom = (email) => {
  const cached = mediaCache.get(email);
  if (!cached) return null;

  if (Date.now() - cached.cachedAt > MEDIA_CACHE_TTL_MS) {
    mediaCache.delete(email);
    return null;
  }

  return cached;
};

const setCachedMediaRoom = (email, mediaItems, profileData) => {
  if (!email) return;

  mediaCache.set(email, {
    mediaItems,
    profileData,
    cachedAt: Date.now(),
  });
};

export const useMediaRoom = (user, currentViewingUserEmail = null) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [profileData, setProfileData] = useState({ ...DEFAULT_PROFILE });
  const [loading, setLoading] = useState(true);
  const [editingMedia, setEditingMedia] = useState(null);

  const getCurrentUserEmail = useMemo(
    () => currentViewingUserEmail ?? user?.email ?? null,
    [currentViewingUserEmail, user?.email]
  );

  const getCurrentUserId = useMemo(() => {
    if (currentViewingUserEmail) {
      return currentViewingUserEmail.replace(/[^a-zA-Z0-9]/g, "_");
    }
    return user?.uid ?? null;
  }, [currentViewingUserEmail, user?.uid]);

  const canEdit = useMemo(() => {
    if (!user) return false;
    if (user.email === ADMIN_EMAIL) return true;
    if (!currentViewingUserEmail) return true;
    return user.email === currentViewingUserEmail;
  }, [currentViewingUserEmail, user]);

  const allShelves = useMemo(
    () => [...new Set(mediaItems.flatMap((item) => item.shelves ?? []))],
    [mediaItems]
  );

  const tagColors = profileData.tagColors ?? {};

  const fetchMedia = useCallback(async () => {
    if (!getCurrentUserEmail) {
      setLoading(false);
      return;
    }

    const cachedMediaRoom = getCachedMediaRoom(getCurrentUserEmail);

    if (cachedMediaRoom) {
      setMediaItems(cachedMediaRoom.mediaItems);
      setProfileData(cachedMediaRoom.profileData);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const [fetchedMedia, fetchedProfile] = await Promise.all([
        getMediaByUser(getCurrentUserEmail),
        getProfile(getCurrentUserEmail),
      ]);
      setCachedMediaRoom(getCurrentUserEmail, fetchedMedia, fetchedProfile);
      setMediaItems(fetchedMedia);
      setProfileData(fetchedProfile);
    } catch (err) {
      console.error("useMediaRoom fetchMedia:", err);
      if (!cachedMediaRoom) {
        setMediaItems([]);
        setProfileData({ ...DEFAULT_PROFILE });
      }
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserEmail]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    if (!loading && getCurrentUserEmail) {
      setCachedMediaRoom(getCurrentUserEmail, mediaItems, profileData);
    }
  }, [getCurrentUserEmail, loading, mediaItems, profileData]);

  const addMedia = useCallback(
    async (mediaData) => {
      if (!canEdit || !getCurrentUserEmail) return false;
      try {
        const created = await svcAddMedia(
          getCurrentUserEmail,
          getCurrentUserId,
          mediaData
        );
        setMediaItems((prev) => [created, ...prev]);
        return true;
      } catch (err) {
        console.error("addMedia:", err);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail, getCurrentUserId]
  );

  const updateMedia = useCallback(
    async (mediaId, mediaData) => {
      if (!canEdit) return false;
      try {
        await svcUpdateMedia(mediaId, mediaData);
        setMediaItems((prev) =>
          prev.map((item) =>
            item.id === mediaId ? { ...item, ...mediaData } : item
          )
        );
        setEditingMedia(null);
        return true;
      } catch (err) {
        console.error("updateMedia:", err);
        return false;
      }
    },
    [canEdit]
  );

  const deleteMedia = useCallback(
    async (mediaId) => {
      if (!canEdit) return false;
      if (!window.confirm("Are you sure you want to delete this media item?")) {
        return false;
      }

      try {
        await svcDeleteMedia(mediaId);
        setMediaItems((prev) => prev.filter((item) => item.id !== mediaId));
        return true;
      } catch (err) {
        console.error("deleteMedia:", err);
        return false;
      }
    },
    [canEdit]
  );

  const handleEditMedia = useCallback(
    (mediaId) => {
      if (!canEdit) return;
      setEditingMedia(mediaItems.find((item) => item.id === mediaId) ?? null);
    },
    [canEdit, mediaItems]
  );

  const addTagColor = useCallback(
    async (tagName, color) => {
      if (!canEdit || !tagName || !getCurrentUserEmail) return false;
      try {
        await upsertTagColor(getCurrentUserEmail, tagName, color);
        setProfileData((prev) => ({
          ...prev,
          tagColors: { ...prev.tagColors, [tagName]: color },
        }));
        return true;
      } catch (err) {
        console.error("addMediaTagColor:", err);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail]
  );

  const updateTagColor = addTagColor;

  const deleteTagColor = useCallback(
    async (tagName) => {
      if (!canEdit || !tagName || !getCurrentUserEmail) return false;
      if (!window.confirm(`Are you sure you want to delete the tag "${tagName}"?`)) {
        return false;
      }

      try {
        await removeTagFromMedia(mediaItems, tagName);
        await removeTagColor(getCurrentUserEmail, tagName);
        setMediaItems((prev) =>
          prev.map((item) =>
            item.tags?.includes(tagName)
              ? { ...item, tags: item.tags.filter((tag) => tag !== tagName) }
              : item
          )
        );
        setProfileData((prev) => {
          const { [tagName]: _, ...rest } = prev.tagColors ?? {};
          return { ...prev, tagColors: rest };
        });
        return true;
      } catch (err) {
        console.error("deleteMediaTagColor:", err);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail, mediaItems]
  );

  const renameShelf = useCallback(
    async (oldShelfName, newShelfName) => {
      if (!canEdit || !oldShelfName || !newShelfName) return false;
      if (oldShelfName === newShelfName || allShelves.includes(newShelfName)) {
        return false;
      }

      try {
        await renameShelfOnMedia(mediaItems, oldShelfName, newShelfName);
        setMediaItems((prev) =>
          prev.map((item) =>
            item.shelves?.includes(oldShelfName)
              ? {
                  ...item,
                  shelves: item.shelves.map((shelf) =>
                    shelf === oldShelfName ? newShelfName : shelf
                  ),
                }
              : item
          )
        );
        return true;
      } catch (err) {
        console.error("renameMediaShelf:", err);
        return false;
      }
    },
    [allShelves, canEdit, mediaItems]
  );

  const deleteShelf = useCallback(
    async (shelfName) => {
      if (!canEdit || !shelfName) return false;
      const affected = mediaItems.filter((item) =>
        item.shelves?.includes(shelfName)
      );
      const msg =
        affected.length > 0
          ? `Are you sure you want to delete the shelf "${shelfName}"? This will remove it from ${affected.length} media item(s).`
          : `Are you sure you want to delete the shelf "${shelfName}"?`;
      if (!window.confirm(msg)) return false;

      try {
        await removeShelfFromMedia(mediaItems, shelfName);
        setMediaItems((prev) =>
          prev.map((item) =>
            item.shelves?.includes(shelfName)
              ? {
                  ...item,
                  shelves: item.shelves.filter((shelf) => shelf !== shelfName),
                }
              : item
          )
        );
        return true;
      } catch (err) {
        console.error("deleteMediaShelf:", err);
        return false;
      }
    },
    [canEdit, mediaItems]
  );

  const getTagColor = useCallback(
    (tag) => tagColors[tag] ?? "#6c757d",
    [tagColors]
  );

  return {
    mediaItems,
    tagColors,
    allShelves,
    loading,
    editingMedia,
    profileData,
    canEdit,
    addMedia,
    updateMedia,
    deleteMedia,
    handleEditMedia,
    addTagColor,
    updateTagColor,
    deleteTagColor,
    getTagColor,
    renameShelf,
    deleteShelf,
    setEditingMedia,
    setAllShelves: () => {},
  };
};
