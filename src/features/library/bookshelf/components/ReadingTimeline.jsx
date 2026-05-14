import "./ReadingTimeline.css";
import { useNavigate } from "react-router-dom";
import books from "../../../../static/books/books.json";
import togglData from "../../../../static/books/toggl-data.json";
import { getBookCoverSrc, handleBookCoverError } from "../utils/bookCovers";

const parseBookDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date.replaceAll("/", "-"));
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getMonthLabel = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

const getBookDisplayTitle = (book) => {
  if (book.title2) return book.title2;

  return book.title.split(":")[0].trim();
};

const monthlyReadingMinutes = togglData.reduce((months, entry) => {
  const startDate = new Date(entry.start);

  if (Number.isNaN(startDate.getTime())) {
    return months;
  }

  const monthKey = getMonthKey(startDate);
  months[monthKey] = (months[monthKey] || 0) + entry.dur / 60000;
  return months;
}, {});

const timelineItems = Object.values(
  books.reduce((months, book) => {
    const dateRead = parseBookDate(book["date read"]);

    if (!dateRead || !book.shelves?.includes("read")) {
      return months;
    }

    const monthKey = getMonthKey(dateRead);

    if (!months[monthKey]) {
      months[monthKey] = {
        key: monthKey,
        date: dateRead,
        label: getMonthLabel(dateRead),
        books: [],
      };
    }

    months[monthKey].books.push(book);
    return months;
  }, {})
).sort((a, b) => b.date - a.date);

const ReadingTimeline = () => {
  const navigate = useNavigate();

  return (
    <section className="reading-timeline">
      <ol className="timeline-list">
        {timelineItems.map((item) => (
          <li className="timeline-item" key={item.key}>
            <time className="timeline-date">
              <span>{item.label}</span>
              <span className="timeline-minutes">
                {Math.round(monthlyReadingMinutes[item.key] || 0)} mins
              </span>
            </time>
            <div className="timeline-marker" />

            <div className="timeline-content">
              {item.books.map((book) => (
                <button
                  className="timeline-book"
                  key={book.id}
                  type="button"
                  onClick={() => navigate(`/book-shelf/book/${book.id}/notes`)}
                >
                  <img
                    className="timeline-book-cover"
                    src={getBookCoverSrc(book)}
                    alt={book.title}
                    onError={(e) => handleBookCoverError(e, book)}
                  />
                  <h3>{getBookDisplayTitle(book)}</h3>
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ReadingTimeline;
