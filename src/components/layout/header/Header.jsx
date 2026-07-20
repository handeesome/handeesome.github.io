import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useTheme } from "../../../contexts/ThemeContext";
import backgroundLight from "/src/assets/images/background_light.webp";
import backgroundDark from "/src/assets/images/background_dark.webp";
import bookQuotes from "../../../static/books/book-quotes.json";
import parse from "html-react-parser";
import { getBooksByUser } from "../../../services/books.service";
import { getAllUsers } from "../../../services/users.service";
import {
  getQuoteBodyText,
  getQuoteContentHtml,
  normalizeQuotes,
} from "../../../features/library/bookshelf/utils/quotes";

const CENHAN_EMAIL = "ducenhandee@gmail.com";
const CENHAN_SHELF_NAME = "乱七八糟de书架";
const HEADER_QUOTE_CACHE_TTL_MS = 5 * 60 * 1000;
// Match react-textfit's ability to keep even unusually long quotes visible.
const HEADER_QUOTE_MIN_FONT_SIZE = 1;
const HEADER_QUOTE_MAX_FONT_SIZE = 40;

let publicQuoteGroupsCache = null;
let publicQuoteGroupsCacheAt = 0;
let publicQuoteGroupsPromise = null;

const AutoFitText = ({ children, contentKey }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return undefined;

    let animationFrameId;
    let cancelled = false;

    const fitText = () => {
      if (cancelled) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        let low = HEADER_QUOTE_MIN_FONT_SIZE;
        let high = HEADER_QUOTE_MAX_FONT_SIZE;
        let best = low;

        while (low <= high) {
          const candidate = Math.floor((low + high) / 2);
          content.style.fontSize = `${candidate}px`;

          const fits =
            content.scrollWidth <= container.clientWidth + 1 &&
            content.scrollHeight <= container.clientHeight + 1;

          if (fits) {
            best = candidate;
            low = candidate + 1;
          } else {
            high = candidate - 1;
          }
        }

        content.style.fontSize = `${best}px`;
      });
    };

    const resizeObserver = new ResizeObserver(fitText);
    resizeObserver.observe(container);
    fitText();
    document.fonts?.ready.then(fitText);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [contentKey]);

  return (
    <div ref={containerRef} className="header-quote-fit">
      <div ref={contentRef} className="header-quote-fit__content">
        {children}
      </div>
    </div>
  );
};

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const buildCenhanQuotePool = () =>
  Object.entries(bookQuotes).flatMap(([bookId, [bookName, quotes = []]]) =>
    quotes.filter(Boolean).map((quote, quoteIndex) => ({
      text: quote,
      html: "",
      book: bookName,
      source: CENHAN_SHELF_NAME,
      quotePath: `/book-shelf/book/${bookId}/notes#quote-${quoteIndex}`,
      shelfPath: "/book-shelf/cenhan",
      bookPath: `/book-shelf/cenhan?layout=detailed&view=all#book-${bookId}`,
    })),
  );

const pickCenhanQuote = () => {
  const cenhanQuotes = buildCenhanQuotePool();
  return cenhanQuotes.length > 0 ? pickRandom(cenhanQuotes) : null;
};

const buildPublicQuoteGroups = async () => {
  const users = await getAllUsers();
  const publicUsersWithQuotes = users.filter(
    (user) =>
      user.id !== CENHAN_EMAIL &&
      user.isPublic !== false &&
      Number(user.quoteCount || 0) > 0,
  );

  const userQuoteGroups = await Promise.all(
    publicUsersWithQuotes.map(async (user) => {
      const userPathName = encodeURIComponent(getUserPathName(user));
      const userBooks = await getBooksByUser(user.id);
      const quotes = userBooks.flatMap((book) =>
        normalizeQuotes(book.quotes).map((quote, index) => ({
          text: getQuoteBodyText(quote),
          html: getQuoteContentHtml(quote),
          book: book.title,
          source: getUserDisplayName(user),
          quotePath: `/book-shelf/${userPathName}/book/${book.id}/quotes#quote-${index}`,
          shelfPath: `/book-shelf/${userPathName}`,
          bookPath: `/book-shelf/${userPathName}?layout=detailed&view=all#book-${book.id}`,
        })),
      );

      return quotes.length > 0
        ? {
            userId: user.id,
            source: getUserDisplayName(user),
            quotes,
          }
        : null;
    }),
  );

  return userQuoteGroups.filter(Boolean);
};

const getPublicQuoteGroups = async () => {
  const now = Date.now();
  if (
    publicQuoteGroupsCache &&
    now - publicQuoteGroupsCacheAt < HEADER_QUOTE_CACHE_TTL_MS
  ) {
    return publicQuoteGroupsCache;
  }

  if (publicQuoteGroupsPromise) return publicQuoteGroupsPromise;

  publicQuoteGroupsPromise = (async () => {
    const groups = await buildPublicQuoteGroups();
    publicQuoteGroupsCache = groups;
    publicQuoteGroupsCacheAt = Date.now();
    publicQuoteGroupsPromise = null;
    return groups;
  })().catch((err) => {
    publicQuoteGroupsPromise = null;
    throw err;
  });

  return publicQuoteGroupsPromise;
};

