import { useEffect, useRef, useState } from "react";
import Board from "../../features/profile/components/Board";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Brush,
  ReferenceLine,
} from "recharts";
import togglData from "../../static/books/toggl-data.json";
import { useTheme } from "../../contexts/ThemeContext";
import GoBackBtn from "../../components/GoBackButton";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { Overlay, Popover } from "react-bootstrap";

const WeekStrip = ({ defaultDate, onDateSelect, readingData }) => {
  const [middleDate, setMiddleDate] = useState(new Date(defaultDate));
  const [isAnimating, setIsAnimating] = useState(false);
  const wrapperRef = useRef(null);
  const selectedCellRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const CalendarRef = useRef(null);

  const getDatesInRange = (middle) => {
    const dates = [];
    for (let i = -15; i <= 15; i++) {
      const date = new Date(middle);
      date.setDate(middle.getDate() + i);
      dates.push(date);
    }
    return dates.reverse();
  };

  const getHeatLevel = (minutes) => {
    if (!minutes) return null;
    if (minutes >= 240) return "heat-4";
    if (minutes >= 180) return "heat-3";
    if (minutes >= 90) return "heat-2";
    return "heat-1";
  };

  const dates = getDatesInRange(middleDate);

  const centerSelecetedCell = () => {
    if (wrapperRef.current && selectedCellRef.current) {
      const wrapper = wrapperRef.current;
      const selectedCell = selectedCellRef.current;

      const wrapperWidth = wrapper.clientWidth;
      const cellWidth = selectedCell.clientWidth;

      const cellOffsetLeft = selectedCell.offsetLeft;

      const scrollLeft = cellOffsetLeft - wrapperWidth / 2 + cellWidth / 2;

      wrapper.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  const navigateDay = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setMiddleDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + direction);
        return newDate;
      });

      setIsAnimating(false);
    }, 150);
  };

  useEffect(() => {
    onDateSelect(middleDate.toDateString());

    setTimeout(() => centerSelecetedCell(), 100);
  }, [middleDate]);

  const onDateClick = (direction) => {
    navigateDay(direction);
  };

  return (
    <div className="week-strip">
      <div ref={wrapperRef} className="week-days-wrapper">
        <div className={"week-days"}>
          {[...dates].reverse().map((day) => {
            const isSelected =
              new Date(middleDate).toDateString() === day.toDateString();
            return (
              <div
                key={day.toISOString()}
                ref={isSelected ? selectedCellRef : null}
                className={`day-cell ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  const dayDiff = Math.round(
                    (day - middleDate) / (1000 * 60 * 60 * 24)
                  );
                  onDateClick(dayDiff);
                }}>
                <div className="week-of-day mb-1">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="date mb-1">
                  {day.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
                <div className="reading-minutes">
                  {Math.round(readingData[day.toDateString()]?.totalMinutes) ||
                    0}{" "}
                  mins
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button ref={CalendarRef} onClick={() => setShowCalendar(!showCalendar)}>
        <FontAwesomeIcon icon={faCalendar} />
      </button>
      <Overlay
        target={CalendarRef.current}
        show={showCalendar}
        placement="bottom-end">
        {(props) => (
          <Popover {...props} className="calendar-popover">
            <Popover.Body>
              <Calendar
                locale="en-us"
                onChange={(date) => {
                  setMiddleDate(date);
                  setShowCalendar(false);
                }}
                value={middleDate}
                tileClassName={({ date, view }) => {
                  if (view !== "month") return null;
                  const key = date.toDateString();
                  const minutes = readingData[key]?.totalMinutes;
                  return getHeatLevel(minutes);
                }}
                tileContent={({ date, view }) => {
                  if (view !== "month") return null;
                  const key = date.toDateString();
                  const minutes = readingData[key]?.totalMinutes;

                  if (minutes) {
                    return (
                      <div
                        style={{
                          fontSize: "0.65rem",
                          marginTop: "2px",
                          fontWeight: "500",
                        }}>
                        {Math.round(minutes)}m
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Popover.Body>
          </Popover>
        )}
      </Overlay>
    </div>
  );
};

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#98D8C8",
  "#DDA0DD",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
];

const GRADIENTS = COLORS.map((color, index) => ({
  id: `gradient${index}`,
  color1: color,
  color2: color + "40",
}));

function compressTimeline(data, books, gapThreshold = 90, buffer = 20) {
  const activeMinutes = new Set();

  data.forEach((entry, idx) => {
    for (const book of books) {
      if (entry[book] !== null && entry[book] !== undefined) {
        for (
          let i = Math.max(0, idx - buffer);
          i <= Math.min(1439, idx + buffer);
          i++
        ) {
          activeMinutes.add(i);
        }
        break;
      }
    }
  });

  const activeMinuteArray = Array.from(activeMinutes).sort((a, b) => a - b);
  const virtualMap = new Map();
  let virtualIdx = 0;

  for (let i = 0; i < activeMinuteArray.length; i++) {
    const current = activeMinuteArray[i];
    const prev = activeMinuteArray[i - 1];

    if (prev !== undefined && current - prev > gapThreshold) {
      virtualIdx += Math.ceil((current - prev) / 60);
    } else if (i !== 0) {
      virtualIdx += 1;
    }

    virtualMap.set(current, virtualIdx);
  }

  const compressedData = activeMinuteArray.map((realMinute) => {
    const original = data[realMinute];
    return {
      virtualMinute: virtualMap.get(realMinute),
      realMinute,
      timeLabel: formatTimeLabel(realMinute),
      ...original,
    };
  });

  function formatMinute(min) {
    const real =
      compressedData.find((d) => d.virtualMinute === min)?.realMinute ?? 0;
    return formatTimeLabel(real);
  }

  return { compressedData, formatMinute };
}

function formatTimeLabel(minute) {
  const hours = Math.floor(minute / 60);
  const mins = minute % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${mins.toString().padStart(2, "0")} ${period}`;
}

function aggregateDataByDay(rawData, selectedDate) {
  const dayData = rawData.filter(({ start }) => {
    const entryDate = new Date(start).toDateString();
    return entryDate === new Date(selectedDate).toDateString();
  });

  const agg = {};
  const sessionDetails = {};
  const sessionsByBook = {};

  dayData.forEach(({ description, start, dur }) => {
    if (!sessionsByBook[description]) {
      sessionsByBook[description] = [];
    }

    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + dur);
    const startMinute = startDate.getHours() * 60 + startDate.getMinutes();
    const endMinute = endDate.getHours() * 60 + endDate.getMinutes();
    const minsSpent = dur / (1000 * 60);

    sessionsByBook[description].push({
      startMinute,
      endMinute,
      startDate,
      endDate,
      minsSpent,
      sessionInfo: {
        startTime: startDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: endDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: Math.round(minsSpent),
        actualStart: startDate,
        actualEnd: endDate,
      },
    });
  });

  Object.entries(sessionsByBook).forEach(([description, sessions]) => {
    sessions.forEach(({ startMinute, endMinute, minsSpent, sessionInfo }) => {
      if (!agg[startMinute]) agg[startMinute] = {};
      if (!agg[startMinute][description]) agg[startMinute][description] = 0;
      agg[startMinute][description] += minsSpent;

      for (
        let minute = startMinute;
        minute < Math.min(endMinute, 1440);
        minute++
      ) {
        if (!sessionDetails[minute]) sessionDetails[minute] = {};

        if (
          !sessionDetails[minute][description] ||
          sessionInfo.actualStart <
            sessionDetails[minute][description].actualStart
        ) {
          sessionDetails[minute][description] = sessionInfo;
        }
      }
    });
  });

  const books = new Set();
  Object.values(agg).forEach((minuteData) => {
    Object.keys(minuteData).forEach((book) => books.add(book));
  });

  const result = [];
  for (let m = 0; m < 1440; m++) {
    const entry = { minute: m };
    books.forEach((book) => {
      entry[book] = null;
    });
    result.push(entry);
  }

  books.forEach((book) => {
    Object.entries(agg).forEach(([startMinute, bookData]) => {
      if (bookData[book]) {
        const start = parseInt(startMinute);
        const duration = bookData[book];
        const end = start + Math.floor(duration);

        for (let m = start; m < Math.min(end, 1440); m++) {
          result[m][book] = duration;
        }
      }
    });
  });

  return { result, books: Array.from(books), sessionDetails };
}

const CustomTooltip = ({ active, payload, sessionDetails, theme }) => {
  if (active && payload && payload.length) {
    const realMinute = payload[0]?.payload?.realMinute;

    return (
      <div
        className={`p-3 border rounded shadow-lg ${
          theme === "dark" ? "bg-dark" : "bg-white"
        }`}>
        {payload.map((entry, index) => {
          if (entry.value && entry.value > 0) {
            const session = sessionDetails[realMinute]?.[entry.dataKey];

            const startTime = session?.startTime || formatTimeLabel(realMinute);
            const endTime =
              session?.endTime ||
              formatTimeLabel(
                Math.min(realMinute + Math.floor(entry.value), 1439)
              );
            const duration = session?.duration || entry.value.toFixed(1);

            return (
              <div key={index} className="mb-2">
                <div className="d-flex align-items-center mb-1">
                  <div
                    className="rounded me-2"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: entry.color,
                    }}
                  />
                  <span className="fw-bold" style={{ color: entry.color }}>
                    {entry.dataKey}
                  </span>
                </div>
                <div className="small text-muted ms-3">
                  <div>
                    Start: <strong>{startTime}</strong>
                  </div>
                  <div>
                    End: <strong>{endTime}</strong>
                  </div>
                  <div>
                    Duration: <strong>{duration}</strong> minutes
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};

const TogglChart = () => {
  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);
  const [books, setBooks] = useState([]);
  const [sessionDetails, setSessionDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [formatter, setFormatter] = useState(() => (m) => m);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    setRawData(togglData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (rawData.length > 0 && selectedDate) {
      const { result, books, sessionDetails } = aggregateDataByDay(
        rawData,
        selectedDate
      );
      const { compressedData, formatMinute } = compressTimeline(result, books);
      setData(compressedData);
      setBooks(books);
      setSessionDetails(sessionDetails);
      setFormatter(() => formatMinute);
    }
  }, [rawData, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event);
  };

  const formatDateForDisplay = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readingData = rawData.reduce((data, entry) => {
    const dateKey = new Date(entry.start).toDateString();
    if (!data[dateKey]) {
      data[dateKey] = {
        totalMinutes: 0,
        totalHours: 0,
        sessionsCount: 0,
      };
    }
    data[dateKey].totalMinutes += entry.dur / (1000 * 60);
    data[dateKey].totalHours = data[dateKey].totalMinutes / 60;
    data[dateKey].sessionsCount += 1;

    return data;
  }, {});

  const cardDark = theme === "dark" ? "card bg-dark" : "card";

  if (loading) {
    return (
      <div className={`shadow-sm ${cardDark}`}>
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading reading data...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`shadow-sm border-warning ${cardDark}`}>
        <div className="card-body text-center py-5">
          <div className="text-warning mb-3" style={{ fontSize: "3rem" }}>
            ⚠️
          </div>
          <h5 className="text-warning">Error Loading Data</h5>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Board
      title="Time Tracker"
      titleRight={
        <GoBackBtn defaultDest="/book-shelf" text="Back to Book Shelf" />
      }>
      <div className={`shadow-lg border-0 mb-4 ${cardDark}`}>
        <div className="card-body p-4">
          <div className="mb-4 d-flex justify-content-center">
            <WeekStrip
              defaultDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
              onDateSelect={handleDateChange}
              readingData={readingData}
            />
          </div>

          <div className="mb-4">
            {selectedDate && (
              <div className="text-lg-end">
                <div className="row g-2">
                  <div className="col-4">
                    <div className="bg-primary bg-opacity-10 rounded p-2 text-center">
                      <div className="fw-bold text-primary">
                        {readingData[selectedDate]
                          ? Math.round(
                              readingData[selectedDate].totalHours * 100
                            ) / 100
                          : 0}
                      </div>
                      <small className="text-muted">Hours</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-success bg-opacity-10 rounded p-2 text-center">
                      <div className="fw-bold text-success">
                        {readingData[selectedDate]
                          ? Math.round(readingData[selectedDate].totalMinutes)
                          : 0}
                      </div>
                      <small className="text-muted">Minutes</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-info bg-opacity-10 rounded p-2 text-center">
                      <div className="fw-bold text-info">
                        {readingData[selectedDate]
                          ? readingData[selectedDate].sessionsCount
                          : 0}
                      </div>
                      <small className="text-muted">Sessions</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ height: 500 }}>
            {data.length > 0 && books.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    {GRADIENTS.map((gradient, index) => (
                      <linearGradient
                        key={gradient.id}
                        id={gradient.id}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="5%"
                          stopColor={gradient.color1}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={gradient.color1}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    ))}
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e0e0e0"
                    opacity={0.7}
                  />

                  <XAxis
                    dataKey="virtualMinute"
                    tickFormatter={formatter}
                    interval="preserveStartEnd"
                    minTickGap={60}
                    stroke="#666"
                    fontSize={11}
                    tick={{ fill: "#666" }}
                  />

                  <YAxis
                    stroke="#666"
                    fontSize={11}
                    tick={{ fill: "#666" }}
                    label={{
                      value: "Reading Duration (minutes)",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        textAnchor: "middle",
                        fill: "#666",
                        fontSize: "12px",
                      },
                    }}
                  />

                  <Tooltip
                    content={
                      <CustomTooltip
                        sessionDetails={sessionDetails}
                        theme={theme}
                      />
                    }
                  />

                  <Legend
                    verticalAlign={window.innerWidth < 768 ? "bottom" : "top"}
                    height={50}
                    wrapperStyle={{ paddingBottom: "10px" }}
                  />

                  {(() => {
                    const gaps = [];
                    for (let i = 1; i < data.length; i++) {
                      const currentReal = data[i].realMinute;
                      const prevReal = data[i - 1].realMinute;
                      const timeDiff = currentReal - prevReal;

                      if (timeDiff > 60) {
                        const gapHours = Math.floor(timeDiff / 60);
                        const gapMins = timeDiff % 60;
                        const gapLabel =
                          gapHours > 0
                            ? `${gapHours}h ${gapMins}m gap`
                            : `${gapMins}m gap`;

                        gaps.push(
                          <ReferenceLine
                            key={`gap-${i}`}
                            x={data[i].virtualMinute}
                            stroke="#ff6b6b"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            label={{
                              value: gapLabel,
                              position: "top",
                              style: {
                                fill: "#ff6b6b",
                                fontSize: "10px",
                                fontWeight: "bold",
                              },
                            }}
                          />
                        );
                      }
                    }
                    return gaps;
                  })()}

                  {books.map((book, index) => (
                    <Area
                      key={book}
                      type="monotone"
                      dataKey={book}
                      stackId="1"
                      stroke={COLORS[index % COLORS.length]}
                      fill={`url(#gradient${index % GRADIENTS.length})`}
                      strokeWidth={2}
                      connectNulls={false}
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: COLORS[index % COLORS.length],
                        stroke: "white",
                        strokeWidth: 2,
                      }}
                    />
                  ))}

                  <Brush
                    dataKey="timeLabel"
                    height={30}
                    stroke={COLORS[0]}
                    travellerWidth={10}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📖</div>
                <h5 className="text-muted mb-2">No Reading Data</h5>
                <p className="text-muted mb-0">
                  {selectedDate
                    ? `No reading sessions recorded for ${formatDateForDisplay(
                        selectedDate
                      )}`
                    : "Loading reading data..."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Board>
  );
};

export default TogglChart;
