import { useEffect, useState } from "react";
import Board from "../../components/Board";
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

const DAY_CELL_WIDTH = 70; // px, adjust to your day cell width including margin

const WeekStrip = ({ defaultDate, onDateSelect, readingData }) => {
  const [middleDate, setMiddleDate] = useState(new Date(defaultDate));
  const [isAnimating, setIsAnimating] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const baseOffset = -DAY_CELL_WIDTH;

  const getDatesInRange = (middle) => {
    const dates = [];
    for (let i = -4; i <= 4; i++) {
      const date = new Date(middle);
      date.setDate(middle.getDate() + i);
      dates.push(date);
    }
    return dates.reverse();
  };

  const dates = getDatesInRange(middleDate);

  const navigateDay = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTranslateX(-direction * DAY_CELL_WIDTH);

    setTimeout(() => {
      setTranslateX(0);

      setMiddleDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + direction);
        return newDate;
      });

      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    onDateSelect(middleDate.toDateString());
  }, [middleDate]);

  const onDateClick = (direction) => {
    navigateDay(direction);
  };
  return (
    <div className="week-strip">
      <button onClick={() => navigateDay(-1)}>←</button>
      <div className="week-days-wrapper">
        <div
          className={`week-days ${translateX !== 0 ? "animating" : ""}`}
          style={{ transform: `translateX(${baseOffset + translateX}px)` }}>
          {[...dates].reverse().map((day) => (
            <div
              key={day}
              className={`day-cell ${
                new Date(middleDate).toDateString() === day.toDateString()
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                const dayDiff = Math.round(
                  (day - middleDate) / (1000 * 60 * 60 * 24)
                );
                onDateClick(dayDiff);
              }}>
              <div className="week-of-day">
                {day.toLocaleDateString("en-US", { weekday: "short" })}{" "}
              </div>
              <div className="date">
                {day.toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
              <div className="reading-minutes">
                {readingData[day.getDay()] || 0}m
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => navigateDay(1)}>→</button>
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

// Enhanced color palette with gradients
const GRADIENTS = COLORS.map((color, index) => ({
  id: `gradient${index}`,
  color1: color,
  color2: color + "40", // Adding transparency
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
      virtualIdx += Math.ceil((current - prev) / 60); // Scale gaps more naturally
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

  dayData.forEach(({ description, start, dur }) => {
    const date = new Date(start);
    const minute = date.getHours() * 60 + date.getMinutes();
    const minsSpent = dur / (1000 * 60);

    if (!agg[minute]) agg[minute] = {};
    if (!agg[minute][description]) agg[minute][description] = 0;
    agg[minute][description] += minsSpent;

    // Store session details for enhanced tooltips
    if (!sessionDetails[minute]) sessionDetails[minute] = {};
    sessionDetails[minute][description] = {
      startTime: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: Math.round(minsSpent),
      intensity: Math.min(minsSpent / 30, 1), // Normalize intensity 0-1
    };
  });

  const books = new Set();
  Object.values(agg).forEach((minuteData) => {
    Object.keys(minuteData).forEach((book) => books.add(book));
  });

  const result = [];
  for (let m = 0; m < 1440; m++) {
    const entry = { minute: m };

    // Add reading intensity for heatmap-like visualization
    let totalIntensity = 0;
    books.forEach((book) => {
      entry[book] = null;
      if (agg[m] && agg[m][book]) {
        totalIntensity += agg[m][book];
      }
    });
    entry.totalIntensity = totalIntensity;

    result.push(entry);
  }

  // Enhanced data processing with smoother transitions
  books.forEach((book) => {
    Object.entries(agg).forEach(([startMinute, bookData]) => {
      if (bookData[book]) {
        const start = parseInt(startMinute);
        const duration = bookData[book];
        const end = start + Math.floor(duration);

        // Smooth start and end transitions
        const rampUp = Math.min(3, Math.floor(duration / 4));
        const rampDown = Math.min(3, Math.floor(duration / 4));

        for (let m = start; m < Math.min(end, 1440); m++) {
          let intensity = duration;

          // Apply smooth ramp up/down for better visual flow
          if (m - start < rampUp) {
            intensity *= (m - start + 1) / (rampUp + 1);
          } else if (end - m <= rampDown) {
            intensity *= (end - m) / (rampDown + 1);
          }

          result[m][book] = intensity;
        }
      }
    });
  });

  return { result, books: Array.from(books), sessionDetails };
}

// Custom tooltip component for enhanced information
const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
  sessionDetails,
}) => {
  if (active && payload && payload.length) {
    const realMinute = payload[0]?.payload?.realMinute;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="fw-bold mb-2 text-primary">{`Time: ${formatter(
          label
        )}`}</p>
        {payload.map((entry, index) => {
          if (entry.value && entry.value > 0) {
            const session = sessionDetails[realMinute]?.[entry.dataKey];
            return (
              <div key={index} className="mb-2">
                <div className="d-flex align-items-center mb-1">
                  <div className="rounded me-2" />
                  <span className="fw-bold" style={{ color: entry.color }}>
                    {entry.dataKey}
                  </span>
                </div>
                <div className="small text-muted ms-3">
                  <div>
                    Duration: <strong>{entry.value.toFixed(1)}</strong> minutes
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

  useEffect(() => {
    setLoading(true);
    fetch("/src/data/books/toggl-data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((fetchedData) => {
        setRawData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
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

  if (loading) {
    return (
      <div className="card shadow-sm">
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
      <div className="card shadow-sm border-warning">
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
    <Board title="Time Tracker">
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-body p-4">
          {/* Date Picker */}
          <div className="mb-4 d-flex justify-content-center">
            <WeekStrip
              defaultDate={new Date()}
              onDateSelect={handleDateChange}
              readingData={readingData}
            />
          </div>

          {/* Controls Section */}
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

          {/* Chart Section */}
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
                        formatter={formatter}
                        sessionDetails={sessionDetails}
                      />
                    }
                  />

                  <Legend
                    verticalAlign="top"
                    height={50}
                    wrapperStyle={{
                      paddingBottom: "20px",
                    }}
                  />

                  {/* Reference lines for common reading times */}
                  <ReferenceLine
                    x={480}
                    stroke="#ccc"
                    strokeDasharray="2 2"
                    label="8 AM"
                  />
                  <ReferenceLine
                    x={720}
                    stroke="#ccc"
                    strokeDasharray="2 2"
                    label="12 PM"
                  />
                  <ReferenceLine
                    x={1080}
                    stroke="#ccc"
                    strokeDasharray="2 2"
                    label="6 PM"
                  />

                  {/* Gap indicators */}
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
