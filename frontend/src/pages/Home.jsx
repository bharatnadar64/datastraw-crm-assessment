import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import TicketRow from "../components/TicketRow";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        params.append("page", page);
        params.append("limit", 5); // Fetching 5 per page so you can see pagination easily

        const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        setTickets(data.tickets); // Access the tickets array from the new response object
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTickets();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, status, page]); // Re-run when page changes too

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
        <h1 className="text-xl font-bold text-gray-800">Support Tickets</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4 font-medium">Ticket ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  Loading tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <TicketRow key={ticket.ticket_id} ticket={ticket} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
