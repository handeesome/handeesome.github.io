import "./ReadingTimeline.css";
import books from "../../../static/books/books.json";

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
  return (
    <section className="reading-timeline">
      <ol className="timeline-list">
        {timelineItems.map((item) => (
          <li className="timeline-item" key={item.key}>
            <time className="timeline-date">{item.label}</time>
            <div className="timeline-marker" />

            <div className="timeline-content">
              {item.books.map((book) => (
                <article className="timeline-book" key={book.id}>
                  <img
                    className="timeline-book-cover"
                    src={book.coverBase64 || `/images/bookCovers/${book.id}.jpg`}
                    alt={book.title}
                    onError={(e) => {
                      e.currentTarget.src = "/default-cover.jpg";
                    }}
                  />
                  <h3>{getBookDisplayTitle(book)}</h3>
                </article>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ReadingTimeline;