const pickHeaderQuote = (publicQuoteGroups) => {
  const candidates = [
    { type: "cenhan" },
    ...publicQuoteGroups.map((group) => ({ type: "public", group })),
  ];
  const selectedCandidate = pickRandom(candidates);

  if (selectedCandidate.type === "cenhan") return pickCenhanQuote();
  return pickRandom(selectedCandidate.group.quotes);
};

const getUserDisplayName = (user) =>
  user.shelfName || user.userName || user.id?.split("@")[0] || "Public Shelf";

const getUserPathName = (user) =>
  user.userName?.trim() || user.id?.split("@")[0] || "";

const parseNavigationTarget = (target) => {
  const [pathAndSearch, hash = ""] = target.split("#");
  const [pathname, search = ""] = pathAndSearch.split("?");

  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: hash ? `#${hash}` : "",
  };
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState({
    text: "",
    html: "",
    book: "",
    source: "",
    quotePath: "",
    shelfPath: "",
    bookPath: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Select random quote on component mount or when URL changes
  useEffect(() => {
    if (location.state?.preserveHeaderQuote) return;

    let cancelled = false;

    const selectRandomQuote = async () => {
      if (!publicQuoteGroupsCache) {
        const fallbackQuote = pickCenhanQuote();
        if (!cancelled && fallbackQuote) setSelectedQuote(fallbackQuote);
      }

      try {
        const publicQuoteGroups = await getPublicQuoteGroups();
        const selected = pickHeaderQuote(publicQuoteGroups);
        if (!cancelled && selected) setSelectedQuote(selected);
      } catch (err) {
        console.error("Header selectRandomQuote:", err);
        const fallbackQuote = pickCenhanQuote();
        if (!cancelled && fallbackQuote) setSelectedQuote(fallbackQuote);
      }
    };

    selectRandomQuote();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, location.state]);

  const handleQuoteClick = (event) => {
    event?.stopPropagation();

    if (selectedQuote.quotePath) {
      navigate(parseNavigationTarget(selectedQuote.quotePath), {
        state: { preserveHeaderQuote: true },
      });
    }
  };

  const handleShelfClick = (event) => {
    event?.stopPropagation();

    if (selectedQuote.shelfPath) {
      navigate(parseNavigationTarget(selectedQuote.shelfPath), {
        state: { preserveHeaderQuote: true },
      });
    }
  };

  const handleBookClick = (event) => {
    event?.stopPropagation();

    if (selectedQuote.bookPath) {
      navigate(parseNavigationTarget(selectedQuote.bookPath), {
        state: { preserveHeaderQuote: true },
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = theme === "light" ? backgroundLight : backgroundDark;
    img.onload = () => setImageLoaded(true);
  }, [theme]);

  return (
    <div className="header-container">
      <div
        className="header-background"
        style={{
          backgroundImage: imageLoaded
            ? theme === "light"
              ? `url("${backgroundLight}")`
              : `url("${backgroundDark}")`
            : "none",
          backgroundColor: theme === "light" ? "#f0f0f0" : "#1a1a1a",
          transition: "opacity 0.3s ease",
          opacity: imageLoaded ? 1 : 0.5,
          position: "relative",
        }}
      >
        <NavBar isScrolled={isScrolled} />
        <div className="container h-100 d-flex align-items-start justify-content-center position-relative">
          <div
            className="position-absolute"
            style={{
              top: "15vh",
              width: "80%",
              height: "35vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <AutoFitText
              contentKey={`${selectedQuote.text}:${selectedQuote.html}`}
            >
              <span
                style={{
                  display: "inline-block",
                  cursor: selectedQuote.quotePath ? "pointer" : "default",
                }}
                onClick={handleQuoteClick}
              >
                "{selectedQuote.html ? parse(selectedQuote.html) : selectedQuote.text}"
              </span>
            </AutoFitText>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                margin: "20px 0 0 0",
                minWidth: 0,
                position: "relative",
                zIndex: 2,
              }}
            >
              <button
                type="button"
                style={{
                  appearance: "none",
                  background: "none",
                  border: 0,
                  padding: 0,
                  color: "inherit",
                  minWidth: 0,
                  textAlign: "left",
                  fontSize: "1rem",
                  fontWeight: "500",
                  margin: 0,
                  overflowWrap: "anywhere",
                  cursor: selectedQuote.shelfPath ? "pointer" : "default",
                }}
                onClick={handleShelfClick}
              >
                From {selectedQuote.source}
              </button>
              <button
                type="button"
                style={{
                  appearance: "none",
                  background: "none",
                  border: 0,
                  padding: 0,
                  color: "inherit",
                  minWidth: 0,
                  textAlign: "right",
                  fontSize: "1.125rem",
                  fontWeight: "500",
                  margin: 0,
                  overflowWrap: "anywhere",
                  cursor: selectedQuote.bookPath ? "pointer" : "default",
                }}
                onClick={handleBookClick}
              >
                — {selectedQuote.book}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
