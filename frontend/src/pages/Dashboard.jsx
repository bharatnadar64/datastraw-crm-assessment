import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        const tickets = data.tickets; // Access the array from the new response format
        // Calculate counts
        let open = 0,
          inProgress = 0,
          closed = 0;
        tickets.forEach((ticket) => {
          if (ticket.status === "Open") open++;
          else if (ticket.status === "In Progress") inProgress++;
          else if (ticket.status === "Closed") closed++;
        });

        setStats({ total: tickets.length, open, inProgress, closed });

        // Format data for Recharts
        setChartData([
          { name: "Open", count: open, color: "#facc15" }, // Yellow
          { name: "In Progress", count: inProgress, color: "#3b82f6" }, // Blue
          { name: "Closed", count: closed, color: "#22c55e" }, // Green
        ]);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateStats();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Loading metrics...</div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Tickets</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-yellow-400">
          <p className="text-sm font-medium text-gray-500">Open</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.open}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-gray-500">In Progress</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.inProgress}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-gray-500">Closed</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.closed}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tickets by Status
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis allowDecimals={false} stroke="#6b7280" />
            <Tooltip cursor={{ fill: "#f3f4f6" }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
