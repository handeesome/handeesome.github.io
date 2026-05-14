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
  BarChart,
  Bar,
} from "recharts";
import togglData from "../../../../static/books/toggl-data.json";
import { useTheme } from "../../../../contexts/ThemeContext";

const BookTimeAnalytics = ({ bookTitle, bookTitle2 }) => {
  const [rawData, setRawData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [totalStats, setTotalStats] = useState({});
  const [viewMode, setViewMode] = useState("daily"); // 'daily', 'sessions', 'patterns'
  const { theme } = useTheme();

  useEffect(() => {
    // Filter data for this specific book
    const bookData = togglData.filter((entry) => {
      if (!entry.description) return false;

      const desc = entry.description.toLowerCase();
      const title1 = bookTitle?.toLowerCase();
      const title2 = bookTitle2?.toLowerCase();

      return (
        (title1 && desc.includes(title1)) || (title2 && desc.includes(title2))
      );
    });

    setRawData(bookData);
    generateAnalytics(bookData);
  }, [bookTitle, bookTitle2]);

  const generateAnalytics = (data) => {
    if (!data.length) return;

    // Generate daily aggregation
    const dailyAgg = {};
    const sessions = [];

    data.forEach((entry) => {
      const date = new Date(entry.start).toDateString();
      const duration = entry.dur / (1000 * 60); // Convert to minutes

      // Daily aggregation
      if (!dailyAgg[date]) {
        dailyAgg[date] = { date, totalMinutes: 0, sessionCount: 0 };
      }
      dailyAgg[date].totalMinutes += duration;
      dailyAgg[date].sessionCount += 1;

      // Individual sessions
      sessions.push({
        date: new Date(entry.start).toLocaleDateString(),
        startTime: new Date(entry.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: Math.round(duration),
        dayOfWeek: new Date(entry.start).toLocaleDateString("en-US", {
          weekday: "short",
        }),
      });
    });

    // Fill in missing dates
    const dates = Object.keys(dailyAgg).map((date) => new Date(date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Create entries for all dates between min and max
    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      const dateString = currentDate.toDateString();
      if (!dailyAgg[dateString]) {
        dailyAgg[dateString] = {
          date: dateString,
          totalMinutes: 0,
          sessionCount: 0,
        };
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Convert to arrays and sort
    const dailyArray = Object.values(dailyAgg)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        ...item,
        minutes: item.totalMinutes,
        dateFormatted: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));

    setDailyData(dailyArray);
    setSessionData(sessions.slice(-20)); // Last 20 sessions

    // Calculate total stats
    const totalMinutes = data.reduce(
      (sum, entry) => sum + entry.dur / (1000 * 60),
      0
    );
    const totalDays = new Set(
      data.map((entry) => new Date(entry.start).toDateString())
    ).size;
    const avgSessionLength = Math.round(totalMinutes / data.length);

    setTotalStats({
      totalMinutes: Math.round(totalMinutes),
      totalSessions: data.length,
      totalDays,
      avgSessionLength,
      longestSession: Math.max(
        ...data.map((entry) => Math.round(entry.dur / (1000 * 60)))
      ),
      firstSession: new Date(
        Math.min(...data.map((entry) => new Date(entry.start)))
      ).toLocaleDateString(),
      lastSession: new Date(
        Math.max(...data.map((entry) => new Date(entry.start)))
      ).toLocaleDateString(),
    });
  };

  const darkBg = theme === "dark" ? "bg-dark" : "";

  const StatCard = ({ title, value, unit, icon }) => (
    <div className="col-md-3 mb-3">
      <div className={`card h-100 ${darkBg}`}>
        <div className="card-body text-center">
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
          <h5 className="card-title">{title}</h5>
          <h3 className="text-primary">
            {value} <small className="text-muted">{unit}</small>
          </h3>
        </div>
      </div>
    </div>
  );

  if (!rawData.length) {
    return (
      <div style={{ width: "100%", minHeight: 400 }}>
        <div className="alert alert-info text-center">
          <h4>📊 No Reading Data Found</h4>
          <p>
            No time tracking data found for{" "}
            <strong>
              {bookTitle} {bookTitle2}
            </strong>
            .{" "}
          </p>
          <p className="mb-0">
            The book has <b>not started yet </b> or it had{" "}
            <b>finished before August 2025</b>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* View Mode Selector */}
      <div className="mb-4 text-center">
        <div className="btn-group" role="group">
          <button
            className={`btn ${
              viewMode === "daily" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setViewMode("daily")}>
            📊 Daily Progress
          </button>
          <button
            className={`btn ${
              viewMode === "sessions" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setViewMode("sessions")}>
            📈 Session History
          </button>
        </div>
      </div>

      {/* Charts */}
      <div style={{ height: 400, marginBottom: 20 }}>
        {viewMode === "daily" && (
          <ResponsiveContainer>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateFormatted" />
              <YAxis
                label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value.toFixed(1)} minutes`,
                  "Reading Time",
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                }}
              />
              <Bar dataKey="totalMinutes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {viewMode === "sessions" && (
          <ResponsiveContainer>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateFormatted" />
              <YAxis
                label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${Math.round(value)} minutes`,
                  "Reading Time",
                ]}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalMinutes"
                stroke="#8884d8"
                strokeWidth={3}
                name="Daily Reading Time"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats Overview */}
      <div className="row mb-4">
        <StatCard
          title="Total Reading Time"
          value={totalStats.totalMinutes}
          unit="minutes"
          icon="📚"
        />
        <StatCard
          title="Reading Sessions"
          value={totalStats.totalSessions}
          unit="sessions"
          icon="📖"
        />
        <StatCard
          title="Days Read"
          value={totalStats.totalDays}
          unit="days"
          icon="📅"
        />
        <StatCard
          title="Avg Per Day"
          value={Math.round(totalStats.totalMinutes / totalStats.totalDays)}
          unit="minutes"
          icon="⏱️"
        />
      </div>

      {/* Recent Sessions Table */}
      <div className={`card ${darkBg}`}>
        <div className="card-header">
          <h5>📋 Recent Reading Sessions</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className={`table table-sm ${
                theme === "dark" ? "table-dark" : ""
              }`}>
              <thead>
                <tr className="text-white">
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>Duration</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                {sessionData
                  .slice(-10)
                  .reverse()
                  .map((session, index) => (
                    <tr key={index}>
                      <td>{session.date}</td>
                      <td>{session.startTime}</td>
                      <td>{session.duration} min</td>
                      <td>{session.dayOfWeek}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTimeAnalytics;
