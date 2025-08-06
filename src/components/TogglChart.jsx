import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
  "#00c49f",
];
function compressTimeline(data, books, gapThreshold = 120, buffer = 30) {
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

  // Sort minutes
  const activeMinuteArray = Array.from(activeMinutes).sort((a, b) => a - b);

  // Map real minutes to virtual compressed scale
  const virtualMap = new Map();
  let virtualIdx = 0;
  for (let i = 0; i < activeMinuteArray.length; i++) {
    const current = activeMinuteArray[i];
    const prev = activeMinuteArray[i - 1];

    if (prev !== undefined && current - prev > gapThreshold) {
      virtualIdx += 1; // Add a skip for visual separation (optional)
    } else if (i !== 0) {
      virtualIdx += 1;
    }

    virtualMap.set(current, virtualIdx);
  }

  // Filter and remap data
  const compressedData = activeMinuteArray.map((realMinute) => {
    const original = data[realMinute];
    return {
      virtualMinute: virtualMap.get(realMinute),
      realMinute,
      ...original,
    };
  });

  // Provide formatter to convert virtualMinute → real time
  function formatMinute(min) {
    const real =
      compressedData.find((d) => d.virtualMinute === min)?.realMinute ?? 0;
    const hours = Math.floor(real / 60);
    const mins = real % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  return { compressedData, formatMinute };
}

function aggregateDataByDay(rawData, selectedDate) {
  // Filter data for the selected date
  const dayData = rawData.filter(({ start }) => {
    const entryDate = new Date(start).toDateString();
    return entryDate === new Date(selectedDate).toDateString();
  });

  // { hour: { book: totalHours } }
  const agg = {};

  dayData.forEach(({ description, start, dur }) => {
    const date = new Date(start);
    const hour = date.getHours();
    const minute = hour * 60 + date.getMinutes();
    const minsSpent = dur / (1000 * 60); // ms to minutes

    if (!agg[minute]) agg[minute] = {};
    if (!agg[minute][description]) agg[minute][description] = 0;
    agg[minute][description] += minsSpent;
  });

  // Get all unique books for this day
  const books = new Set();
  Object.values(agg).forEach((hourData) => {
    Object.keys(hourData).forEach((book) => books.add(book));
  });

  // Create array for chart
  const result = [];
  for (let m = 0; m < 1440; m++) {
    result.push({ minute: m });
  }

  // Fill in reading sessions
  books.forEach((book) => {
    // Initialize all points to null (creates gaps)
    result.forEach((entry) => (entry[book] = null));

    Object.entries(agg).forEach(([startMinute, bookData]) => {
      if (bookData[book]) {
        const start = parseInt(startMinute);
        const duration = bookData[book];
        const end = start + Math.floor(duration);

        result[start][book] = 0; // Start at 0
        if (start + 1 < 1440) result[start + 1][book] = duration; // Ramp up

        // Maintain reading level
        for (let m = start + 2; m < Math.min(end - 1, 1440); m++) {
          result[m][book] = duration;
        }
        if (end - 1 < 1440) result[end - 1][book] = duration;
        if (end < 1440) result[end][book] = 0;
        if (end + 1 < 1440) result[end + 1][book] = null;
      }
    });
  });
  return { result, books: Array.from(books) };
}

function getAvailableDates(rawData) {
  const dates = new Set();
  rawData.forEach(({ start }) => {
    const date = new Date(start).toDateString();
    dates.add(date);
  });
  return Array.from(dates).sort((a, b) => new Date(b) - new Date(a)); // Most recent first
}

const MultiBookChart = () => {
  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);
  const [books, setBooks] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [formatter, setFormatter] = useState(() => (m) => m);

  useEffect(() => {
    fetch("/toggl-data.json")
      .then((res) => res.json())
      .then((fetchedData) => {
        setRawData(fetchedData);
        const dates = getAvailableDates(fetchedData);
        setAvailableDates(dates);

        // Set the most recent date as default
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (rawData.length > 0 && selectedDate) {
      const { result, books } = aggregateDataByDay(rawData, selectedDate);
      const { compressedData, formatMinute } = compressTimeline(result, books);
      setData(compressedData);
      setBooks(books);
      setFormatter(() => formatMinute); // store formatter in state
    }
  }, [rawData, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const formatDateForDisplay = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalMinutesForDay = rawData
    .filter(({ start }) => {
      const entryDate = new Date(start).toDateString();
      return entryDate === new Date(selectedDate).toDateString();
    })
    .reduce((total, entry) => total + entry.dur / (1000 * 60), 0); // dur in ms → minutes

  return (
    <div style={{ width: "100%", height: 500 }}>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 15,
          flexWrap: "wrap",
        }}>
        <h3 style={{ margin: 0 }}>Daily Reading Tracker</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label htmlFor="date-select" style={{ fontWeight: "bold" }}>
            Date:
          </label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={handleDateChange}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
              minWidth: "200px",
            }}>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {formatDateForDisplay(date)}
              </option>
            ))}
          </select>
        </div>
        {selectedDate && (
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              padding: "4px 8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}>
            Total: {totalMinutesForDay.toFixed(1)} minutes
          </div>
        )}
      </div>

      {data.length > 0 && books.length > 0 ? (
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="virtualMinute"
              tickFormatter={formatter}
              interval="preserveStartEnd"
              minTickGap={30}
              label={{
                value: "Hour (0-23)",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{ value: "Minites", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value, name) => [`${value.toFixed(1)} minutes`, name]}
              labelFormatter={(virtualMinute) => formatter(virtualMinute)}
            />
            <Legend verticalAlign="top" height={36} />
            {books.map((book, index) => (
              <Line
                key={book}
                type="linear"
                dataKey={book}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 300,
            color: "#666",
            fontSize: "16px",
          }}>
          {selectedDate ? "No reading data for this day" : "Loading..."}
        </div>
      )}
    </div>
  );
};

export default MultiBookChart;
